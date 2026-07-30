// app/profile/page.tsx
'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Leaf, User, Phone, MapPin, CreditCard, ArrowRight, ShieldCheck, Mail, Lock } from 'lucide-react';

function ProfileFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const points = searchParams.get('points') || '[]';
  const acres = searchParams.get('acres') || '0';
  const perches = searchParams.get('perches') || '0';

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '', // 👈 Password added
    contactNumber: '',
    address: '',
    nic: '',
    landName: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    const parsedPoints = JSON.parse(points);

    // Save profile info locally for state session
    const userLandProfile = {
      ...formData,
      points: parsedPoints,
      acres,
      perches,
      registeredAt: new Date().toLocaleDateString(),
    };
    localStorage.setItem('userLandProfile', JSON.stringify(userLandProfile));

    try {
      const fastApiUrl = process.env.NEXT_PUBLIC_FASTAPI_URL || 'http://localhost:8000';
      
      const response = await fetch(`${fastApiUrl}/api/v1/users/register-land`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          password: formData.password, // 👈 Sending password to backend
          contact_number: formData.contactNumber,
          address: formData.address,
          nic: formData.nic,
          land_name: formData.landName || `${formData.firstName}'s Tea Estate`,
          acres: parseFloat(acres),
          perches: parseFloat(perches),
          boundary_points: parsedPoints,
        }),
      });

      const result = await response.json();

      if (response.ok && result.status === 'success') {
        router.push('/my-land');
      } else {
        setErrorMessage(result.detail || 'Failed to save data to Supabase database.');
      }
    } catch (err: any) {
      console.error('API Request Error:', err);
      router.push('/my-land');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 md:p-8 flex items-center justify-center">
      <div className="max-w-xl w-full bg-slate-900/90 border border-slate-800 p-8 rounded-3xl shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2 border-b border-slate-800 pb-5">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-xs text-emerald-400 font-semibold">
            <ShieldCheck className="w-4 h-4" /> Final Step: Account Owner Details
          </div>
          <h1 className="text-2xl font-bold text-white">Register Land Ownership</h1>
          <p className="text-xs text-slate-400">
            Selected Land: <strong className="text-emerald-400">{acres} Acres ({perches} Perches)</strong>
          </p>
        </div>

        {errorMessage && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-xs text-center">
            {errorMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">First Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Last Name</label>
              <input
                type="text"
                required
                placeholder="Doe"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* 🔐 Password Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Estate / Land Name</label>
            <div className="relative">
              <Leaf className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Highland Valley Tea Estate"
                value={formData.landName}
                onChange={(e) => setFormData({ ...formData, landName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Contact Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  placeholder="077 123 4567"
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">NIC Number</label>
              <div className="relative">
                <CreditCard className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="199812345678"
                  value={formData.nic}
                  onChange={(e) => setFormData({ ...formData, nic: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Address</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="No. 45, Main Street, Kalawana"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-500/20 mt-4 disabled:opacity-50"
          >
            {loading ? 'Registering with Python Backend...' : 'Complete Profile & View My Land'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-500 text-sm">Loading Profile...</div>}>
      <ProfileFormContent />
    </Suspense>
  );
}