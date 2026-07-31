'use client';

import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    MapPin,
    UserPlus,
    Box,
    Navigation,
    FlaskConical,
    ClipboardCheck,
    TrendingUp,
    Leaf,
    PiggyBank,
    Sprout,
    ScanLine,
    Upload,
    ListChecks,
} from 'lucide-react';

const steps = [
    {
        n: '01',
        icon: MapPin,
        title: 'Satellite Land Selection',
        text: "Using live satellite imagery, you draw and select the exact boundaries of your estate land — the very first step before any account is created.",
    },
    {
        n: '02',
        icon: UserPlus,
        title: 'Signup & 3D Dashboard',
        text: "After selecting your land, create your account. Once registration succeeds, you're taken straight to your dashboard where your estate is rendered as an interactive 3D model.",
    },
    {
        n: '03',
        icon: Box,
        title: 'Automatic Block Division',
        text: 'Our API automatically divides your land into manageable blocks — every acre split into 4 blocks — so each section of your estate can be tracked on its own.',
    },
    {
        n: '04',
        icon: Navigation,
        title: 'Map-Guided Navigation',
        text: 'Tap any block to see it laid out exactly as it sits on your land, and get a real-time route that navigates you or your workers straight to it.',
    },
    {
        n: '05',
        icon: FlaskConical,
        title: 'Daily Soil Analysis',
        text: 'Every day, sensor readings from each block — pH, nitrogen, oxygen, calcium and more — are pulled in and analyzed to flag what\u2019s running low or high.',
    },
    {
        n: '06',
        icon: ClipboardCheck,
        title: 'AI-Assigned Tasks',
        text: 'Based on that analysis, the AI assigns a specific task for that block — like applying fertilizer — so issues are corrected before they reach the crop.',
    },
    {
        n: '07',
        icon: TrendingUp,
        title: 'Yield Predictions',
        text: 'Mark a task complete and the AI generates a prediction — such as an expected rise in harvest from that day — so you can see the impact of your work.',
    },
    {
        n: '08',
        icon: Leaf,
        title: 'Leaf Quality Trends',
        text: 'Alongside soil data, the AI tracks tea leaf condition over time — estimating existing damage and whether quality is trending up or down.',
    },
];

