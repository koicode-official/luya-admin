/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/admin', // 원하는 기본 경로를 여기에 설정합니다.
  assetPrefix: process.env.NEXT_PUBLIC_NODE_ENV === "production" ? "/admin/" : undefined,
}


module.exports = nextConfig
