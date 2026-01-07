import dotenv from "dotenv";

const env = process.env.NODE_ENV;

dotenv.config({
  path: env === "production" ? ".env.production" : ".env.development",
});

export default env;
