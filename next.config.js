/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        // formats: ["image/avif", "image/webp"],
        remotePatterns: [
            {
                protocol: "https",
                hostname: "avatar-git-fork-bozaci-style-homepage-change.vercel.sh",
                port: "",
                pathname: "**",
            },
        ],
    },
};

module.exports = nextConfig;
