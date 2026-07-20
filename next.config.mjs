/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Теперь этот параметр лежит в корне конфигурации, а не внутри experimental
  allowedDevOrigins: ['192.168.1.107'],
}

export default nextConfig
