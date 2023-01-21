/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    target : "serverless",
    images: {
        domains: ['images.unsplash.com']
    },

}

module.exports = nextConfig
