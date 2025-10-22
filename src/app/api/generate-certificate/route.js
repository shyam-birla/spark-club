// File: app/api/generate-certificate/route.js

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { client } from '../../../../sanity/lib/client';
import { v4 as uuidv4 } from 'uuid';

// VERCEL-FRIENDLY IMPORTS
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium-min';
import QRCode from 'qrcode';

// Sanity client with write permissions
const writeClient = client.withConfig({
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
  ignoreBrowserTokenWarning: true,
});

export async function POST(request) {
  const session = await getServerSession(authOptions);

  // Authentication and Authorization check
  if (!session || !session.user || session.user.role !== 'admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { eventId, userIds, templateId } = await request.json();

    if (!eventId || !userIds || !Array.isArray(userIds) || userIds.length === 0 || !templateId) {
      return NextResponse.json({ message: 'Missing eventId, userIds (array), or templateId' }, { status: 400 });
    }

    const generatedCertificates = [];

    for (const userId of userIds) {
      // 1. Fetch Event, User Profile, and Template
      const [event, userProfile, certificateTemplate] = await Promise.all([
        client.fetch(
          `*[_type == "event" && _id == $eventId][0]{
            title,
            "slug": slug.current
          }`,
          { eventId }
        ),
        client.fetch(
          `*[_type == "profile" && _id == $userId][0]{
            userName
          }`,
          { userId }
        ),
        client.fetch(
          `*[_type == "certificateTemplate" && _id == $templateId][0]{
            htmlContent,
            cssContent
          }`,
          { templateId }
        ),
      ]);

      if (!event) {
        console.warn(`Event with ID ${eventId} not found for user ${userId}. Skipping.`);
        continue; // Skip to next user if event not found
      }
      if (!userProfile) {
        console.warn(`User profile with ID ${userId} not found. Skipping.`);
        continue; // Skip to next user if user profile not found
      }
      if (!certificateTemplate) {
        console.warn(`Certificate template with ID ${templateId} not found for user ${userId}. Skipping.`);
        continue; // Skip to next user if template not found
      }


    // 2. Generate Unique ID and Verification URL
    const uniqueId = uuidv4();
    const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-certificate/${uniqueId}`;

    // 3. Generate QR Code (Asli Code)
    const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, {
      errorCorrectionLevel: 'M',
      margin: 1,
    });

    // 4. Prepare HTML for Puppeteer
    let fullHtml = `
      <html>
      <head>
        <style>
          body { margin: 0; padding: 0; font-family: sans-serif; }
          ${certificateTemplate.cssContent}
        </style>
      </head>
      <body>
        ${certificateTemplate.htmlContent}
      </body>
      </html>
    `;

    // Replace placeholders
    fullHtml = fullHtml.replace(/{{userName}}/g, userProfile.userName || '');
    fullHtml = fullHtml.replace(/{{eventName}}/g, event.title || '');
    fullHtml = fullHtml.replace(/{{issueDate}}/g, new Date().toLocaleDateString('en-IN') || ''); // Indian date format
    fullHtml = fullHtml.replace(/{{verificationUrl}}/g, verificationUrl || '');
    fullHtml = fullHtml.replace(/{{qrCodeImage}}/g, `<img src="${qrCodeDataUrl}" alt="QR Code" style="width: 100px; height: 100px;" />`);

    // 5. Generate PDF using Puppeteer (Asli Code for Vercel)
    const executablePath = await chromium.executablePath(process.env.CHROMIUM_PATH);

    const browser = await puppeteer.launch({
      args: [...chromium.args, '--no-sandbox', '--disable-setuid-sandbox'],
      executablePath: executablePath || undefined,
      headless: 'new',
    });

    const page = await browser.newPage();
    await page.setContent(fullHtml, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      landscape: true, // Ise 'false' kar dein agar certificate portrait (lamba) hai
    });

    await browser.close();

    // 6. Upload PDF to Sanity
    const asset = await writeClient.assets.upload('file', pdfBuffer, {
      filename: `${event.slug}-${userProfile.userName}-certificate.pdf`,
      contentType: 'application/pdf',
    });

    // 7. Create Certificate Document in Sanity
    await writeClient.create({
      _type: 'certificate',
      title: `${event.title} - Certificate for ${userProfile.userName}`,
      uniqueId: uniqueId,
      issueDate: new Date().toISOString(),
      event: { _type: 'reference', _ref: eventId },
      userProfile: { _type: 'reference', _ref: userId },
      certificateFile: {
        _type: 'file',
        asset: {
          _type: 'reference',
          _ref: asset._id,
        },
      },
      verificationUrl: verificationUrl,
      certificateTemplate: { _type: 'reference', _ref: templateId },
    });

      generatedCertificates.push({
        userId,
        userName: userProfile.userName,
        certificateUrl: asset.url,
      });
    }

    return NextResponse.json({ message: `Successfully generated ${generatedCertificates.length} certificates.`, certificates: generatedCertificates }, { status: 200 });

  } catch (error) {
    console.error('Error generating certificate:', error);
    return NextResponse.json({ message: 'Failed to generate certificate', error: error.message }, { status: 500 });
  }
}