/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://gods-eye-x.onrender.com/api/:path*',
      },
    ]
  },
};

export default nextConfig;
