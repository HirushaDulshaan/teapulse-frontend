'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, UploadCloud, Loader2, ShieldAlert, CheckCircle2, Stethoscope } from 'lucide-react';
import LandSidebar from '@/components/LandSidebar';

export default function AiSupportPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState<string | null>(null);

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setDiagnosisResult(null);
    }
  };

  // Submit image to FastAPI backend for AI Diagnosis
  const handleDiagnoseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setDiagnosisResult(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const fastApiUrl = process.env.NEXT_PUBLIC_FASTAPI_URL || 'http://localhost:8000';
      const res = await fetch(`${fastApiUrl}/api/v1/tea-leaves/diagnose-disease`, {
        method: 'POST',
        body: formData, // Sending file as multipart/form-data
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        setDiagnosisResult(data.diagnosis);
      } else {
        setDiagnosisResult('❌ Failed to analyze image. Please try again.');
      }
    } catch (err) {
      console.error('AI Diagnosis error:', err);
      setDiagnosisResult('❌ Network error connecting to AI server.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FBFAF6] text-[#1A1A17] font-sans p-4 md:p-8 space-y-6 overflow-x-hidden relative">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap');
        .font-display {
          font-family: 'Fraunces', Georgia, serif;
          font-optical-sizing: auto;
        }
      `}</style>

      <LandSidebar />

      {/* Header */}
      <header className="flex items-center justify-between border-b border-[#E3DCC6] pb-4 pr-28">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="bg-white p-2.5 rounded-xl border border-[#E3DCC6] hover:border-[#B68D40]/40 transition shadow-sm">
            <ArrowLeft className="w-5 h-5 text-[#54503F]" />
          </Link>
          <div>
            <h1 className="font-display text-xl font-semibold tracking-tight text-[#163C2C] flex items-center gap-2">
              <Stethoscope className="w-6 h-6 text-[#2F6B4A]" />
              AI Agronomy & <span className="text-[#2F6B4A]">Plant Doctor</span>
            </h1>
            <p className="text-xs text-[#8A836E]">
              Upload tea leaf or stem photos to instantly detect diseases, pest attacks, and get treatment guidelines.
            </p>
          </div>
        </div>

        <span className="hidden md:flex bg-[#2F6B4A]/10 text-[#2F6B4A] px-3.5 py-1.5 rounded-full text-xs font-semibold border border-[#2F6B4A]/20 items-center gap-1.5">
          <Sparkles className="w-4 h-4" /> Gemini Vision AI Powered
        </span>
      </header>

      {/* Main Content Layout */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT: Upload Form */}
        <div className="lg:col-span-5 bg-white border border-[#E3DCC6] shadow-sm p-6 rounded-3xl space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-[#E3DCC6] pb-3">
              <h3 className="font-display font-semibold text-[#163C2C] text-sm flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-[#2F6B4A]" /> Upload Affected Plant Image
              </h3>
            </div>

            <form onSubmit={handleDiagnoseSubmit} className="space-y-4">
              {/* Drag & Drop / File Input Box */}
              <div className="border-2 border-dashed border-[#D8CBA0] hover:border-[#2F6B4A] rounded-2xl p-6 text-center bg-[#FBFAF6] transition cursor-pointer relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {previewUrl ? (
                  <div className="space-y-3">
                    <img src={previewUrl} alt="Preview" className="max-h-48 mx-auto rounded-xl object-cover border border-[#E3DCC6]" />
                    <p className="text-xs text-[#2F6B4A] font-semibold">Click or drop another image to replace</p>
                  </div>
                ) : (
                  <div className="space-y-2 py-6">
                    <UploadCloud className="w-10 h-10 text-[#B7AF98] mx-auto" />
                    <p className="text-xs font-bold text-[#54503F]">Click to browse or drag & drop tea leaf photo</p>
                    <p className="text-[10px] text-[#8A836E]">Supports JPG, PNG, WEBP</p>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={!selectedFile || isAnalyzing}
                className="w-full bg-[#163C2C] hover:bg-[#1F4D36] text-[#F4EEDD] font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-[#163C2C]/15 disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Analyzing Plant Health with AI...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Run AI Disease Diagnosis
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="bg-[#F3EFE3] p-3.5 rounded-2xl border border-[#E3DCC6] text-[11px] text-[#54503F] space-y-1">
            <p className="font-bold text-[#163C2C]">💡 Tips for best results:</p>
            <p>• Take clear, well-lit close-up photos of the affected leaf spot or stem damage.</p>
          </div>
        </div>

        {/* RIGHT: AI Diagnosis Results Display */}
        <div className="lg:col-span-7 bg-white border border-[#E3DCC6] shadow-sm p-6 rounded-3xl space-y-5 flex flex-col justify-between min-h-[500px]">
          <div>
            <div className="border-b border-[#E3DCC6] pb-3 flex items-center justify-between">
              <h3 className="font-display font-semibold text-[#163C2C] text-base flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-[#B68D40]" /> AI Diagnostic Report & Recommendations
              </h3>
              {diagnosisResult && (
                <span className="text-[10px] bg-[#2F6B4A]/10 text-[#2F6B4A] border border-[#2F6B4A]/20 px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Analysis Complete
                </span>
              )}
            </div>

            <div className="pt-4">
              {isAnalyzing ? (
                <div className="h-64 flex flex-col items-center justify-center text-[#8A836E] gap-3 text-xs">
                  <Loader2 className="w-8 h-8 animate-spin text-[#2F6B4A]" />
                  <p>Examining leaf patterns, discoloration, and pathogens...</p>
                </div>
              ) : diagnosisResult ? (
                <div className="bg-[#FBFAF6] p-5 rounded-2xl border border-[#E3DCC6] space-y-4 text-xs text-[#3A3428] leading-relaxed whitespace-pre-line">
                  {diagnosisResult}
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-xs text-[#8A836E] italic border border-dashed border-[#E3DCC6] rounded-2xl p-6 text-center">
                  <Stethoscope className="w-10 h-10 text-[#D8CBA0] mb-2" />
                  No diagnosis generated yet. Upload an image of a tea leaf on the left and click "Run AI Disease Diagnosis"!
                </div>
              )}
            </div>
          </div>

          <div className="bg-[#7C5AA6]/10 border border-[#7C5AA6]/20 p-4 rounded-2xl flex items-center gap-3 text-xs text-[#5C4270]">
            <Sparkles className="w-5 h-5 shrink-0 text-[#7C5AA6]" />
            <span>
              Early detection of diseases like <strong>Blister Blight</strong> or <strong>Red Spider Mite</strong> prevents crop loss and ensures sustainable estate yields.
            </span>
          </div>
        </div>

      </main>
    </div>
  );
}