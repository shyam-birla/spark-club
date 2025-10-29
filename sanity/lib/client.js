// File: sanity/lib/client.js

import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import { apiVersion, dataset, projectId, useCdn } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, 
})

export const serverWriteClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

export const clientWriteClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.NEXT_PUBLIC_SANITY_API_WRITE_TOKEN,
});

// === YEH CODE ADD KIYA GAYA HAI ===
const builder = imageUrlBuilder(client)

export function urlFor(source) {
  return builder.image(source)
}
