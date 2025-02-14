/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '128.0.204.82',
        port: '8001',
        pathname: '/media/Imagenes/**',
      },
    ],
  },
};

module.exports = nextConfig;
