/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Yeh pehle se the
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      // --- YAHAN NAYE HOSTNAMES ADD KIYE GAYE HAIN ---
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Google profile pictures ke liye
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com', // GitHub profile pictures ke liye
      },
      // --- END OF CHANGES ---
    ],
  },
};

export default nextConfig;