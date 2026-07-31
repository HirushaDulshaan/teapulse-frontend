'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useInfiniteQuery } from '@tanstack/react-query';
import { ArrowLeft, BookOpen, Clock, Calendar, ChevronRight, Sparkles, X, Leaf, Loader2 } from 'lucide-react';

const PAGE_SIZE = 5;

// Paginated fetch function
const fetchArticles = async ({ pageParam = 0 }) => {
    const backendUrl = process.env.NEXT_PUBLIC_FASTAPI_URL || 'http://localhost:8000';
    const res = await fetch(`${backendUrl}/articles/?limit=${PAGE_SIZE}&offset=${pageParam}`);
    const result = await res.json();
    if (!result.success) {
        throw new Error('Failed to fetch articles');
    }
    return result; // { success, data, total, limit, offset }
};

export default function ArticlesPage() {
    const router = useRouter();
    const [selectedArticle, setSelectedArticle] = useState<any>(null);

    // Infinite/paginated query — loads 5 at a time
    const {
        data,
        isLoading,
        isError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ['articles'],
        queryFn: fetchArticles,
        initialPageParam: 0,
        getNextPageParam: (lastPage) => {
            const loadedSoFar = lastPage.offset + lastPage.data.length;
            return loadedSoFar < lastPage.total ? loadedSoFar : undefined;
        },
    });

    // Flatten all loaded pages into a single articles array
    const articles = data?.pages.flatMap((page) => page.data) || [];

    if (isLoading) {
        return (
            <div className="min-h-screen w-full bg-[#FBFAF6] flex items-center justify-center">
                <p className="text-xs text-[#8A836E] animate-pulse">Loading articles from database...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen w-full bg-[#FBFAF6] flex items-center justify-center">
                <p className="text-xs text-red-500 font-medium">Failed to load articles. Please check your backend connection.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-[#FBFAF6] text-[#1A1A17] font-sans p-4 md:p-8 space-y-6 relative">
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap');
                .font-display {
                    font-family: 'Fraunces', Georgia, serif;
                    font-optical-sizing: auto;
                }
            `}</style>

            {/* Header */}
            <div className="flex items-start sm:items-center justify-between border-b border-[#E3DCC6] pb-4 gap-3">
                <div className="flex items-start sm:items-center gap-3">
                    <button
                        onClick={() => router.back()}
                        className="bg-white p-2.5 rounded-xl border border-[#E3DCC6] hover:border-[#B68D40]/40 transition text-[#54503F] shadow-sm flex items-center justify-center cursor-pointer shrink-0"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="font-display text-lg sm:text-xl font-semibold text-[#163C2C] flex flex-wrap items-center gap-2 leading-snug">
                            <BookOpen className="w-5 h-5 text-[#2F6B4A] shrink-0" />
                            <span>Tea Cultivation & Smart Agri Knowledge Base</span>
                        </h1>
                        <p className="text-xs text-[#8A836E] mt-1">
                            Expert insights, agronomy guides, and modern estate management articles
                        </p>
                    </div>
                </div>

                <span className="hidden md:flex bg-[#2F6B4A]/10 text-[#2F6B4A] px-3.5 py-1.5 rounded-full text-xs font-semibold border border-[#2F6B4A]/20 items-center gap-1.5 shrink-0">
          <Sparkles className="w-4 h-4" /> Updated Daily
        </span>
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto pt-2">
                {articles.map((art: any) => (
                    <div key={art.id} className="bg-white border border-[#E3DCC6] rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between">
                        <div>
                            <div className="h-44 w-full relative overflow-hidden bg-[#163C2C]">
                                {art.article_image ? (
                                    <img
                                        src={art.article_image}
                                        alt={art.title}
                                        className="w-full h-full object-cover hover:scale-105 transition duration-300"
                                    />
                                ) : (
                                    <div className="h-full w-full bg-gradient-to-br from-[#2F6B4A] to-[#163C2C]" />
                                )}

                                <span className="absolute top-4 left-4 bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border border-white/30">
                  {art.category}
                </span>
                                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[11px] text-white/90">
                                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {art.date}</span>
                                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {art.read_time}</span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-3">
                                <h3 className="font-display font-semibold text-base text-[#163C2C] leading-snug hover:text-[#2F6B4A] transition cursor-pointer">
                                    {art.title}
                                </h3>
                                <p className="text-xs text-[#8A836E] leading-relaxed">
                                    {art.excerpt}
                                </p>
                            </div>
                        </div>

                        <div className="p-6 pt-0">
                            <button
                                onClick={() => setSelectedArticle(art)}
                                className="w-full bg-[#F3EFE3] hover:bg-[#2F6B4A] hover:text-white text-[#163C2C] font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                            >
                                Read Full Article <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Load More Button */}
            {hasNextPage && (
                <div className="flex justify-center pt-2">
                    <button
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                        className="bg-white border border-[#E3DCC6] hover:border-[#2F6B4A]/40 text-[#163C2C] font-bold px-6 py-3 rounded-xl text-xs flex items-center gap-2 transition shadow-sm cursor-pointer disabled:opacity-50"
                    >
                        {isFetchingNextPage ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" /> Loading more...
                            </>
                        ) : (
                            'Load More Articles'
                        )}
                    </button>
                </div>
            )}

            {/* FULL ARTICLE MODAL POPUP */}
            {selectedArticle && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl border border-[#E3DCC6] p-6 md:p-8 space-y-6 relative animate-in fade-in zoom-in duration-200">

                        <button
                            onClick={() => setSelectedArticle(null)}
                            className="absolute top-6 right-6 bg-[#F3EFE3] hover:bg-[#2F6B4A] hover:text-white text-[#54503F] p-2.5 rounded-full transition cursor-pointer z-10"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="space-y-3 pr-10 border-b border-[#E3DCC6] pb-5">
                            <div className="flex items-center gap-2">
                <span className="bg-[#2F6B4A]/10 text-[#2F6B4A] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-[#2F6B4A]/20">
                  {selectedArticle.category}
                </span>
                                <span className="text-xs text-[#8A836E] flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {selectedArticle.date}</span>
                                <span className="text-xs text-[#8A836E] flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {selectedArticle.read_time}</span>
                            </div>
                            <h2 className="font-display text-xl md:text-2xl font-bold text-[#163C2C] leading-snug">
                                {selectedArticle.title}
                            </h2>
                        </div>

                        {selectedArticle.article_image && (
                            <div className="w-full h-64 md:h-80 rounded-2xl overflow-hidden border border-[#E3DCC6] relative">
                                <img
                                    src={selectedArticle.article_image}
                                    alt={selectedArticle.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        <div className="space-y-6 text-xs md:text-sm text-[#3A3428] leading-relaxed">
                            <p className="font-medium text-[#163C2C] bg-[#F3EFE3] p-4 rounded-2xl border border-[#E3DCC6]">
                                {selectedArticle.full_content?.intro}
                            </p>

                            {selectedArticle.full_content?.sections?.map((sec: any, idx: number) => (
                                <div key={idx} className="space-y-3">
                                    <h3 className="font-display font-semibold text-base text-[#2F6B4A] flex items-center gap-2">
                                        <Leaf className="w-4 h-4 text-[#B68D40]" /> {sec.title}
                                    </h3>
                                    <ul className="space-y-2 pl-4 border-l-2 border-[#E3DCC6]">
                                        {sec.points?.map((pt: string, pIdx: number) => (
                                            <li key={pIdx} className="text-[#54503F] leading-relaxed">
                                                • {pt}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        <div className="pt-4 border-t border-[#E3DCC6] flex justify-end">
                            <button
                                onClick={() => setSelectedArticle(null)}
                                className="bg-[#163C2C] hover:bg-[#1F4D36] text-[#F4EEDD] font-bold px-6 py-2.5 rounded-xl text-xs transition cursor-pointer"
                            >
                                Close Article
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}