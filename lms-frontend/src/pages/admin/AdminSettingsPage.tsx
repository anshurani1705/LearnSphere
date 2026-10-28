import React, { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { AdminNav } from '../../components/AdminNav';
import { Settings, Shield, Server, CreditCard, Mail, CheckCircle2 } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/v1/public/settings');
        if (res.data?.success) {
          setSettings(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load settings', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  return (
    <div className="flex-1 bg-slate-50 min-h-screen pb-16">
      <AdminNav />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">System & Platform Settings</h1>
          <p className="text-slate-500 text-sm mt-1">
            Company LMS configurations, gateway mode statuses, and environmental runtime parameters.
          </p>
        </div>

        {/* Company Organization Branding */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-3">
            <Settings className="w-5 h-5 text-indigo-600" />
            <span>Company Organization Profile</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase">Organization Name</span>
              <p className="font-semibold text-slate-800 mt-0.5">{settings.siteName || 'SkillForge Academy'}</p>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-400 uppercase">Tagline</span>
              <p className="text-slate-800 mt-0.5">{settings.tagline || 'Master New Skills, Transform Your Career'}</p>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-400 uppercase">Contact Email</span>
              <p className="text-slate-800 mt-0.5">{settings.contactEmail || 'hello@skillforge.com'}</p>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-400 uppercase">Base Currency</span>
              <p className="font-bold font-mono text-slate-800 mt-0.5">INR (₹ Indian Rupee)</p>
            </div>

            <div className="md:col-span-2">
              <span className="text-xs font-bold text-slate-400 uppercase">Physical Address</span>
              <p className="text-slate-800 mt-0.5">{settings.contactAddress || 'Koramangala, Bangalore, Karnataka 560034'}</p>
            </div>
          </div>
        </div>

        {/* Gateway & Cloud Adapters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-3">
              <CreditCard className="w-5 h-5 text-emerald-600" />
              <span>Payment Gateway Engine</span>
            </h2>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500 font-semibold">Active Provider:</span>
                <span className="font-bold text-slate-900 font-mono">RAZORPAY</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500 font-semibold">Dev Mock Simulation:</span>
                <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">ENABLED (Local)</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500 font-semibold">Signature Validation:</span>
                <span className="text-slate-800 font-mono">HMAC-SHA256 (Server Authoritative)</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-3">
              <Server className="w-5 h-5 text-blue-600" />
              <span>File Storage Adapter</span>
            </h2>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500 font-semibold">Storage Provider:</span>
                <span className="font-bold text-slate-900 font-mono">AWS S3 / Local Secure Fallback</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500 font-semibold">Local Storage Directory:</span>
                <span className="text-slate-700 font-mono">data/uploads/</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500 font-semibold">Video Streaming Protection:</span>
                <span className="bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full">ENROLLED STUDENT ONLY</span>
              </div>
            </div>
          </div>
        </div>

        {/* Security & Access Principles */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-3">
            <Shield className="w-5 h-5 text-purple-600" />
            <span>Company LMS Ownership & Role Enforcement</span>
          </h2>
          <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
            <p className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span><strong>Company-Owned Curriculum:</strong> Only authorized administrators have access to create, publish, and price courses.</span>
            </p>
            <p className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span><strong>No Marketplace Overhead:</strong> Tutor storefronts, commission calculations, and independent teacher approval workflows are disabled.</span>
            </p>
            <p className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span><strong>Strict Role Validation:</strong> Administrator access is verified on every backend request via Spring Security JWT authorization.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
