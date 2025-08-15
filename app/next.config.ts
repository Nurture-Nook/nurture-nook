import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true,

    async rewrites() {
        return [
            {
                source: `${process.env.NEXT_PUBLIC_API_BASE}/:path*`,
                destination: 'http://localhost:8000/:path*',
            }
        ]
    }
};

export default nextConfig;
