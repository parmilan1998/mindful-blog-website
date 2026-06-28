"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Zap } from "lucide-react";

// ─── Top Progress Bar ─────────────────────────────────────────────────────────
export function TopProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevPath = useRef<string>("");

  const currentPath = pathname + searchParams.toString();

  useEffect(() => {
    if (prevPath.current === currentPath) return;
    prevPath.current = currentPath;

    // Start
    setVisible(true);
    setProgress(10);

    timerRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 85) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 85;
        }
        return p + Math.random() * 12;
      });
    }, 50);

    // Finish after a tick
    const finish = setTimeout(() => {
      if (timerRef.current) clearInterval(timerRef.current);
      setProgress(100);
      setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 100);
    }, 200);

    return () => {
      clearTimeout(finish);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentPath]);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-9999 h-[3px] bg-transparent pointer-events-none">
      <div
        className="h-full bg-primary shadow-[0_0_8px_2px] shadow-primary/60 transition-all duration-300 ease-out rounded-r-full"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

// ─── Full-Screen Page Loader ──────────────────────────────────────────────────
export function PageLoader({ message = "Loading…" }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-9998 flex flex-col items-center justify-center bg-background">
      {/* Glowing logo mark */}
      <div className="relative mb-8">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Zap className="w-7 h-7 text-primary animate-pulse" />
        </div>
        {/* Ping ring */}
        <span className="absolute inset-0 rounded-2xl border border-primary/40 animate-ping" />
      </div>

      {/* Animated dots */}
      <div className="flex gap-1.5 mb-5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full bg-primary"
            style={{
              animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>

      <p className="text-sm text-muted-foreground font-medium tracking-wide">
        {message}
      </p>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40%            { transform: translateY(-8px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
