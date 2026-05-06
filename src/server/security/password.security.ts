import bcrypt from "bcryptjs";

const SALT = 12;

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};
