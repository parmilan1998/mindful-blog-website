import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    MONGODB_DB_NAME: process.env.MONGODB_DB_NAME,
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_GITHUB_CLIENT_ID: process.env.AUTH_GITHUB_CLIENT_ID,
    AUTH_GITHUB_CLIENT_SECRET: process.env.AUTH_GITHUB_CLIENT_SECRET,
    AUTH_FACEBOOK_CLIENT_ID: process.env.AUTH_FACEBOOK_CLIENT_ID,
    AUTH_FACEBOOK_CLIENT_SECRET: process.env.AUTH_FACEBOOK_CLIENT_SECRET,
    AUTH_GOOGLE_CLIENT_ID: process.env.AUTH_GOOGLE_CLIENT_ID,
    AUTH_GOOGLE_CLIENT_SECRET: process.env.AUTH_GOOGLE_CLIENT_SECRET,
    AUTH_URL: process.env.AUTH_URL,
  },

  images: {
    domains: [
      "images.unsplash.com",
      "avatar.githubusercontent.com",
      "lh3.googleusercontent.com",
    ],
  },
};

export default nextConfig;
