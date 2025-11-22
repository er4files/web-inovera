/** @type {import('next').NextConfig} */
const nextConfig = {
  // HAPUS ini untuk Vercel deployment:
  // output: 'export',
  // trailingSlash: true,
  // skipTrailingSlashRedirect: true,
  // distDir: 'dist',
  // basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  // assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH ? `${process.env.NEXT_PUBLIC_BASE_PATH}/` : '',
  
  images: {
    domains: [
      "localhost",
      "qzusqrmauxxkiihvzmju.supabase.co" // Tambahkan Supabase domain
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
      },
      {
        protocol: "https",
        hostname: "qzusqrmauxxkiihvzmju.supabase.co",
        port: "",
      },
    ],
  },
};

module.exports = nextConfig;