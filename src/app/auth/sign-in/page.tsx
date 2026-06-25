"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, Zap, LogIn, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { SITE } from "@/constants";
import { useAuth } from "@/providers/auth-provider";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaFacebook } from "react-icons/fa";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const from = searchParams.get("redirect") || "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<FormData>({
    // @ts-ignore
    resolver: zodResolver(schema),
    defaultValues: {
      email: "alex@devpulse.io",
      password: "password",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: FormData) => {
    const result = await login(data.email, data.password);
    if (result.success) {
      toast.success("Welcome back!");
      router.replace(from);
    } else {
      toast.error(result.message ?? "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-sm"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Image src="/icon.svg" alt="Logo" width={24} height={24} />
            </div>
            <span className="font-bold text-lg">{SITE.name}</span>
          </Link>

          <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
          <p className="text-muted-foreground text-sm mb-7">
            Sign in to your account to continue
          </p>

          {/* Demo hint */}
          {/* <div className="bg-primary/8 border border-primary/20 rounded-xl p-3 mb-6 text-xs text-primary">
            <strong>Demo:</strong> Use <code>alex@devpulse.io</code> for admin
            access or any mock email to sign in.
          </div> */}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  aria-invalid={!!errors.password}
                  className={errors.password ? "border-danger pr-10" : "pr-10"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
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

            <div className="flex items-center gap-2">
              <Checkbox
                id="rememberMe"
                checked={watch("rememberMe")}
                onCheckedChange={(v) => setValue("rememberMe", !!v)}
              />
              <Label
                htmlFor="rememberMe"
                className="text-sm font-normal cursor-pointer"
              >
                Remember me for 30 days
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full gap-2 cursor-pointer"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              {isSubmitting ? "Signing in…" : "Sign In"}
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

          <div className="relative my-6">
            <Separator />
            <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
              or
            </span>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              href="/auth/sign-up"
              className="text-primary font-semibold hover:underline"
            >
              Sign up free
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right: Visual */}
      <div className="hidden lg:flex flex-1 bg-linear-to-br from-primary to-violet p-12 items-center justify-center">
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-center text-white max-w-sm"
        >
          <div className="text-5xl mb-6">📚</div>
          <h2 className="text-3xl font-bold mb-3">Join 4,200+ developers</h2>
          <p className="text-white/80 leading-relaxed">
            Access 127+ in-depth articles, save your favorites, track your
            reading, and join the conversation.
          </p>
          <div className="grid grid-cols-2 gap-3 mt-8 text-sm">
            {[
              "React & TypeScript",
              "AI & Machine Learning",
              "DevOps & Cloud",
              "Career Growth",
            ].map((t) => (
              <div key={t} className="bg-white/15 rounded-xl px-3 py-2.5">
                {t}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
