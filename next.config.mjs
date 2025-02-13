/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"], // ✅ Enables importing SVG as a React component
    });
    return config;
  },
};

export default nextConfig;
