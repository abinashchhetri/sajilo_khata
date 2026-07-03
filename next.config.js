/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // YouTube thumbnail CDN domains
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "img.youtube.com" },
      // Google user content (profile photos via OAuth)
      { protocol: "https", hostname: "*.googleusercontent.com" },
      // Playlist cover art CDN
      { protocol: "https", hostname: "kgarira.com" },
    ],
  },
};

module.exports = nextConfig;
