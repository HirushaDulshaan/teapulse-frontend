// components/Navbar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, Leaf, Menu, ScanLine, Sprout, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "/introduction", label: "How It Works", icon: Sprout },
    { href: "/ai-support", label: "AI Doctor", icon: ScanLine },
    { href: "/articles", label: "Articles", icon: BookOpen },
  ];

  return (
      <nav className="fixed top-4 left-4 right-4 z-50">
        <div className="max-w-7xl mx-auto bg-[#0A0F0D]/90 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-3.5 flex items-center justify-between shadow-lg shadow-black/30">
          {/* Logo - Fixed with Link to Home */}
          <Link
              href="/"
              className="flex items-center gap-2.5 group cursor-pointer"
              onClick={() => setIsOpen(false)}
          >
            <div className="bg-[#00E68A]/10 p-1.5 rounded-lg border border-[#00E68A]/40 group-hover:border-[#00E68A] transition">
              <Leaf className="w-4 h-4 text-[#00E68A]" />
            </div>
            <span className="font-display font-semibold text-lg tracking-tight text-white">
            TeaPulse <span className="text-[#00E68A]">AI</span>
          </span>
          </Link>

          {/* Centered nav links - desktop only */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#D6D3C4] absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    className="hover:text-white transition flex items-center gap-2"
                >
                  {link.icon && <link.icon className="w-4 h-4" />}
                  {link.label}
                </Link>
            ))}
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
                className="hidden sm:inline-flex bg-[#00E68A] hover:bg-[#00E68A]/90 text-[#0A0F0D] font-semibold px-5 py-2 rounded-full text-sm transition shadow-lg shadow-[#00E68A]/20"
            >
              Contact Us
            </Link>

            {/* Hamburger - mobile only */}
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                aria-label={isOpen ? "Close menu" : "Open menu"}
                aria-expanded={isOpen}
                className="md:hidden inline-flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-2 text-white transition"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {isOpen && (
            <div className="md:hidden max-w-7xl mx-auto mt-2 bg-[#0A0F0D]/95 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-5 shadow-lg shadow-black/30 flex flex-col gap-1">
              {navLinks.map((link) => (
                  <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2.5 text-[#D6D3C4] hover:text-white text-sm font-medium py-3 border-b border-white/5 last:border-b-0 transition"
                  >
                    {link.icon && <link.icon className="w-4 h-4" />}
                    {link.label}
                  </Link>
              ))}

              <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-[#00E68A] text-sm font-medium py-3 border-b border-white/5 transition"
              >
                Log in
              </Link>

              <Link
                  href="/contact"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center justify-center bg-[#00E68A] hover:bg-[#00E68A]/90 text-[#0A0F0D] font-semibold px-5 py-2.5 rounded-full text-sm transition mt-3"
              >
                Contact Us
              </Link>
            </div>
        )}
      </nav>
  );
}