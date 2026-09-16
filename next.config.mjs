/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: "/explore-university",
        destination: "/explore",
      },
      {
        source: "/explore-university/:path*",
        destination: "/explore/:path*",
      },
    ];
  },
};

export default nextConfig;
