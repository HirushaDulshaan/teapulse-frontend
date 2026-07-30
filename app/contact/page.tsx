// components/ContactSection.tsx
'use client';

import { useState } from 'react';
import { Briefcase, Wrench, MessageCircle, ArrowRight, Mail } from 'lucide-react';
import Navbar from '@/components/Navbar';

type TabKey = 'sales' | 'support' | 'general';

const TABS: {
  key: TabKey;
  label: string;
  Icon: typeof Briefcase;
  cardTitle: string;
  cardDesc: string;
  cta: string;
}[] = [
  {
    key: 'sales',
    label: 'Sales',
    Icon: Briefcase,
    cardTitle: 'Sales & Product Inquiries',
    cardDesc:
      "Interested in bringing TeaPulse AI to your estate? Learn about pricing, onboarding, and how variable-rate mapping fits your divisions.",
    cta: 'Contact Sales',
  },
  {
    key: 'support',
    label: 'Support',
    Icon: Wrench,
    cardTitle: 'Need Support?',
    cardDesc:
      'Already mapping your estate with us? Our support team can help with account access, data sync, or app issues.',
    cta: 'Get Support',
  },
  {
    key: 'general',
    label: 'General',
    Icon: MessageCircle,
    cardTitle: 'General Inquiries',
    cardDesc:
      'For media, partnerships, research collaborations, or any other question about TeaPulse AI.',
    cta: 'Reach Out',
  },
];

const ROLE_OPTIONS = [
  '🌱 Smallholder Grower',
  '🏔️ Estate Superintendent',
  '🏭 Fertilizer Supplier',
  '📦 Tea Exporter / Factory',
  '👥 General User / Other',
];

const INTEREST_OPTIONS: Record<TabKey, string[]> = {
  sales: [
    'GPS Estate Mapping',
    'Variable Rate Fertilizer Calculations',
    'Satellite Monitoring',
    'Cost vs Yield Analytics',
    'Platform Onboarding',
    'Other',
  ],
  support: [
    'Login / Account Access',
    'Map / Data Sync Issue',
    'Payment Problem',
    'App Bug / Technical Error',
    'Other',
  ],
  general: [
    'Media / Press',
    'Partnership Opportunity',
    'Careers & Internships',
    'Research & Academic',
    'Other',
  ],
};

