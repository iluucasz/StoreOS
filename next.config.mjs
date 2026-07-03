/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["localhost:3001", "127.0.0.1:3001"],
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3001", "127.0.0.1:3001"],
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
