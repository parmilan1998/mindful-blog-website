import jwt from "jsonwebtoken";

const EMAIL_VERIFY_SECRET = process.env.EMAIL_VERIFY_SECRET;
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

export const generateEmailToken = (userId: string) => {
  return jwt.sign({ sub: userId }, EMAIL_VERIFY_SECRET!, { expiresIn: "15m" });
};

export const verifyEmailToken = (token: string) => {
  return jwt.verify(token, EMAIL_VERIFY_SECRET!) as { sub: string };
};

export const createAccessToken = (
  userId: string,
  role: "user" | "admin",
  tokenVersion: number
) => {
  const payload = { sub: userId, role, tokenVersion };
  return jwt.sign(payload, JWT_ACCESS_SECRET! as string, {
    expiresIn: "30m",
  });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, JWT_ACCESS_SECRET!) as {
    sub: string;
    role: "user" | "admin";
    tokenVersion: number;
  };
};

export const createRefreshToken = (userId: string, tokenVersion: number) => {
  const payload = { sub: userId, tokenVersion };
  return jwt.sign(payload, JWT_REFRESH_SECRET! as string, {
    expiresIn: "7d",
  });
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, JWT_REFRESH_SECRET!) as {
    sub: string;
    tokenVersion: number;
  };
};
