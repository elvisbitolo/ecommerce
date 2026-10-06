/** @type {import('next').NextConfig} */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utl.co.ke",
        pathname: "/wp-content/uploads/**",
      },
      ...(supabaseUrl ? [{
        protocol: "https",
        hostname: new URL(supabaseUrl).hostname,
        pathname: "/storage/v1/object/public/product-images/**",
      }] : []),
    ],
  },
  reactCompiler: true,
};

export default nextConfig;
