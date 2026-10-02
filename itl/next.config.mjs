/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utl.co.ke",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
  reactCompiler: true,
};

export default nextConfig;
