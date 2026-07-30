// app/articles/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, BookOpen, Clock, Calendar, ChevronRight, Sparkles, X, Leaf } from 'lucide-react';



export default function ArticlesPage() {
  const router = useRouter();
  const [selectedArticle, setSelectedArticle] = useState<any>(null);

  // Tea Cultivation & Disease Articles Data with Image and Full Content
  const articles = [
    {
      id: 1,
      title: 'තේ වතුවල බුබුළු අංගමාරය (Blister Blight) - රෝග ලක්ෂණ, ජීවන චක්‍රය සහ පාලන ක්‍රම',
      category: 'Plant Pathology & Disease',
      readTime: '7 min read',
      date: 'Jul 30, 2026',
      excerpt: 'තේ දලු වලට වැළඳෙන ප්‍රධාන දිලීර රෝගයක් වන බුබුළු අංගමාරය (Exobasidium vexans) පිළිබඳ සම්පූර්ණ විස්තරය, රෝග ලක්ෂණ සහ සස්ය විද්‍යාත්මක පාලන ක්‍රම.',
      imageBg: 'from-[#7C5AA6] to-[#553878]',
      
      articleImage: '/images/blister-blight-leaf.jpeg', 
      fullContent: {
        intro: "බුබුළු අංගමාරය යනු තේ වගාවට දැඩි ලෙස බලපාන ප්‍රධාන දිලීර රෝගයකි. මෙහිදී තේ දලු සහ දලු අංකුර වලට දැඩි හානි සිදු වේ.",
        sections: [
          {
            title: "1. රෝග ලක්ෂණ (Symptoms)",
            points: [
              "පත්‍ර මතුපිට: මුල් අවස්ථාවේදී, නෙළා ගත හැකි පළමු හෝ දෙවන උපති තේ පත්‍ර වල ලා කහ පාට හෝ ලාකොළ පාට පාරදෘශ්‍ය ලප ඇතිවේ. මේවා ක්‍රමයෙන් බුබුළු දක්වා වර්ධනය වේ.",
              "ප්‍රමාණය: හොඳින් වර්ධනය වූ බුබුළු වල ප්‍රමාණය දළ වශයෙන් සෙන්ටිමීටරයක් පමණ විෂ්කම්භයකින් යුක්ත වේ.",
              "ස්ථානය: සාමාන්‍යයෙන් පත්‍රයක යට මතුපිට උත්තල වන අතර උඩ කොටස අවතල වේ. නමුත් විටින් විට එය ප්‍රතිලෝමවද විය හැක.",
              "සුදු පැහැ බීජාණු: සුදු පාට පිටි වැනි බීජාණු, පත්‍රයේ යටි පැත්තේ උත්තල මතුපිට ඇති වේ.",
              "කඳට වන හානිය: ඉවලාකාර හැඩැති, කඳේ දික් අතට අක්ෂය දිගේ සන් තුවාල ඇති වේ. ආසාදිත තුවාල සුදුපාට වෙල්වට් ස්වභාවයක් සහිත ලප බවට පත් වේ. ආසාදිත කඳන් ප්‍රතිවිරුද්ධ දිශාවට නැමෙයි.",
              "අංකුර මියයාම: ආසාදිත ස්ථානයට ඉහළින් අංකුර මිය යයි."
            ]
          },
          {
            title: "2. ජීවන චක්‍රය (Life Cycle)",
            points: [
              "ආසාදනය ආරම්භ වන්නේ වාතය හරහා සංසරණය වන බැසිඩ්බීජාණු මගිනි.",
              "බැසිඩ් බීජාණු ප්‍රෝරෝහණය වීමට සහ ඇපුසෝරියම සෑදීම සඳහා පැය 6-16 ගත වේ.",
              "සෘජුවම විනිවිද යාමෙන් ආසාදනය සිදු වේ.",
              "දිලීර අන්තර් සෛලීයව වර්ධනය වන අතර ආසාදනයෙන් පසු දින 8-10ක් ඇතුළත පළමු දෘශ්‍ය රෝග ලක්ෂණ ලෙස ලෙමන් කොළ පැහැති පාරදෘශ්‍ය ලප ඇතිවේ.",
              "හවුස්ටෝරියා හරහා පෝෂණය ලබා ගනිමින් පටක තුළ දිලීර දිගටම වර්ධනය වේ.",
              "සෛල විස්තාරණය වීම නිසා පහළ පෘෂ්ඨයේ මතුපිට බුබුළු ඇතිවේ (ආසාදනය වීමෙන් දින 15-17 කට පසුව).",
              "ආසාදනය වී දින 18-21 කට පසු බීජාණු පිටවීම සහ පිටකිරීම සිදු වේ.",
              "දිලීර දින 11-28 තුළ සිය ජීවන චක්‍රය සම්පූර්ණ කරයි."
            ]
          },
          {
            title: "3. ව්‍යාප්තිය සහ අස්වනු හානිය",
            points: [
              "ව්‍යාප්තිය: උඩට, මැදට (මීටර් 600 ට වැඩි) සහ පහතරට සමහර ප්‍රදේශ වල බහුලව දක්නට ලැබේ.",
              "අස්වනු හානිය: 25 - 32% අතර අස්වනු හානියක් සිදු කරයි."
            ]
          },
          {
            title: "4. ප්‍රතිරෝධී තේ ප්‍රභේද (Resistant Cultivars)",
            points: [
              "ප්‍රතිරෝධී ප්‍රභේද: DT 1, N 2, NAY 3, KEN 16/3, PK 2, TRI 3072, TRI 4052, TRI 4067, TRI 4076",
              "මධ්‍යස්ථ ප්‍රතිරෝධී ප්‍රභේද: TRI 3019, TRI 4053, TRI 4078, TRI 4079, TRI 4085"
            ]
          },
          {
            title: "5. සස්ය විද්‍යාත්මක ක්‍රම (Agronomic Practices)",
            points: [
              "මෝසම් වැසි කාලය ආරම්භ වීමත් සමඟම තේ ඉඩම් වල සෙවන කප්පාදු කිරීම.",
              "කෙටි දළු රවුම (Short plucking rounds) පවත්වා ගැනීම.",
              "දැඩි දළු නෙළීම (Hard plucking) මගින් රෝගී දලු ඉවත් කිරීම."
            ]
          }
        ]
      }
    },
    {
      id: 2,
      title: 'Optimizing Nitrogen & Soil pH for High-Yield Tea Harvests',
      category: 'Agronomy & Soil',
      readTime: '4 min read',
      date: 'Jul 28, 2026',
      excerpt: 'Discover how maintaining precise soil pH levels between 4.5 and 5.5 and managing nitrogen targets directly boosts Grade A fine tender leaf production.',
      imageBg: 'from-[#2F6B4A] to-[#163C2C]',
      fullContent: {
        intro: "Maintaining optimal soil health is crucial for maximizing tea yields in Sri Lankan plantations.",
        sections: [
          {
            title: "Soil pH Management",
            points: [
              "Tea bushes thrive in acidic soils with a pH range between 4.5 and 5.5.",
              "Use agricultural sulfur or organic compost if soil becomes too alkaline."
            ]
          }
        ]
      }
    },
    {
      id: 3,
      title: 'The Future of Smart Tea Estates: IoT Sensors & Precision Farming',
      category: 'Smart Agriculture',
      readTime: '6 min read',
      date: 'Jul 20, 2026',
      excerpt: 'How real-time telemetry and IoT soil moisture sensors are transforming traditional 30-acre tea plantations into automated, high-efficiency estates.',
      imageBg: 'from-[#B68D40] to-[#8C6A2F]',
      fullContent: {
        intro: "Precision agriculture brings digital transformation to tea estate management.",
        sections: [
          {
            title: "IoT Telemetry",
            points: [
              "Deploying soil moisture and nitrogen sensors across micro-blocks.",
              "Automated data streaming to dashboards for real-time irrigation and fertilization decisions."
            ]
          }
        ]
      }
    }
  ];

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
        {articles.map((art) => (
          <div key={art.id} className="bg-white border border-[#E3DCC6] rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div>
              {/* Real Image Banner representing article theme */}
              <div className="h-44 w-full relative overflow-hidden bg-[#163C2C]">
                {art.articleImage ? (
                  <img 
                    src={art.articleImage} 
                    alt={art.title} 
                    className="w-full h-full object-cover hover:scale-105 transition duration-300"
                  />
                ) : (
                  <div className={`h-full w-full bg-gradient-to-br ${art.imageBg}`} />
                )}
                {/* Dark overlay gradient for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                <span className="absolute top-4 left-4 bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border border-white/30">
                  {art.category}
                </span>
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[11px] text-white/90">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {art.date}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {art.readTime}</span>
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

      {/* FULL ARTICLE MODAL POPUP WITH IMAGE */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl border border-[#E3DCC6] p-6 md:p-8 space-y-6 relative animate-in fade-in zoom-in duration-200">
            
            {/* Close Button */}
            <button 
              onClick={() => setSelectedArticle(null)}
              className="absolute top-6 right-6 bg-[#F3EFE3] hover:bg-[#2F6B4A] hover:text-white text-[#54503F] p-2.5 rounded-full transition cursor-pointer z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="space-y-3 pr-10 border-b border-[#E3DCC6] pb-5">
              <div className="flex items-center gap-2">
                <span className="bg-[#2F6B4A]/10 text-[#2F6B4A] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-[#2F6B4A]/20">
                  {selectedArticle.category}
                </span>
                <span className="text-xs text-[#8A836E] flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {selectedArticle.date}</span>
                <span className="text-xs text-[#8A836E] flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {selectedArticle.readTime}</span>
              </div>
              <h2 className="font-display text-xl md:text-2xl font-bold text-[#163C2C] leading-snug">
                {selectedArticle.title}
              </h2>
            </div>

            {/* Optional Article Image Display */}
            {selectedArticle.articleImage && (
              <div className="w-full h-64 md:h-80 rounded-2xl overflow-hidden border border-[#E3DCC6] relative">
                <img 
                  src={selectedArticle.articleImage} 
                  alt="Blister Blight Symptoms" 
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Modal Body Content */}
            <div className="space-y-6 text-xs md:text-sm text-[#3A3428] leading-relaxed">
              <p className="font-medium text-[#163C2C] bg-[#F3EFE3] p-4 rounded-2xl border border-[#E3DCC6]">
                {selectedArticle.fullContent.intro}
              </p>

              {selectedArticle.fullContent.sections.map((sec: any, idx: number) => (
                <div key={idx} className="space-y-3">
                  <h3 className="font-display font-semibold text-base text-[#2F6B4A] flex items-center gap-2">
                    <Leaf className="w-4 h-4 text-[#B68D40]" /> {sec.title}
                  </h3>
                  <ul className="space-y-2 pl-4 border-l-2 border-[#E3DCC6]">
                    {sec.points.map((pt: string, pIdx: number) => (
                      <li key={pIdx} className="text-[#54503F] leading-relaxed">
                        • {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
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