const nextConfig = {
    reactStrictMode: true,

    async rewrites() {
        console.log("Loading rewrites configuration");
        return [
            {
                source: '/api/auth/:slug',
                destination: 'http://localhost:8000/auth/:slug',
            },
            {
                source: '/api/:path*',
                destination: 'http://localhost:8000/:path*',
            }
        ];
    }
};

module.exports = nextConfig;
