// sanity/env.ts

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03'

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET'
)

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
)

// BEST PRACTICE: useCdn ko production mein 'true' rakhein aur development mein 'false'
export const useCdn = process.env.NODE_ENV === 'production'

// 'token' yahan se hata diya gaya hai kyunki ab humara main client read-only hai

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }

  return v
}