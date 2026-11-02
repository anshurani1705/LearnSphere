import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { EnrollmentItem, Certificate } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen,
  Award,
  CheckCircle,
  Clock,
  ArrowRight,
  Download,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Zap,
} from 'lucide-react';
import { downloadCertificatePdf } from '../utils/fileDownload';

export const StudentDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<EnrollmentItem[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingCertId, setDownloadingCertId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [enrRes, certRes] = await Promise.allSettled([
          api.get('/v1/student/enrollments'),
          api.get('/v1/student/certificates'),
        ]);

        if (enrRes.status === 'fulfilled' && enrRes.value.data?.success) {
          setEnrollments(enrRes.value.data.data || []);
        }
        if (certRes.status === 'fulfilled' && certRes.value.data?.success) {
          setCertificates(certRes.value.data.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch student dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const downloadCertificate = async (certificateId: string) => {
    setDownloadingCertId(certificateId);
    try {
      await downloadCertificatePdf(certificateId);
    } catch (err: any) {
      alert(err.message || 'Failed to download certificate PDF.');
    } finally {
      setDownloadingCertId(null);
    }
  };

  const completedCount = enrollments.filter((e) => e.status === 'COMPLETED').length;
  const inProgressCount = enrollments.length - completedCount;

  return (
    <div className="flex-1 bg-[#FAFAF8] py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header Banner */}
        <div className="bg-[#0F172A] rounded-xl p-6 sm:p-8 text-white mb-8 shadow-sm relative overflow-hidden border border-slate-800">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-xl bg-blue-700 text-white flex items-center justify-center font-bold text-xl shadow-sm">
                {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                    Welcome back, {user?.fullName}!
                  </h1>
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Active Student
                  </span>
                </div>
                <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
                  Track your learning modules, pass assessments, and manage verified professional credentials.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Link
                to="/courses"
                className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-lg shadow-sm transition"
              >
                <span>Browse New Courses</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-700 shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Enrollments</p>
              <div className="flex items-baseline space-x-2 mt-0.5">
                <p className="text-2xl font-bold text-slate-900">{enrollments.length}</p>
                <span className="text-xs text-slate-500 font-medium">({inProgressCount} in progress)</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-700 shrink-0">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Completed Tracks</p>
              <div className="flex items-baseline space-x-2 mt-0.5">
                <p className="text-2xl font-bold text-slate-900">{completedCount}</p>
                <span className="text-xs text-emerald-700 font-semibold">Passed</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center text-amber-700 shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Verified Credentials</p>
              <div className="flex items-baseline space-x-2 mt-0.5">
                <p className="text-2xl font-bold text-slate-900">{certificates.length}</p>
                <span className="text-xs text-amber-700 font-semibold">Earned</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enrolled Courses Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                My Enrolled Courses
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Pick up where you left off</p>
            </div>
            <Link
              to="/courses"
              className="text-xs font-semibold text-blue-700 hover:text-blue-800 flex items-center space-x-1"
            >
              <span>Explore More</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="h-44 bg-white border border-slate-200 rounded-xl p-5 animate-pulse"></div>
              ))}
            </div>
          ) : enrollments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {enrollments.map((item) => (
                <div
                  key={item.enrollmentId}
                  className="bg-white p-5 rounded-xl border border-slate-200 hover:border-slate-300 shadow-sm transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        {item.course.level}
                      </span>
                      {item.status === 'COMPLETED' ? (
                        <span className="text-xs font-semibold text-emerald-700 flex items-center space-x-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Complete & Certified</span>
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-blue-700 flex items-center space-x-1 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          <Zap className="w-3.5 h-3.5" />
                          <span>In Progress</span>
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-slate-900 text-base mb-1 line-clamp-1">
                      {item.course.title}
                    </h3>

                    {/* Progress Bar */}
                    <div className="space-y-1.5 my-3.5">
                      <div className="flex justify-between text-xs text-slate-500 font-semibold">
                        <span>Curriculum Progress</span>
                        <span className="text-blue-700">{item.progressPct}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${item.progressPct}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link
                      to={`/learn/${item.course.id}`}
                      className="inline-flex items-center space-x-2 text-xs font-semibold bg-[#0F172A] hover:bg-slate-800 text-white px-4 py-2.5 rounded-lg transition shadow-sm w-full justify-center group"
                    >
                      <span>Continue Classroom</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-10 text-center max-w-md mx-auto shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mx-auto mb-3">
                <BookOpen className="w-6 h-6" />
              </div>
              <p className="text-slate-900 font-bold text-base">You haven't enrolled in any courses yet</p>
              <p className="text-slate-500 text-xs mt-1 mb-4">
                Explore our industry-expert led programs to launch your learning journey.
              </p>
              <Link
                to="/courses"
                className="inline-block bg-[#0F172A] text-white font-semibold text-xs px-4 py-2.5 rounded-lg hover:bg-slate-800 transition"
              >
                Browse Catalog
              </Link>
            </div>
          )}
        </div>

        {/* Earned Certificates Section */}
        <div>
          <div className="mb-5">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Earned Certifications
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Tamper-proof verifiable PDF credentials</p>
          </div>

          {certificates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 bg-amber-400 text-slate-950 rounded-lg flex items-center justify-center mb-3 shadow-sm font-bold">
                      <Award className="w-5 h-5" />
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm mb-1 line-clamp-1">{cert.courseTitle}</h3>
                    <p className="text-xs text-slate-500 mb-2.5">Issued on {cert.issueDate}</p>

                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 mb-3 font-mono text-xs text-slate-600">
                      ID: <span className="font-semibold text-slate-900">{cert.certificateId}</span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => downloadCertificate(cert.certificateId)}
                      disabled={downloadingCertId === cert.certificateId}
                      className="w-full flex items-center justify-center space-x-2 bg-[#0F172A] hover:bg-slate-800 text-white font-semibold text-xs py-2 rounded-lg transition disabled:opacity-60"
                    >
                      {downloadingCertId === cert.certificateId ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Download className="w-3.5 h-3.5" />
                      )}
                      <span>{downloadingCertId === cert.certificateId ? 'Downloading...' : 'Download Official PDF'}</span>
                    </button>
                    <Link
                      to={`/verify-certificate/${cert.certificateId}`}
                      className="w-full flex items-center justify-center space-x-1 text-slate-600 hover:text-blue-700 font-semibold text-xs py-1 transition"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Public Verification Link</span>
                      <ExternalLink className="w-3 h-3 ml-0.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center max-w-md mx-auto shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto mb-3">
                <Award className="w-6 h-6" />
              </div>
              <p className="text-slate-900 font-bold text-sm">No certificates unlocked yet</p>
              <p className="text-slate-500 text-xs mt-1">
                Complete all mandatory lessons and score 70%+ on course assessments to automatically unlock your credential.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
