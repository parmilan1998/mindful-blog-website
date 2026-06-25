"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const signOut = async () => {
  const result = await auth.api.signOut({
    headers: await headers(),
  });

  return result;
};
