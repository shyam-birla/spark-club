/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Yeh aapka pehle se tha
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      // YAHAN SANITY KO ADD KIYA GAYA HAI
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
};

export default nextConfig; // .mjs files 'module.exports' ki jagah 'export default' use karti hain