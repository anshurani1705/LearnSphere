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
  Sparkles,
  Zap,
  TrendingUp,
  GraduationCap,
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
        const [enrRes, certRes] = await Promise.all([
          api.get('/v1/student/enrollments'),
          api.get('/v1/student/certificates'),
        ]);

        if (enrRes.data?.success) {
          setEnrollments(enrRes.data.data);
        }
        if (certRes.data?.success) {
          setCertificates(certRes.data.data);
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
    <div className="flex-1 bg-slate-50/70 py-10 lg:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white mb-10 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-500 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-indigo-500/30">
                {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                    Welcome back, {user?.fullName}!
                  </h1>
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
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
                className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-md shadow-indigo-600/30 hover:-translate-y-0.5 transition"
              >
                <span>Browse New Courses</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition flex items-center space-x-4">
            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0">
              <BookOpen className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Enrollments</p>
              <div className="flex items-baseline space-x-2 mt-0.5">
                <p className="text-2xl font-black text-slate-900">{enrollments.length}</p>
                <span className="text-xs text-slate-500 font-medium">({inProgressCount} in progress)</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition flex items-center space-x-4">
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0">
              <CheckCircle className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completed Tracks</p>
              <div className="flex items-baseline space-x-2 mt-0.5">
                <p className="text-2xl font-black text-slate-900">{completedCount}</p>
                <span className="text-xs text-emerald-600 font-bold">Passed</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition flex items-center space-x-4">
            <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 shrink-0">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Verified Credentials</p>
              <div className="flex items-baseline space-x-2 mt-0.5">
                <p className="text-2xl font-black text-slate-900">{certificates.length}</p>
                <span className="text-xs text-amber-600 font-bold">Earned</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enrolled Courses Section */}
        <div className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                My Enrolled Courses
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Pick up where you left off</p>
            </div>
            <Link
              to="/courses"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center space-x-1"
            >
              <span>Explore More</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="h-48 bg-white border border-slate-200 rounded-2xl p-6 animate-pulse"></div>
              ))}
            </div>
          ) : enrollments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {enrollments.map((item) => (
                <div
                  key={item.enrollmentId}
                  className="bg-white p-6 rounded-2xl border border-slate-200/90 hover:border-indigo-200 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                        {item.course.level}
                      </span>
                      {item.status === 'COMPLETED' ? (
                        <span className="text-xs font-bold text-emerald-600 flex items-center space-x-1 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Complete & Certified</span>
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-indigo-600 flex items-center space-x-1 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                          <Zap className="w-3.5 h-3.5" />
                          <span>In Progress</span>
                        </span>
                      )}
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-lg mb-2 line-clamp-1">
                      {item.course.title}
                    </h3>

                    {/* Progress Bar */}
                    <div className="space-y-1.5 my-4">
                      <div className="flex justify-between text-xs text-slate-500 font-bold">
                        <span>Curriculum Progress</span>
                        <span className="text-indigo-600">{item.progressPct}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${item.progressPct}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link
                      to={`/learn/${item.course.id}`}
                      className="inline-flex items-center space-x-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-xl transition shadow-md shadow-indigo-600/20 w-full justify-center group"
                    >
                      <span>Continue Classroom</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-7 h-7" />
              </div>
              <p className="text-slate-900 font-extrabold text-base">You haven't enrolled in any courses yet</p>
              <p className="text-slate-500 text-xs mt-1 mb-5">
                Explore our industry-expert led programs to launch your learning journey.
              </p>
              <Link
                to="/courses"
                className="inline-block bg-indigo-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition"
              >
                Browse Catalog
              </Link>
            </div>
          )}
        </div>

        {/* Earned Certificates Section */}
        <div>
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Earned Certifications
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Tamper-proof verifiable PDF credentials</p>
          </div>

          {certificates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="bg-white p-6 rounded-2xl border border-indigo-100/90 shadow-sm hover:shadow-xl transition-all relative overflow-hidden flex flex-col justify-between"
                >
                  <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-amber-200/30 to-amber-400/20 rounded-bl-full -mr-8 -mt-8 pointer-events-none"></div>

                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 rounded-2xl flex items-center justify-center mb-4 shadow-md">
                      <Award className="w-6 h-6" />
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-base mb-1 line-clamp-1">{cert.courseTitle}</h3>
                    <p className="text-xs text-slate-500 mb-3">Issued on {cert.issueDate}</p>

                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 mb-4 font-mono text-xs text-slate-600">
                      ID: <span className="font-bold text-indigo-700">{cert.certificateId}</span>
                    </div>
                  </div>

                  <div className="relative z-10 space-y-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => downloadCertificate(cert.certificateId)}
                      disabled={downloadingCertId === cert.certificateId}
                      className="w-full flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 rounded-xl transition shadow-md shadow-indigo-600/20 disabled:opacity-60"
                    >
                      {downloadingCertId === cert.certificateId ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                      <span>{downloadingCertId === cert.certificateId ? 'Downloading...' : 'Download Official PDF'}</span>
                    </button>
                    <Link
                      to={`/verify-certificate/${cert.certificateId}`}
                      className="w-full flex items-center justify-center space-x-1 text-slate-600 hover:text-indigo-600 font-bold text-xs py-1.5 transition"
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
            <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center max-w-md mx-auto shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
                <Award className="w-7 h-7" />
              </div>
              <p className="text-slate-900 font-bold text-base">No certificates unlocked yet</p>
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
