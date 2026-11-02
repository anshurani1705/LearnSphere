import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { CertificateVerifyResult } from '../types';
import { Search, CheckCircle, XCircle } from 'lucide-react';

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
    <div className="flex-1 bg-[#FAF8F5] dark:bg-[#14171A] py-16 lg:py-20 transition-colors duration-200">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif font-semibold text-3xl sm:text-4xl text-[#1F2328] dark:text-[#E6EDF3] tracking-tight">
            Verify a certificate
          </h1>
          <p className="text-sm sm:text-base text-[#5F6368] dark:text-[#8B949E] mt-2 leading-relaxed">
            Enter the unique certificate ID found on any SkillForge credential to confirm the learner name, course title, and issue date.
          </p>
        </div>

        {/* Verification Search Box */}
        <div className="bg-white dark:bg-[#1C2025] p-5 rounded-[8px] border border-[#E7E2DA] dark:border-[#2A3038] shadow-[0_1px_2px_rgba(0,0,0,0.05)] mb-8">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#5F6368] dark:text-[#8B949E] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Certificate ID (e.g. SKL-CERT-2026-9042)..."
                value={inputCertId}
                onChange={(e) => setInputCertId(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-[#FAF8F5] dark:bg-[#14171A] border border-[#E7E2DA] dark:border-[#2A3038] rounded-[6px] text-[#1F2328] dark:text-[#E6EDF3] placeholder-[#8B949E] font-mono focus-ring"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !inputCertId.trim()}
              className="bg-[#0E6B6B] hover:bg-[#0A5555] dark:bg-[#149B9B] dark:hover:bg-[#118585] text-white text-xs font-medium px-4 py-2.5 rounded-[6px] transition disabled:opacity-50 focus-ring"
            >
              {loading ? 'Verifying...' : 'Verify'}
            </button>
          </form>
        </div>

        {/* Verification Result */}
        {hasSearched && (
          <div>
            {result?.valid ? (
              <div className="bg-white dark:bg-[#1C2025] rounded-[8px] border border-[#E7E2DA] dark:border-[#2A3038] p-6 space-y-5 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                <div className="flex items-center space-x-2.5 text-[#2F855A] pb-3 border-b border-[#E7E2DA] dark:border-[#2A3038]">
                  <CheckCircle className="w-5 h-5 shrink-0" />
                  <div>
                    <h2 className="font-serif font-semibold text-base text-[#1F2328] dark:text-[#E6EDF3]">Valid certificate</h2>
                    <p className="text-xs text-[#2F855A]">
                      Officially issued and recorded on SkillForge
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-[#5F6368] dark:text-[#8B949E]">Recipient</p>
                    <p className="font-medium text-[#1F2328] dark:text-[#E6EDF3] mt-0.5">{result.studentName}</p>
                  </div>

                  <div>
                    <p className="text-xs text-[#5F6368] dark:text-[#8B949E]">Certificate ID</p>
                    <p className="font-mono text-xs text-[#0E6B6B] dark:text-[#149B9B] mt-0.5">{result.certificateId}</p>
                  </div>

                  <div className="sm:col-span-2">
                    <p className="text-xs text-[#5F6368] dark:text-[#8B949E]">Course completed</p>
                    <p className="font-medium text-[#1F2328] dark:text-[#E6EDF3] mt-0.5">{result.courseTitle}</p>
                  </div>

                  <div>
                    <p className="text-xs text-[#5F6368] dark:text-[#8B949E]">Issue date</p>
                    <p className="text-sm text-[#1F2328] dark:text-[#E6EDF3] mt-0.5">{result.issueDate}</p>
                  </div>

                  <div>
                    <p className="text-xs text-[#5F6368] dark:text-[#8B949E]">Issuer</p>
                    <p className="text-sm text-[#1F2328] dark:text-[#E6EDF3] mt-0.5">{result.issuer || 'SkillForge Academy'}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-[#1C2025] rounded-[8px] border border-[#E7E2DA] dark:border-[#2A3038] p-6 text-center space-y-2 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                <XCircle className="w-8 h-8 text-[#C0392B] dark:text-[#E53E3E] mx-auto mb-1" />
                <h2 className="font-serif font-semibold text-base text-[#1F2328] dark:text-[#E6EDF3]">Certificate not found</h2>
                <p className="text-xs text-[#5F6368] dark:text-[#8B949E] max-w-sm mx-auto">
                  No record was found matching <span className="font-mono font-medium">{result?.certificateId}</span>. Please verify the ID for typographical errors.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
