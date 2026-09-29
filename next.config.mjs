/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    qualities: [75, 92],
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
