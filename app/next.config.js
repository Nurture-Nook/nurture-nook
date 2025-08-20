const nextConfig = {
    reactStrictMode: true,

    async rewrites() {
        console.log("Loading rewrites configuration");
        return [
            {
                source: '/api/:path*',
                destination: 'http://localhost:8000/:path*',
            }
        ];
    }
};

module.exports = nextConfig;
