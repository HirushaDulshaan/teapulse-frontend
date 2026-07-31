// components/Footer.tsx
import Link from 'next/link';
import { Leaf, Mail, MapPin, Globe, MessageCircle, Send } from 'lucide-react';

const productLinks = [
    { href: '/introduction', label: 'How It Works' },
    { href: '/dashboard/mapping', label: 'Estate Mapping' },
    { href: '/ai-support', label: 'AI Doctor' },
    { href: '/articles', label: 'Articles' },
];

const companyLinks = [
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact Us' },
    { href: '/login', label: 'Log In' },
];

const socialLinks = [
    { href: 'https://twitter.com/teapulseai', label: 'X (Twitter)', Icon: MessageCircle },
    { href: 'https://linkedin.com/company/teapulseai', label: 'LinkedIn', Icon: Send },
    { href: 'https://teapulse.ai', label: 'Website', Icon: Globe },
];

export default function Footer() {
    return (
        <footer className="relative z-10 bg-[#050B08] text-[#8A8677] border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-12 gap-12">
                {/* Brand */}
                <div className="md:col-span-5 space-y-4">
                    <Link href="/" className="inline-flex items-center gap-3">
                        <div className="bg-white/5 p-2 rounded-xl border border-white/10">
                            <Leaf className="w-5 h-5 text-[#00E68A]" />
                        </div>
                        <span className="font-display text-lg font-semibold text-white">
              TeaPulse <span className="text-[#00E68A]">AI</span>
            </span>
                    </Link>
                    <p className="text-sm leading-relaxed max-w-xs">
                        Satellite mapping, block-level soil data, and AI diagnosis — built to bring
                        precision to every acre of a Ceylon tea estate.
                    </p>
                    <div className="flex items-center gap-3 pt-2">
                        {socialLinks.map(({ href, label, Icon }) => (
                            <Link
                                key={label}
                                href={href}
                                aria-label={label}
                                className="bg-white/5 border border-white/10 rounded-lg p-2 hover:border-[#00E68A]/40 hover:text-[#00E68A] transition"
                            >
                                <Icon className="w-4 h-4" />
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Product links */}
                <div className="md:col-span-3">
                    <p className="text-xs font-semibold tracking-[0.15em] uppercase text-[#5A5748] mb-4">
                        Product
                    </p>
                    <ul className="space-y-3">
                        {productLinks.map((link) => (
                            <li key={link.href}>
                                <Link href={link.href} className="text-sm hover:text-white transition">
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Company links */}
                <div className="md:col-span-2">
                    <p className="text-xs font-semibold tracking-[0.15em] uppercase text-[#5A5748] mb-4">
                        Company
                    </p>
                    <ul className="space-y-3">
                        {companyLinks.map((link) => (
                            <li key={link.href}>
                                <Link href={link.href} className="text-sm hover:text-white transition">
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact */}
                <div className="md:col-span-2">
                    <p className="text-xs font-semibold tracking-[0.15em] uppercase text-[#5A5748] mb-4">
                        Contact
                    </p>
                    <ul className="space-y-3 text-sm">
                        <li className="flex items-start gap-2">
                            <Mail className="w-4 h-4 text-[#00E68A] mt-0.5 shrink-0" />
                            <a href="mailto:hello@teapulse.ai" className="hover:text-white transition">
                                hello@teapulse.ai
                            </a>
                        </li>
                        <li className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-[#00E68A] mt-0.5 shrink-0" />
                            <span>Colombo, Sri Lanka</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs">
                        &copy; {new Date().getFullYear()} TeaPulse AI. All rights reserved.
                    </p>

                </div>
            </div>
        </footer>
    );
}