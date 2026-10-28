import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { CertificateVerifyResult } from '../types';
import { ShieldCheck, Search, CheckCircle, XCircle, Award, Calendar, User, BookOpen } from 'lucide-react';

export const CertificateVerificationPage: React.FC = () => {
  const { certificateId: paramCertId } = useParams<{ certificateId?: string }>();
  const navigate = useNavigate();

  const [inputCertId, setInputCertId] = useState(paramCertId || '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CertificateVerifyResult | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const performVerification = async (certIdToVerify: string) => {
    if (!certIdToVerify.trim()) return;
    setLoading(true);
    setHasSearched(true);
    try {
      const res = await api.get(`/v1/certificates/verify/${certIdToVerify.trim()}`);
      if (res.data?.success) {
        setResult(res.data.data);
      }
    } catch {
      setResult({ valid: false, certificateId: certIdToVerify.trim() });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (paramCertId) {
      setInputCertId(paramCertId);
      performVerification(paramCertId);
    }
  }, [paramCertId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCertId.trim()) {
      navigate(`/verify-certificate/${inputCertId.trim()}`, { replace: true });
      performVerification(inputCertId.trim());
    }
  };

  return (
    <div className="flex-1 bg-slate-50 py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full text-emerald-700 text-xs font-bold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Official Credential Registry</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Verify Certificate Authenticity
          </h1>
          <p className="text-slate-600 text-sm mt-2 max-w-xl mx-auto">
            SkillForge credentials are tamper-proof and verifiable by employers, university recruiters, and academic institutions worldwide.
          </p>
        </div>

        {/* Verification Search Box */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-10">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Enter unique Certificate ID (e.g. SF-20261012-ABC123)..."
                value={inputCertId}
                onChange={(e) => setInputCertId(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-slate-900"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !inputCertId.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-6 py-3 rounded-xl transition shadow disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify Now'}
            </button>
          </form>
        </div>

        {/* Verification Result */}
        {hasSearched && (
          <div>
            {result?.valid ? (
              <div className="bg-white rounded-2xl border-2 border-emerald-500 shadow-lg p-8 space-y-6">
                <div className="flex items-center space-x-3 text-emerald-600 pb-4 border-b border-slate-100">
                  <CheckCircle className="w-8 h-8 text-emerald-500 shrink-0" />
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900">Valid & Verified Certificate</h2>
                    <p className="text-xs text-emerald-700 font-semibold">
                      This credential was officially issued by SkillForge Academy
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                      <User className="w-3.5 h-3.5" />
                      <span>Recipient Name</span>
                    </p>
                    <p className="text-lg font-bold text-slate-900">{result.studentName}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                      <Award className="w-3.5 h-3.5" />
                      <span>Certificate Identifier</span>
                    </p>
                    <p className="text-sm font-mono font-bold text-indigo-600">{result.certificateId}</p>
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Course Title</span>
                    </p>
                    <p className="text-base font-bold text-slate-900">{result.courseTitle}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Issue Date</span>
                    </p>
                    <p className="text-sm font-semibold text-slate-800">{result.issueDate}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Issuing Body</span>
                    </p>
                    <p className="text-sm font-semibold text-slate-800">{result.issuer}</p>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-500 leading-relaxed">
                  Notice: In accordance with our privacy policy, private student contact details and internal grades are omitted from public registry verification records.
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border-2 border-rose-300 shadow p-8 text-center space-y-4">
                <XCircle className="w-12 h-12 text-rose-500 mx-auto" />
                <h2 className="text-xl font-bold text-slate-900">Certificate Not Found</h2>
                <p className="text-slate-600 text-sm max-w-md mx-auto">
                  No record was found matching Certificate ID <span className="font-mono font-bold">{result?.certificateId}</span>. Please verify the ID for typographical errors or contact our academic registrar.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
