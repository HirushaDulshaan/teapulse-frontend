// components/Navbar.tsx
"use client";

import Link from "next/link";
import { BookOpen, Leaf } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed top-4 left-4 right-4 z-50">
      <div className="max-w-7xl mx-auto bg-[#0A0F0D]/90 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-3.5 flex items-center justify-between shadow-lg shadow-black/30">
        {/* Logo - Fixed with Link to Home */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          <div className="bg-[#00E68A]/10 p-1.5 rounded-lg border border-[#00E68A]/40 group-hover:border-[#00E68A] transition">
            <Leaf className="w-4 h-4 text-[#00E68A]" />
          </div>
          <span className="font-display font-semibold text-lg tracking-tight text-white">
            TeaPulse <span className="text-[#00E68A]">AI</span>
          </span>
        </Link>

        {/* Centered nav links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#D6D3C4] absolute left-1/2 -translate-x-1/2">
          <Link
            href="/dashboard/mapping"
            className="hover:text-white transition"
          >
            Mapping
          </Link>
          <Link
            href="/dashboard/variable-rate"
            className="hover:text-white transition"
          >
            Variable Rate
          </Link>
          <Link
            href="/dashboard/satellite"
            className="hover:text-white transition"
          >
            Satellite
          </Link>
          <Link
            href="/articles"
            className="hover:text-white transition flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" /> Articles
          </Link>
         
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="hidden sm:inline-flex text-sm font-medium text-white hover:text-[#00E68A] transition"
          >
            Log in
          </Link>

          <Link
            href="/contact"
            className="inline-flex bg-[#00E68A] hover:bg-[#00E68A]/90 text-[#0A0F0D] font-semibold px-5 py-2 rounded-full text-sm transition shadow-lg shadow-[#00E68A]/20"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </nav>
  );
}
