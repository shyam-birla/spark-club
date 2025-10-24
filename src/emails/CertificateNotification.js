import * as React from 'react';

const CertificateNotification = ({ userName, eventName, certificateUrl }) => (
  <html lang="en">
    <head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Your Certificate from Spark Community!</title>
      <style>
        body {
          font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
        }
        .header {
          background-color: #000000; /* Black */
          padding: 30px 20px;
          text-align: center;
          color: #ffffff;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: bold;
        }
        .content {
          padding: 30px;
          color: #333333;
          line-height: 1.6;
          font-size: 16px;
        }
        .content p {
          margin-bottom: 15px;
        }
        .button-container {
          text-align: center;
          margin: 30px 0;
        }
        .button {
          display: inline-block;
          background-color: #ff6600; /* Orange */
          color: #ffffff;
          padding: 12px 25px;
          border-radius: 5px;
          text-decoration: none;
          font-weight: bold;
          font-size: 16px;
        }
        .footer {
          background-color: #f0f0f0;
          padding: 20px;
          text-align: center;
          color: #777777;
          font-size: 12px;
          border-top: 1px solid #eeeeee;
        }
        .footer a {
          color: #ff6600;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Spark Community</h1>
        </div>
        <div class="content">
          <p>Hello ${userName},</p>
          <p>We are thrilled to inform you that your certificate for participating in <strong>${eventName}</strong> is now ready!</p>
          <p>Thank you for being a valuable part of our community and for your active participation. We hope you gained valuable insights and enjoyed the experience.</p>
          <div class="button-container">
            <a href="${certificateUrl}" class="button">Download Your Certificate</a>
          </div>
          <p>If you have any questions, feel free to reach out to us.</p>
          <p>Best Regards,<br />The Spark Community Team</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Spark Community. All rights reserved.</p>
          <p><a href="https://sparkcommunity.vercel.app">Visit Our Website</a></p>
        </div>
      </div>
    </body>
  </html>
);

export default CertificateNotification;
