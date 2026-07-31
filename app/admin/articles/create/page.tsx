'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2, Save, Sparkles, BookOpen, Upload, Edit3, RefreshCw } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Supabase Client Initialization
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function CreateOrUpdateArticlePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    // Existing Articles list for Dropdown
    const [articlesList, setArticlesList] = useState<any[]>([]);
    const [selectedArticleId, setSelectedArticleId] = useState<string>('');

    // Form States
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [readTime, setReadTime] = useState('');
    const [date, setDate] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [articleImage, setArticleImage] = useState('');
    const [intro, setIntro] = useState('');

    // Sections State
    const [sections, setSections] = useState<{ title: string; points: string[] }[]>([
        { title: '', points: [''] }
    ]);

    // Fetch all articles on load to populate dropdown
    useEffect(() => {
        fetchArticlesList();
    }, []);

    const fetchArticlesList = async () => {
        try {
            const backendUrl = process.env.NEXT_PUBLIC_FASTAPI_URL || 'http://localhost:8000';
            const res = await fetch(`${backendUrl}/articles/`);
            const result = await res.json();
            if (result.success) {
                setArticlesList(result.data);
            }
        } catch (err) {
            console.error("Failed to load articles list", err);
        }
    };

    // When an article is selected from dropdown, load its data into form
    const handleSelectArticle = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const artId = e.target.value;
        setSelectedArticleId(artId);

        if (!artId) {
            // Reset form if "Create New" is selected
            clearForm();
            return;
        }

        const found = articlesList.find((art) => art.id.toString() === artId);
        if (found) {
            setTitle(found.title || '');
            setCategory(found.category || '');
            setReadTime(found.read_time || '');
            setDate(found.date || '');
            setExcerpt(found.excerpt || '');
            setArticleImage(found.article_image || '');
            setIntro(found.full_content?.intro || '');
            setSections(found.full_content?.sections || [{ title: '', points: [''] }]);
        }
    };

    const clearForm = () => {
        setTitle('');
        setCategory('');
        setReadTime('');
        setDate('');
        setExcerpt('');
        setArticleImage('');
        setIntro('');
        setSections([{ title: '', points: [''] }]);
    };

    // Handle Image File Upload to Supabase Storage
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingImage(true);
        setErrorMsg('');

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error } = await supabase.storage
                .from('article-images')
                .upload(filePath, file);

            if (error) throw error;

            const { data: publicUrlData } = supabase.storage
                .from('article-images')
                .getPublicUrl(filePath);

            setArticleImage(publicUrlData.publicUrl);
            setSuccessMsg('Image uploaded successfully! 📸');
        } catch (err: any) {
            setErrorMsg('Image upload failed: ' + err.message);
        } finally {
            setUploadingImage(false);
        }
    };

    const addSection = () => {
        setSections([...sections, { title: '', points: [''] }]);
    };

    const updateSectionTitle = (index: number, value: string) => {
        const updated = [...sections];
        updated[index].title = value;
        setSections(updated);
    };

    const addPoint = (secIndex: number) => {
        const updated = [...sections];
        updated[secIndex].points.push('');
        setSections(updated);
    };

    const updatePoint = (secIndex: number, ptIndex: number, value: string) => {
        const updated = [...sections];
        updated[secIndex].points[ptIndex] = value;
        setSections(updated);
    };

    const removePoint = (secIndex: number, ptIndex: number) => {
        const updated = [...sections];
        updated[secIndex].points.splice(ptIndex, 1);
        setSections(updated);
    };

    const removeSection = (secIndex: number) => {
        const updated = [...sections];
        updated.splice(secIndex, 1);
        setSections(updated);
    };

    // Submit Handler (Supports both Create POST and Update PUT)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccessMsg('');
        setErrorMsg('');

        const payload = {
            title,
            category,
            read_time: readTime,
            date,
            excerpt,
            article_image: articleImage,
            full_content: {
                intro,
                sections
            }
        };

        try {
            const backendUrl = process.env.NEXT_PUBLIC_FASTAPI_URL || 'http://localhost:8000';

            let url = `${backendUrl}/articles/`;
            let method = 'POST';

            // If an article is selected, use PUT endpoint for updating
            if (selectedArticleId) {
                url = `${backendUrl}/articles/${selectedArticleId}`;
                method = 'PUT';
            }

            const res = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const result = await res.json();
            if (res.ok && result.success) {
                setSuccessMsg(selectedArticleId ? 'Article successfully updated! 🔄' : 'Article successfully published! 🎉');
                fetchArticlesList(); // Refresh list
                if (!selectedArticleId) {
                    clearForm();
                }
            } else {
                setErrorMsg(result.detail || 'Operation failed.');
            }
        } catch (err: any) {
            setErrorMsg('Network error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#FBFAF6] text-[#1A1A17] font-sans p-4 md:p-8 space-y-8 max-w-5xl mx-auto">

            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#E3DCC6] pb-4">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.back()}
                        className="bg-white p-2.5 rounded-xl border border-[#E3DCC6] hover:border-[#B68D40]/40 transition text-[#54503F] shadow-sm cursor-pointer"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="font-display text-xl font-bold text-[#163C2C] flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-[#2F6B4A]" />
                            <span>Admin Dashboard: Create or Update Article</span>
                        </h1>
                        <p className="text-xs text-[#8A836E] mt-1">Select an existing article to edit or create a new one</p>
                    </div>
                </div>
            </div>

            {/* Success / Error Banners */}
            {successMsg && (
                <div className="bg-[#2F6B4A]/10 border border-[#2F6B4A]/30 text-[#2F6B4A] p-4 rounded-2xl text-xs font-semibold">
                    {successMsg}
                </div>
            )}
            {errorMsg && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl text-xs font-semibold">
                    {errorMsg}
                </div>
            )}

            {/* Article Selector Dropdown for Update */}
            <div className="bg-white p-5 rounded-3xl border border-[#E3DCC6] shadow-sm space-y-2">
                <label className="text-xs font-bold text-[#163C2C] flex items-center gap-1.5">
                    <Edit3 className="w-4 h-4 text-[#2F6B4A]" /> Select Article to Update (or leave blank to create new)
                </label>
                <div className="flex gap-2">
                    <select
                        value={selectedArticleId}
                        onChange={handleSelectArticle}
                        className="flex-1 bg-[#FBFAF6] border border-[#E3DCC6] rounded-xl px-4 py-2.5 text-xs font-medium text-[#1A1A17] focus:outline-none focus:border-[#2F6B4A]"
                    >
                        <option value="">-- Create New Article --</option>
                        {articlesList.map((art) => (
                            <option key={art.id} value={art.id}>
                                {art.title} ({art.category})
                            </option>
                        ))}
                    </select>
                    {selectedArticleId && (
                        <button
                            type="button"
                            onClick={() => { setSelectedArticleId(''); clearForm(); }}
                            className="bg-[#F3EFE3] hover:bg-[#E3DCC6] text-[#54503F] px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
                        >
                            Reset to New
                        </button>
                    )}
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 md:p-8 rounded-3xl border border-[#E3DCC6] shadow-sm">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#163C2C]">Article Title</label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Blister Blight Management..."
                            className="w-full bg-[#FBFAF6] border border-[#E3DCC6] rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#2F6B4A]"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#163C2C]">Category</label>
                        <input
                            type="text"
                            required
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            placeholder="e.g. Plant Pathology & Disease"
                            className="w-full bg-[#FBFAF6] border border-[#E3DCC6] rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#2F6B4A]"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#163C2C]">Read Time</label>
                        <input
                            type="text"
                            required
                            value={readTime}
                            onChange={(e) => setReadTime(e.target.value)}
                            placeholder="e.g. 7 min read"
                            className="w-full bg-[#FBFAF6] border border-[#E3DCC6] rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#2F6B4A]"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#163C2C]">Date</label>
                        <input
                            type="text"
                            required
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            placeholder="e.g. Jul 30, 2026"
                            className="w-full bg-[#FBFAF6] border border-[#E3DCC6] rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#2F6B4A]"
                        />
                    </div>
                </div>

                {/* Image Upload Field */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-[#163C2C]">Upload Article Image from Computer</label>
                    <div className="flex items-center gap-4">
                        <label className="flex-1 border-2 border-dashed border-[#E3DCC6] hover:border-[#2F6B4A] bg-[#FBFAF6] rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition">
                            <Upload className="w-6 h-6 text-[#2F6B4A] mb-1" />
                            <span className="text-xs font-semibold text-[#54503F]">
                                {uploadingImage ? 'Uploading to Supabase...' : 'Click to browse image file'}
                            </span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                        </label>
                        {articleImage && (
                            <div className="w-24 h-24 rounded-2xl overflow-hidden border border-[#E3DCC6] relative shrink-0">
                                <img src={articleImage} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#163C2C]">Short Excerpt (Card Summary)</label>
                    <textarea
                        rows={2}
                        required
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                        placeholder="Brief overview of the article..."
                        className="w-full bg-[#FBFAF6] border border-[#E3DCC6] rounded-xl p-4 text-xs focus:outline-none focus:border-[#2F6B4A]"
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#163C2C]">Introduction Paragraph</label>
                    <textarea
                        rows={3}
                        required
                        value={intro}
                        onChange={(e) => setIntro(e.target.value)}
                        placeholder="Main introduction shown inside modal..."
                        className="w-full bg-[#FBFAF6] border border-[#E3DCC6] rounded-xl p-4 text-xs focus:outline-none focus:border-[#2F6B4A]"
                    />
                </div>

                {/* Dynamic Sections */}
                <div className="space-y-4 pt-4 border-t border-[#E3DCC6]">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-bold text-[#163C2C]">Article Sections & Bullet Points</h2>
                        <button
                            type="button"
                            onClick={addSection}
                            className="bg-[#2F6B4A]/10 hover:bg-[#2F6B4A] hover:text-white text-[#2F6B4A] px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                        >
                            <Plus className="w-4 h-4" /> Add Section
                        </button>
                    </div>

                    {sections.map((sec, secIdx) => (
                        <div key={secIdx} className="bg-[#FBFAF6] p-4 rounded-2xl border border-[#E3DCC6] space-y-3">
                            <div className="flex items-center gap-3">
                                <input
                                    type="text"
                                    placeholder={`Section ${secIdx + 1} Title`}
                                    value={sec.title}
                                    onChange={(e) => updateSectionTitle(secIdx, e.target.value)}
                                    className="flex-1 bg-white border border-[#E3DCC6] rounded-xl px-4 py-2 text-xs font-bold focus:outline-none focus:border-[#2F6B4A]"
                                />
                                {sections.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeSection(secIdx)}
                                        className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-xl transition cursor-pointer"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            <div className="space-y-2 pl-4">
                                <label className="text-[11px] font-semibold text-[#8A836E]">Bullet Points:</label>
                                {sec.points.map((pt, ptIdx) => (
                                    <div key={ptIdx} className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            placeholder="Point detail..."
                                            value={pt}
                                            onChange={(e) => updatePoint(secIdx, ptIdx, e.target.value)}
                                            className="flex-1 bg-white border border-[#E3DCC6] rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-[#2F6B4A]"
                                        />
                                        {sec.points.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removePoint(secIdx, ptIdx)}
                                                className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => addPoint(secIdx)}
                                    className="text-[11px] font-bold text-[#2F6B4A] hover:underline pt-1 cursor-pointer"
                                >
                                    + Add Point
                                </button>
                            </div>

                        </div>
                    ))}
                </div>

                {/* Submit / Update Button */}
                <div className="pt-4 border-t border-[#E3DCC6] flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-[#163C2C] hover:bg-[#1F4D36] text-[#F4EEDD] font-bold px-8 py-3 rounded-xl text-xs transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        {loading ? 'Processing...' : (selectedArticleId ? 'Update Article' : 'Publish Article')}
                    </button>
                </div>

            </form>

        </div>
    );
}