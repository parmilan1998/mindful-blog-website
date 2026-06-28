"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, Zap, UserPlus, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { SITE } from "@/constants";
import Link from "next/link";
import { authService } from "@/services/auth-service";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaFacebook } from "react-icons/fa";
import { signUp } from "@/lib/actions/auth/register.action";

const schema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Passwords do not match",
      });
    }
  });

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();

  const [showPw, setShowPw] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<String>("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    // @ts-ignore
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const onSubmit = async (data: FormData) => {
    setError("");

    try {
      const result = await signUp(data.name, data.email, data.password);

      console.log(result);

      if (result?.error) {
        setError(result.error);
        toast.error(result.error);
        return;
      }

      toast.success("Account created successfully!");

      // Redirect if email verification is disabled
      router.push("/auth/sign-in");

      // OR if email verification is enabled
      // router.push("/auth/verify-email");
    } catch (error) {
      console.error(error);

      setError("Something went wrong. Please try again.");
      toast.error("Something went wrong.");
    }
  };

  const PERKS = [
    "Save unlimited bookmarks",
    "Track your reading history",
    "Write and publish articles",
    "Join the community",
  ];

  return (
    <div className="min-h-screen flex">
      {/* Visual */}
      <div className="hidden lg:flex flex-1 bg-linear-to-br from-violet to-primary p-12 items-center justify-center">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-center text-white max-w-sm"
        >
          <div className="text-5xl mb-6">✨</div>
          <h2 className="text-3xl font-bold mb-3">Create your account</h2>
          <p className="text-white/80 leading-relaxed mb-8">
            Join the community of developers who read, write, and grow together.
          </p>
          <div className="space-y-3">
            {PERKS.map((p) => (
              <div
                key={p}
                className="flex items-center gap-3 text-sm text-left"
              >
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3" />
                </div>
                {p}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-sm"
        >
          <Link href="/" className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Image src="/icon.svg" alt="Logo" width={24} height={24} />
            </div>
            <span className="font-bold text-lg">{SITE.name}</span>
          </Link>

          <h1 className="text-2xl font-bold mb-1">Create your account</h1>
          <p className="text-muted-foreground text-sm mb-7">
            Free forever. No credit card required.
          </p>
          {error && <p className="text-sm text-danger">{error}</p>}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Your Name"
                {...register("name")}
                aria-invalid={!!errors.name}
                className={errors.name ? "border-danger" : ""}
              />
              {errors.name && (
                <p className="text-xs text-danger">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                aria-invalid={!!errors.email}
                className={errors.email ? "border-danger" : ""}
              />
              {errors.email && (
                <p className="text-xs text-danger">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPw ? "text" : "password"}
                  placeholder="At least 8 characters"
                  {...register("password")}
                  aria-invalid={!!errors.password}
                  className={errors.password ? "border-danger pr-10" : "pr-10"}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground"
                >
                  {showPw ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-danger">{errors.password.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Repeat your password"
                {...register("confirmPassword")}
                aria-invalid={!!errors.confirmPassword}
                className={errors.confirmPassword ? "border-danger" : ""}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-danger">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full gap-2 cursor-pointer h-10"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <UserPlus className="w-4 h-4" />
              )}
              {isSubmitting ? "Creating account…" : "Create Account"}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>

            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-3 text-muted-foreground">
                Or continue with social media
              </span>
            </div>
          </div>

          <div className="space-y-3 my-6">
            {/* GitHub + Facebook + Google*/}
            <div className="grid grid-cols-3 gap-3">
              <Button
                type="button"
                variant="outline"
                className="w-full h-11 cursor-pointer justify-center gap-3"
                // onClick={() => handleSocialLogin("google")}
              >
                <FcGoogle className="size-5" />
                <span className="hidden sm:inline">Google</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-11 cursor-pointer justify-center gap-2"
              >
                <FaGithub className="size-5" />
                <span className="hidden sm:inline">GitHub</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                className="h-11 cursor-pointer justify-center gap-2"
              >
                <FaFacebook className="size-5 text-[#1877F2]" />
                <span className="hidden sm:inline">Facebook</span>
              </Button>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link
              href="/auth/sign-in"
              className="text-primary font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>
          <p className="text-center text-xs text-muted-foreground mt-4">
            By signing up you agree to our{" "}
            <Link href="/terms" className="underline">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline">
              Privacy Policy
            </Link>
            .
          </p>
        </motion.div>
      </div>
    </div>
  );
}
