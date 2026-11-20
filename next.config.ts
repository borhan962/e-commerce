import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ecommerce.routemisr.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // async redirects() {
  //   return [
  //     {
  //       source: '/login',
  //       destination: '/Login',
  //       permanent: false,
  //     },
  //     {
  //       source: '/register',
  //       destination: '/Register',
  //       permanent: false,
  //     },
  //     {
  //       source: '/Cart',
  //       destination: '/cart',
  //       permanent: false,
  //     },
  //     {
  //       source: '/products',
  //       destination: '/Products',
  //       permanent: false,
  //     },
  //   ];
  // },
};

export default nextConfig;
