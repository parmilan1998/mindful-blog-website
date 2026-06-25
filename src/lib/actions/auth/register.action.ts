"use server";

import { auth } from "@/lib/auth";

export const signUp = async (name: string, email: string, password: string) => {
  const result = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
      callbackURL: "/dashboard",
    },
  });

  return result;
};