export default function ContactSection() {
  const [activeTab, setActiveTab] = useState<TabKey>('sales');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const active = TABS.find((t) => t.key === activeTab)!;

  return (
    <section id="contact" className="relative z-10 bg-[#0A0F0D] py-20 sm:py-28 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6">
              <Navbar />
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[#00E68A] text-xs tracking-[0.25em] uppercase font-semibold">
            Get in touch
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-white mt-4">
            Contact Us
          </h2>
          <p className="text-[#B9B6A8] text-sm mt-3">
            Please choose the option that best fits your needs so we can connect you with the right team.
          </p>
        </div>

        {/* Tab selector */}
        <div className="flex justify-center gap-3 mb-10 flex-wrap">
          {TABS.map((tab) => {
            const isActive = tab.key === activeTab;
            return (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setSubmitted(false);
                }}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition border ${
                  isActive
                    ? 'bg-[#00E68A] text-[#0A0F0D] border-[#00E68A]'
                    : 'bg-white/[0.03] text-[#D6D3C4] border-white/10 hover:border-white/20'
                }`}
              >
                <tab.Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: option cards */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setSubmitted(false);
                }}
                className={`text-left rounded-2xl p-6 border transition ${
                  tab.key === activeTab
                    ? 'bg-[#00E68A]/[0.06] border-[#00E68A]/40'
                    : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${
                    tab.key === activeTab ? 'bg-[#00E68A]/15 text-[#00E68A]' : 'bg-white/5 text-[#B9B6A8]'
                  }`}
                >
                  <tab.Icon className="w-5 h-5" />
                </div>
                <h3 className="font-display text-lg font-semibold text-white mb-1.5">
                  {tab.cardTitle}
                </h3>
                <p className="text-sm text-[#8A8677] leading-relaxed">{tab.cardDesc}</p>
              </button>
            ))}

            <div className="rounded-2xl p-6 border border-white/10 bg-white/[0.02] flex items-center gap-3 mt-2">
              <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-[#00E68A]">
                <Mail className="w-4 h-4" />
              </div>
              <div className="text-sm">
                <p className="text-[#8A8677]">Direct Email</p>
                <p className="text-white font-medium">hello@teapulse.ai</p>
              </div>
            </div>
          </div>

          {/* Right: form */}
          <div className="lg:col-span-8 bg-white/[0.02] border border-white/10 rounded-2xl p-6 sm:p-8">
            {submitted ? (
              <div className="flex flex-col items-center justify-center text-center py-16">
                <div className="w-14 h-14 rounded-full bg-[#00E68A]/15 text-[#00E68A] flex items-center justify-center mb-5">
                  <ArrowRight className="w-6 h-6 rotate-[-45deg]" />
                </div>
                <h3 className="font-display text-2xl font-semibold text-white mb-2">
                  Inquiry Submitted!
                </h3>
                <p className="text-[#B9B6A8] text-sm max-w-sm">
                  Thank you for reaching out. Our team will get back to you as soon as possible.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 bg-[#00E68A] hover:bg-[#00E68A]/90 text-[#0A0F0D] font-semibold px-6 py-2.5 rounded-full text-sm transition"
                >
                  Awesome
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <h3 className="font-display text-xl font-semibold text-white">{active.cardTitle}</h3>

                {/* I am a... */}
                <div>
                  <label className="block text-xs font-medium text-[#B9B6A8] mb-2">
                    I am a... <span className="text-[#00E68A]">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {ROLE_OPTIONS.map((role) => (
                      <label
                        key={role}
                        className="cursor-pointer px-4 py-2 rounded-full text-xs font-medium border border-white/10 bg-white/[0.03] text-[#D6D3C4] hover:border-[#00E68A]/40 has-[:checked]:bg-[#00E68A] has-[:checked]:text-[#0A0F0D] has-[:checked]:border-[#00E68A] transition"
                      >
                        <input type="radio" name="role" value={role} className="hidden" required />
                        {role}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Name + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#B9B6A8] mb-2">Full Name *</label>
                    <input
                      required
                      type="text"
                      placeholder="Your name"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-[#5C5A4F] focus:outline-none focus:border-[#00E68A]/50 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#B9B6A8] mb-2">Email *</label>
                    <input
                      required
                      type="email"
                      placeholder="you@example.com"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-[#5C5A4F] focus:outline-none focus:border-[#00E68A]/50 transition"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-medium text-[#B9B6A8] mb-2">Phone Number</label>
                  <div className="flex gap-2">
                    <span className="inline-flex items-center gap-1.5 bg-white/[0.03] border border-white/10 rounded-xl px-3 text-sm text-[#D6D3C4]">
                      🇱🇰 +94
                    </span>
                    <input
                      type="tel"
                      placeholder="7X XXX XXXX"
                      className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-[#5C5A4F] focus:outline-none focus:border-[#00E68A]/50 transition"
                    />
                  </div>
                </div>

                {/* Area of interest */}
                <div>
                  <label className="block text-xs font-medium text-[#B9B6A8] mb-2">
                    Area of Interest *
                  </label>
                  <select
                    required
                    defaultValue=""
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00E68A]/50 transition"
                  >
                    <option value="" disabled className="bg-[#0A0F0D]">
                      Select an option
                    </option>
                    {INTEREST_OPTIONS[activeTab].map((opt) => (
                      <option key={opt} value={opt} className="bg-[#0A0F0D]">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-medium text-[#B9B6A8] mb-2">Message</label>
                  <textarea
                    rows={4}
                    placeholder="Tell us a bit more..."
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-[#5C5A4F] focus:outline-none focus:border-[#00E68A]/50 transition resize-none"
                  />
                </div>

                <label className="flex items-center gap-2 text-xs text-[#8A8677]">
                  <input type="checkbox" className="accent-[#00E68A] w-4 h-4" />
                  Keep me updated with TeaPulse AI news & platform updates
                </label>

                <button
                  type="submit"
                  className="self-start inline-flex items-center gap-2 bg-[#00E68A] hover:bg-[#00E68A]/90 text-[#0A0F0D] font-semibold px-6 py-3 rounded-full text-sm transition mt-2"
                >
                  Submit <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}