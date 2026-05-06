import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Logo from "@/assets/images/fusionui.png";
import Image from "next/image";

interface LoginProps {
  heading?: string;
  subheading?: string;
  googleText?: string;
  loginText?: string;
  signupText?: string;
  signupUrl?: string;
}

const LoginPage = ({
  heading = "Welcome back",
  subheading = "Login to continue building with Mindful.",
  googleText = "Continue with Google",
  loginText = "Sign In",
  signupText = "Don't have an account?",
  signupUrl = "/auth/register",
}: LoginProps) => {
  return (
    <section className="bg-muted h-screen">
      <div className="flex h-full items-center justify-center px-4">
        <div className="bg-background border-muted w-full max-w-sm rounded-xl border px-6 py-10">
          {/* Logo + Heading */}
          <div className="flex flex-col items-center gap-4">
            <Image
              src={Logo}
              alt="Mindful"
              className="h-10 w-auto dark:invert"
              height={60}
              width={60}
            />

            <div className="text-center">
              <h1 className="text-2xl font-semibold">{heading}</h1>
              <p className="text-muted-foreground text-sm mt-1">{subheading}</p>
            </div>
          </div>

          {/* Form */}
          <form className="mt-6 flex flex-col gap-4">
            <Input type="email" placeholder="Email" required />
            <Input type="password" placeholder="Password" required />

            <Button type="submit" className="w-full">
              {loginText}
            </Button>

            <Button type="button" variant="outline" className="w-full">
              {/* <Google className="mr-2 size-5" /> */}
              {googleText}
            </Button>
          </form>

          {/* Footer */}
          <div className="text-muted-foreground mt-6 flex justify-center gap-1 text-sm">
            <p>{signupText}</p>
            <a
              href={signupUrl}
              className="text-primary font-medium hover:underline"
            >
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
