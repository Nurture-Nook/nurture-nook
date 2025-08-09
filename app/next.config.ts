import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true,

    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'https://e323iw8wd0.execute-api.us-east-1.amazonaws.com/beta'
            }
        ]
    }
};

export default nextConfig;