export default function IntroductionPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen w-full bg-[#FBFAF6] text-[#1A1A17] font-sans">
            <style jsx global>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(14px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .step-card {
                    opacity: 0;
                    animation: fadeInUp 0.6s ease-out forwards;
                }
                @media (prefers-reduced-motion: reduce) {
                    .step-card { opacity: 1; animation: none; }
                }
            `}</style>

            <div className="max-w-5xl mx-auto p-6 md:p-12 space-y-14">

                {/* Header & Back Button */}
                <div className="flex items-center justify-between border-b border-[#E3DCC6] pb-6">
                    <button
                        onClick={() => router.back()}
                        className="bg-white p-2.5 rounded-xl border border-[#E3DCC6] hover:border-[#2F6B4A]/40 transition text-[#54503F] shadow-sm flex items-center gap-2 text-xs font-bold cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Home
                    </button>
                    <div className="flex items-center gap-2 text-[#2F6B4A] font-bold text-sm">
                        <Sprout className="w-5 h-5" />
                        <span>TeaPulse Platform Guide</span>
                    </div>
                </div>

                {/* Hero Section */}
                <div className="relative overflow-hidden rounded-[2rem] bg-[#163C2C] px-6 py-14 md:px-16 md:py-20 text-center">
                    {/* Terraced hillside contour pattern — signature motif */}
                    <svg
                        className="absolute inset-0 w-full h-full opacity-[0.12] pointer-events-none"
                        viewBox="0 0 800 400"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                    >
                        {[60, 120, 180, 240, 300, 360].map((y, i) => (
                            <path
                                key={y}
                                d={`M0 ${y} Q 100 ${y - 30}, 200 ${y} T 400 ${y} T 600 ${y} T 800 ${y}`}
                                fill="none"
                                stroke="#C08A2E"
                                strokeWidth="1.5"
                            />
                        ))}
                    </svg>

                    <div className="relative space-y-5 max-w-2xl mx-auto">
                        <span className="inline-flex items-center gap-2 rounded-full border border-[#C08A2E]/40 bg-[#C08A2E]/10 px-4 py-1.5 text-[11px] font-bold tracking-wide text-[#E3B95F] uppercase">
                            <Sprout className="w-3.5 h-3.5" />
                            Precision agriculture for Ceylon tea
                        </span>
                        <h1 className="text-3xl md:text-5xl font-extrabold text-[#F4EEDD] font-display tracking-tight">
                            How <span className="text-[#E3B95F]">TeaPulse</span> Works
                        </h1>
                        <p className="text-sm md:text-base text-[#CFE3D5] leading-relaxed">
                            From satellite land selection to daily soil analysis, guided tasks, and
                            yield predictions — TeaPulse catches problems before they ever reach the leaf.
                        </p>
                    </div>
                </div>

                {/* Workflow Steps Grid */}
                <div className="space-y-6">
                    <div className="flex items-baseline justify-between">
                        <h2 className="text-lg md:text-xl font-bold text-[#163C2C] font-display">
                            The Growing Cycle
                        </h2>
                        <span className="text-[11px] font-bold text-[#8A8468] uppercase tracking-wide">
                            8 steps
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {steps.map((step, i) => {
                            const Icon = step.icon;
                            return (
                                <div
                                    key={step.n}
                                    className="step-card group relative bg-white p-6 rounded-3xl border border-[#E3DCC6] shadow-sm space-y-4 hover:border-[#2F6B4A]/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                                    style={{ animationDelay: `${i * 70}ms` }}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="w-12 h-12 rounded-2xl bg-[#2F6B4A]/10 text-[#2F6B4A] flex items-center justify-center group-hover:bg-[#2F6B4A] group-hover:text-white transition-colors duration-300">
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <span className="font-display text-3xl font-extrabold text-[#E3DCC6] leading-none">
                                            {step.n}
                                        </span>
                                    </div>
                                    <div className="text-[#163C2C] font-bold text-base">
                                        {step.title}
                                    </div>
                                    <p className="text-xs md:text-sm text-[#54503F] leading-relaxed">
                                        {step.text}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* AI Doctor Spotlight — signature feature block */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#163C2C] to-[#1F4E3A] p-8 md:p-10 border border-[#C08A2E]/30">
                    <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-[#C08A2E]/10 blur-2xl" aria-hidden="true" />
                    <div className="relative grid grid-cols-1 md:grid-cols-[auto,1fr] gap-8 items-start">
                        <div className="w-14 h-14 rounded-2xl bg-[#C08A2E]/15 border border-[#C08A2E]/30 text-[#E3B95F] flex items-center justify-center">
                            <ScanLine className="w-7 h-7" />
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold tracking-widest uppercase text-[#E3B95F]">
                                    Anytime, on any block
                                </span>
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold text-[#F4EEDD] font-display">
                                AI Doctor — Diagnose a Leaf Instantly
                            </h3>
                            <p className="text-xs md:text-sm text-[#CFE3D5] leading-relaxed max-w-2xl">
                                Snap a photo of any tea leaf and let AI Doctor take a look. It examines
                                the leaf, tells you exactly what's wrong, and hands you a clear set of
                                steps to fix it — no waiting for a field visit.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                <div className="flex items-start gap-3 bg-white/5 rounded-2xl p-4 border border-white/10">
                                    <Upload className="w-4 h-4 text-[#E3B95F] mt-0.5 shrink-0" />
                                    <p className="text-xs text-[#CFE3D5] leading-relaxed">
                                        Upload a photo of any leaf directly from a block's page.
                                    </p>
                                </div>
                                <div className="flex items-start gap-3 bg-white/5 rounded-2xl p-4 border border-white/10">
                                    <ListChecks className="w-4 h-4 text-[#E3B95F] mt-0.5 shrink-0" />
                                    <p className="text-xs text-[#CFE3D5] leading-relaxed">
                                        Get a step-by-step treatment plan tailored to what it finds.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Why it matters strip */}
                <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#E3DCC6] shadow-sm flex flex-col md:flex-row items-center gap-6">
                    <div className="w-14 h-14 shrink-0 rounded-2xl bg-[#2F6B4A]/10 text-[#2F6B4A] flex items-center justify-center">
                        <PiggyBank className="w-7 h-7" />
                    </div>
                    <p className="text-xs md:text-sm text-[#54503F] leading-relaxed">
                        Most farmers only notice a nutrient deficiency once the leaves have already
                        started showing damage — often weeks after the problem began. TeaPulse's AI
                        predicts that need in advance, telling you exactly when and where to apply
                        fertilizer before any damage happens — cutting unnecessary fertilizer use and
                        saving real money on every estate.
                    </p>
                </div>

                {/* Bottom Call to Action */}
                <div className="relative overflow-hidden bg-[#163C2C] text-[#F4EEDD] p-8 rounded-3xl text-center space-y-4 shadow-sm">
                    <h2 className="text-xl md:text-2xl font-bold font-display">
                        Ready to digitize your tea estate?
                    </h2>
                    <p className="text-xs md:text-sm text-[#E3DCC6] max-w-xl mx-auto">
                        Experience seamless farm management with real-time IoT insights and spatial
                        mapping tailored for modern Ceylon tea cultivation.
                    </p>
                    <div className="pt-2">
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="bg-[#2F6B4A] hover:bg-[#25563B] text-white font-bold px-8 py-3 rounded-xl text-xs transition cursor-pointer shadow-md"
                        >
                            Get Started Now
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}