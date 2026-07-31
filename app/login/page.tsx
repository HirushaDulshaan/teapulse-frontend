// app/login/page.tsx
"use client";

import { Suspense } from "react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import { Mail, Lock, ArrowRight, Leaf } from "lucide-react";
import { saveAuthToken } from "@/lib/auth";

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  status: string;
  access_token?: string;
  user?: any;
  land?: any;
  detail?: string | { msg: string }[];
}

async function loginRequest(payload: LoginPayload): Promise<LoginResponse> {
  const fastApiUrl = process.env.NEXT_PUBLIC_FASTAPI_URL || "http://localhost:8000";
  const response = await fetch(`${fastApiUrl}/api/v1/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const result: LoginResponse = await response.json();

  // STRICT CHECK: only treat this as success if response.ok AND status
  // is "success" AND we actually got a token back.
  if (!response.ok || result.status !== "success" || !result.access_token) {
    const detailMsg =
        typeof result.detail === "string"
            ? result.detail
            : Array.isArray(result.detail)
                ? result.detail[0]?.msg || "Validation Error"
                : "Invalid email or password. Please try again.";

    // Throwing here is what makes useMutation treat this as an error case,
    // even though the HTTP status itself might technically be 200.
    throw new Error(detailMsg);
  }

  return result;
}

export default function LoginPage() {
  return (
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");

  const loginMutation = useMutation({
    mutationFn: loginRequest,
    onSuccess: (result) => {
      saveAuthToken(result.access_token!);

      // Also set a plain cookie so middleware can read it immediately
      document.cookie = `teapulse_token=${result.access_token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;

      if (result.user) {
        localStorage.setItem("userSession", JSON.stringify(result.user));
      }
      if (result.land) {
        localStorage.setItem("userLand", JSON.stringify(result.land));
      }

      const redirectTo = searchParams.get("redirect") || "/my-land";
      router.push(redirectTo);
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    // Safety check: don't proceed if fields are empty
    if (!email || !password) {
      setFormError("Please enter both email and password.");
      return;
    }

    loginMutation.mutate({ email, password });
  };

  // Prefer the mutation's own error (server/validation errors), fall back to
  // the empty-fields check above.
  const errorMessage =
      formError ||
      (loginMutation.isError
          ? loginMutation.error instanceof Error
              ? loginMutation.error.message
              : "Server error. Make sure Python Backend is running."
          : "");

  return (
      <div className="min-h-screen bg-[#FBFAF6] flex">
        <style jsx global>{`
          @import url("https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap");
          .font-display {
            font-family: "Fraunces", Georgia, serif;
            font-optical-sizing: auto;
          }
        `}</style>

        {/* Left: photo panel — background image restored with ~50% blur */}
        <div className="hidden lg:block relative w-1/2 overflow-hidden">
          <Image
              src="/images/tea-leaves-bg.jpg"
              alt="Fresh Ceylon tea leaves"
              fill
              priority
              sizes="50vw"
              className="object-cover object-center scale-105 blur-[6px]"
          />
          <div className="absolute inset-0 bg-[#0E2A1D]/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B2015]/85 via-transparent to-[#0B2015]/55" />

          <div className="relative z-10 h-full flex flex-col justify-between p-12">
            <div className="flex items-center gap-3">
              <div className="bg-white/10 backdrop-blur-sm p-2 rounded-xl border border-white/20">
                <Leaf className="w-5 h-5 text-[#F4EEDD]" />
              </div>
              <span className="font-display font-semibold text-xl text-white">
              TeaPulse <span className="text-[#B68D40]">AI</span>
            </span>
            </div>

            <div className="max-w-sm space-y-3">
              <h2 className="font-display text-3xl font-semibold text-white leading-snug">
                Every leaf, measured to perfection.
              </h2>
              <p className="text-[#E8E4D6]/80 text-sm leading-relaxed">
                Sign in to see your estate's blocks, soil data, and precision
                fertilizer recommendations, all in one place.
              </p>
            </div>
          </div>
        </div>

        {/* Right: form panel */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10">
          <div className="max-w-md w-full space-y-6">
            <div className="lg:hidden flex items-center justify-center gap-3 mb-2">
              <div className="bg-[#2F6B4A]/10 p-2 rounded-xl border border-[#2F6B4A]/20">
                <Leaf className="w-5 h-5 text-[#2F6B4A]" />
              </div>
              <span className="font-display font-semibold text-xl text-[#163C2C]">
              TeaPulse <span className="text-[#B68D40]">AI</span>
            </span>
            </div>

            <div className="text-center space-y-2">
              <h1 className="font-display text-3xl font-semibold text-[#163C2C]">
                Welcome back
              </h1>
              <p className="text-sm text-[#8A836E]">
                Enter your credentials to access TeaPulse
              </p>
            </div>

            {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-xs text-center">
                  {errorMessage}
                </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#54503F] mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8A836E] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                      type="email"
                      required
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white border border-[#E3DCC6] rounded-xl pl-10 pr-3 py-3 text-sm text-[#1A1A17] placeholder:text-[#B7AF98] focus:outline-none focus:border-[#2F6B4A] focus:ring-2 focus:ring-[#2F6B4A]/10 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#54503F] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8A836E] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white border border-[#E3DCC6] rounded-xl pl-10 pr-3 py-3 text-sm text-[#1A1A17] placeholder:text-[#B7AF98] focus:outline-none focus:border-[#2F6B4A] focus:ring-2 focus:ring-[#2F6B4A]/10 transition"
                  />
                </div>
              </div>

              <button
                  type="submit"
                  disabled={loginMutation.isPending}
                  className="w-full bg-[#163C2C] hover:bg-[#1F4D36] disabled:opacity-60 text-[#F4EEDD] font-semibold py-3.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-lg shadow-[#163C2C]/15 cursor-pointer"
              >
                {loginMutation.isPending ? "Logging in..." : "Access My Land"}{" "}
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-xs text-[#54503F] text-center">
                Don't have an account?{" "}
                <Link
                    href="/dashboard"
                    className="text-[#2F6B4A] font-semibold hover:underline"
                >
                  Create one here
                </Link>
                .
              </p>

              <p className="text-[10px] text-[#8A836E] text-center pt-2">
                By logging in, you agree to our{" "}
                <span className="text-[#B68D40] font-medium">
                Terms of Service
              </span>{" "}
                and{" "}
                <span className="text-[#B68D40] font-medium">Privacy Policy</span>
                .
              </p>
            </form>
          </div>
        </div>
      </div>
  );
}