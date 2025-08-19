const nextConfig = {
    reactStrictMode: true,

    async rewrites() {
        console.log("Loading rewrites configuration");
        return [
            {
                source: '/api/message/:path*',
                destination: 'http://localhost:8000/message/:path*',
            },
            {
                source: '/api/chat/:path*',
                destination: 'http://localhost:8000/chat/:path*',
            },
            {
                source: '/api/me/:path*',
                destination: 'http://localhost:8000/me/:path*',
            },
            {
                source: '/api/posts/:path*',
                destination: 'http://localhost:8000/post/:path*',
            },
            {
                source: '/api/category/:path*',
                destination: 'http://localhost:8000/category/:path*',
            },    
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
