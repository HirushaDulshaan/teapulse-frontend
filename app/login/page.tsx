// app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Lock, ArrowRight, Leaf } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const fastApiUrl = process.env.NEXT_PUBLIC_FASTAPI_URL || 'http://localhost:8000';
      const response = await fetch(`${fastApiUrl}/api/v1/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok && result.status === 'success') {
        localStorage.setItem('userSession', JSON.stringify(result.user));
        localStorage.setItem('userLand', JSON.stringify(result.land));
        router.push('/my-land');
      } else {
        const detailMsg = typeof result.detail === 'string'
          ? result.detail
          : Array.isArray(result.detail)
            ? result.detail[0]?.msg || 'Validation Error'
            : 'Login failed. Please check credentials.';

        setError(detailMsg);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Server error. Make sure Python Backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFAF6] flex">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap');
        .font-display {
          font-family: 'Fraunces', Georgia, serif;
          font-optical-sizing: auto;
        }
      `}</style>

      {/* Left: photo panel — hidden on small screens, blurred tea-leaf backdrop */}
      <div className="hidden lg:block relative w-1/2">
        <Image
          src="/images/tea-leaves-bg.jpg"
          alt="Fresh Ceylon tea leaves"
          fill
          priority
          className="object-cover scale-105 blur-[1.5px]"
        />
        {/* light green-black wash — just enough for text legibility, leaves stay visible */}
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

          <div className="max-w-sm">
            <h2 className="font-display text-3xl font-semibold text-white leading-snug">
              Every leaf, measured to perfection.
            </h2>
            <p className="text-[#E8E4D6]/80 text-sm mt-3 leading-relaxed">
              Sign in to see your estate's blocks, soil data, and precision fertilizer
              recommendations, all in one place.
            </p>
          </div>
        </div>
      </div>

      {/* Right: form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10">
        <div className="max-w-md w-full space-y-6">
          {/* Mobile-only logo, since the photo panel is hidden below lg */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-2">
            <div className="bg-[#2F6B4A]/10 p-2 rounded-xl border border-[#2F6B4A]/20">
              <Leaf className="w-5 h-5 text-[#2F6B4A]" />
            </div>
            <span className="font-display font-semibold text-xl text-[#163C2C]">
              TeaPulse <span className="text-[#B68D40]">AI</span>
            </span>
          </div>

          <div className="text-center space-y-2">
            <h1 className="font-display text-3xl font-semibold text-[#163C2C]">Welcome back</h1>
            <p className="text-sm text-[#8A836E]">Enter your credentials to access TeaPulse</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-xs text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#54503F] mb-1.5">Email Address</label>
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
              <label className="block text-xs font-semibold text-[#54503F] mb-1.5">Password</label>
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
              disabled={loading}
              className="w-full bg-[#163C2C] hover:bg-[#1F4D36] disabled:opacity-60 text-[#F4EEDD] font-semibold py-3.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-lg shadow-[#163C2C]/15"
            >
              {loading ? 'Logging in...' : 'Access My Land'} <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-xs text-[#54503F] text-center">
              Don't have an account?{' '}
              <Link href="/dashboard" className="text-[#2F6B4A] font-semibold hover:underline">
                Create one here
              </Link>
              .
            </p>

            <p className="text-[10px] text-[#8A836E] text-center pt-2">
              By logging in, you agree to our{' '}
              <span className="text-[#B68D40] font-medium">Terms of Service</span> and{' '}
              <span className="text-[#B68D40] font-medium">Privacy Policy</span>.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}