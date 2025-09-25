import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId, useCdn } from '../env'

// Yeh ab aapka public client hai jo sirf data "padh" sakta hai.
// Isse Vercel build fail nahi hoga.
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Public data ke liye 'true' performance behtar karta hai
  // Token yahan se hata diya gaya hai
})