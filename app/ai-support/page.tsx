'use client';

import { useState, useRef } from 'react';
import {
    ScanLine,
    UploadCloud,
    ImageIcon,
    Sparkles,
    Gauge,
    ListChecks,
    Clock,
} from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function AiSupportPage() {
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) setPreview(URL.createObjectURL(file));
    }

    return (
        <div suppressHydrationWarning className="relative min-h-screen bg-[#0A0F0D] text-[#E8E4D6]">
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap');
                .font-display {
                    font-family: 'Fraunces', Georgia, serif;
                    font-optical-sizing: auto;
                }
                body {
                    font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
                }
            `}</style>

            <Navbar />

            <main className="relative pt-32 pb-24 px-6 max-w-6xl mx-auto min-h-[720px]">
                {/* ---------- Real UI ---------- */}
                <div aria-hidden="true" className="pointer-events-none select-none blur-md opacity-70">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <span className="text-[#00E68A] text-xs tracking-[0.25em] uppercase font-semibold">
                            AI Agronomy
                        </span>
                        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-white mt-4">
                            AI Doctor — Leaf Diagnosis
                        </h1>
                        <p className="text-[#B9B6A8] text-sm mt-3">
                            Upload a photo of a tea leaf and get an instant health report.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Upload panel */}
                        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 flex flex-col gap-5">
                            <div className="flex items-center gap-2 text-white font-display text-lg font-semibold">
                                <UploadCloud className="w-5 h-5 text-[#00E68A]" />
                                Upload a Leaf Photo
                            </div>

                            <label
                                htmlFor="leaf-upload"
                                className="relative flex flex-col items-center justify-center gap-3 border-2 border-dashed border-white/15 rounded-2xl h-64 cursor-pointer hover:border-[#00E68A]/40 transition overflow-hidden"
                            >
                                {preview ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={preview} alt="" className="absolute inset-0 w-full h-full object-cover" />
                                ) : (
                                    <>
                                        <ImageIcon className="w-8 h-8 text-[#5A5748]" />
                                        <p className="text-xs text-[#8A8677] text-center px-6">
                                            Click to upload, or drag and drop a JPG or PNG
                                        </p>
                                    </>
                                )}
                                <input
                                    id="leaf-upload"
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </label>

                            <button
                                type="button"
                                className="inline-flex items-center justify-center gap-2 bg-[#00E68A] text-[#0A0F0D] font-semibold text-sm px-6 py-3 rounded-xl transition hover:bg-[#00E68A]/90"
                            >
                                <Sparkles className="w-4 h-4" />
                                Diagnose Leaf
                            </button>
                            <p className="text-[11px] text-[#8A8677]">
                                For best results, use a clear, well-lit photo of a single leaf.
                            </p>
                        </div>

                        {/* Results panel */}
                        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 flex flex-col gap-5">
                            <div className="flex items-center gap-2 text-white font-display text-lg font-semibold">
                                <ScanLine className="w-5 h-5 text-[#00E68A]" />
                                Diagnosis Results
                            </div>

                            <div className="flex items-center gap-3 bg-white/[0.03] border border-white/10 rounded-xl p-4">
                                <div className="bg-[#00E68A]/10 p-2.5 rounded-lg text-[#00E68A]">
                                    <Gauge className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-[#8A8677]">Detected Condition</p>
                                    <p className="text-sm font-semibold text-white mt-1">Blister Blight</p>
                                </div>
                                <span className="text-xs font-semibold text-[#00E68A]">92%</span>
                            </div>

                            <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 space-y-3">
                                <div className="flex items-center gap-2 text-xs text-[#8A8677] font-semibold">
                                    <ListChecks className="w-4 h-4" />
                                    Recommended Steps
                                </div>
                                <ul className="space-y-2 text-sm text-[#D6D3C4]">
                                    <li>1. Prune and remove affected leaves.</li>
                                    <li>2. Apply a copper-based fungicide.</li>
                                    <li>3. Improve air circulation across the block.</li>
                                </ul>
                            </div>

                            <div className="flex items-center gap-2 text-xs text-[#8A8677]">
                                <Clock className="w-3.5 h-3.5" />
                                Analyzed in 2.4s
                            </div>
                        </div>
                    </div>
                </div>

                {/* ---------- Coming Soon overlay ---------- */}
                <div className="absolute inset-0 flex items-center justify-center px-6">
                    <div className="bg-[#0A0F0D]/90 border border-white/10 rounded-3xl px-8 py-10 sm:px-12 sm:py-12 max-w-md w-full text-center shadow-2xl shadow-black/50">
                        <div className="w-14 h-14 mx-auto rounded-2xl bg-[#00E68A]/10 border border-[#00E68A]/30 text-[#00E68A] flex items-center justify-center mb-6">
                            <ScanLine className="w-7 h-7" />
                        </div>
                        <span className="inline-block text-[10px] font-bold tracking-[0.2em] uppercase text-[#00E68A] bg-[#00E68A]/10 border border-[#00E68A]/30 rounded-full px-3 py-1 mb-4">
                            Coming Soon
                        </span>
                        <h2 className="font-display text-2xl font-semibold text-white">
                            AI Doctor is still in training
                        </h2>
                        <p className="text-sm text-[#B9B6A8] leading-relaxed mt-3">
                            We&apos;re training the model on thousands of tea leaf photos to get diagnoses
                            right before it goes live. Check back soon.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}