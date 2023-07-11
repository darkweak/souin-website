/** @types {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: "standalone",
  serverRuntimeConfig: {
    API_URL: process.env.API_URL,
    CONTACT_EMAIL: process.env.CONTACT_EMAIL,
    ADDRESS: process.env.ADDRESS,
  },
  publicRuntimeConfig: {
    API_URL: process.env.API_URL,
    CONTACT_EMAIL: process.env.CONTACT_EMAIL,
    ADDRESS: process.env.ADDRESS,
  },
};

module.exports = nextConfig;
