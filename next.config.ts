/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_URL: process.env.API_URL,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '128.0.204.82',
        port: '8001',
        pathname: '/media/Imagenes/**',
      },
      {
        protocol: 'http',
        hostname: '128.0.204.34',
        port: '8001',
        pathname: '/media/Imagenes/**',
      }
    ],
  },
};

module.exports = nextConfig;