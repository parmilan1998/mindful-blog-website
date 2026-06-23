"use client";

import { signIn } from "next-auth/react";

export default function SignIn() {
  return (
    <button
      onClick={() => signIn("google")}
      className="bg-blue-500 text-white p-2 rounded-md cursor-pointer"
    >
      SignIn
    </button>
  );
}
