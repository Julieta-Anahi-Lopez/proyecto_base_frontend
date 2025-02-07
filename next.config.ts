import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "172.19.0.3",
        port: "8000",
        pathname: "/media/Imagenes/**",
      },
    ],
  },
};

export default nextConfig;
