import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../api/client';
import { CertificateVerifyResult } from '../types';
import { ShieldCheck, Search, CheckCircle, XCircle, Award, Calendar, User, BookOpen, Loader2 } from 'lucide-react';
import { Badge } from '../components/ui/Badge';

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
    <div className="flex-1 bg-[#FAFAF8] py-12 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge variant="teal" size="sm" className="mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Public Credential Registry</span>
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#20252B] tracking-tight">
            Verify Certificate Authenticity
          </h1>
          <p className="text-xs sm:text-sm text-[#697386] mt-1.5 max-w-xl mx-auto leading-relaxed">
            Enter any SkillForge Certificate Identifier below to instantly verify the recipient, course completion, and issue date against our cryptographic records.
          </p>
        </div>

        {/* Verification Search Box */}
        <div className="bg-white p-5 sm:p-6 rounded-lg border border-[#E5E7EB] shadow-card mb-8">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Enter Certificate ID (e.g. SF-CERT-...)"
                value={inputCertId}
                onChange={(e) => setInputCertId(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#172B4D] focus:bg-white font-mono text-[#20252B]"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !inputCertId.trim()}
              className="bg-[#172B4D] hover:bg-[#0F1E36] text-white font-medium text-xs sm:text-sm px-5 py-2 rounded-md transition-colors disabled:opacity-50 flex items-center justify-center space-x-1.5"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <span>Verify Credential</span>
              )}
            </button>
          </form>
        </div>

        {/* Verification Result Card */}
        {hasSearched && (
          <div>
            {result?.valid ? (
              <div className="bg-white rounded-lg border border-emerald-500/80 shadow-card p-6 sm:p-8 space-y-6">
                <div className="flex items-center space-x-3 text-emerald-700 pb-4 border-b border-[#E5E7EB]">
                  <CheckCircle className="w-7 h-7 text-emerald-600 shrink-0" />
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-[#20252B]">Officially Verified Credential</h2>
                    <p className="text-xs text-emerald-700 font-medium">
                      This certificate record matches our authentic registry database.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs sm:text-sm">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-[#697386] uppercase tracking-wider flex items-center space-x-1.5">
                      <User className="w-3.5 h-3.5" />
                      <span>Student Recipient</span>
                    </p>
                    <p className="text-base font-bold text-[#20252B]">{result.studentName}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-[#697386] uppercase tracking-wider flex items-center space-x-1.5">
                      <Award className="w-3.5 h-3.5" />
                      <span>Certificate Identifier</span>
                    </p>
                    <p className="text-xs sm:text-sm font-mono font-bold text-[#172B4D]">{result.certificateId}</p>
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <p className="text-xs font-semibold text-[#697386] uppercase tracking-wider flex items-center space-x-1.5">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Accredited Program</span>
                    </p>
                    <p className="text-sm sm:text-base font-semibold text-[#20252B]">{result.courseTitle}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-[#697386] uppercase tracking-wider flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Date of Conferment</span>
                    </p>
                    <p className="text-xs sm:text-sm text-[#20252B]">{result.issueDate}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-[#697386] uppercase tracking-wider flex items-center space-x-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Issuing Body</span>
                    </p>
                    <p className="text-xs sm:text-sm text-[#20252B]">{result.issuer || 'SkillForge Enterprise LMS'}</p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-md border border-[#E5E7EB] text-[11px] text-[#697386] leading-relaxed">
                  Notice: In compliance with privacy standards, candidate grades and confidential personal contact details are excluded from public verification records.
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-rose-300 p-8 text-center space-y-3 shadow-subtle">
                <XCircle className="w-10 h-10 text-rose-500 mx-auto" />
                <h2 className="text-base font-bold text-[#20252B]">Credential Record Not Found</h2>
                <p className="text-xs sm:text-sm text-[#697386] max-w-md mx-auto leading-relaxed">
                  No matching record was found for ID <span className="font-mono font-semibold text-[#20252B]">{result?.certificateId}</span>. Please verify the code or contact the credential holder.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
