import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { EnrollmentItem, Certificate } from '../types';
import { useAuth } from '../context/AuthContext';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import {
  BookOpen,
  Award,
  CheckCircle,
  ArrowRight,
  Download,
  ExternalLink,
  ShieldCheck,
  Loader2,
  Clock,
  PlayCircle,
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
  const inProgressList = enrollments.filter((e) => e.status !== 'COMPLETED');

  return (
    <div className="flex-1 bg-[#FAFAF8] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Workspace Header */}
        <div className="bg-white rounded-lg border border-[#E5E7EB] p-6 sm:p-8 shadow-card mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-lg bg-[#172B4D] text-white flex items-center justify-center font-bold text-xl shrink-0">
                {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <div className="flex items-center space-x-2.5">
                  <h1 className="text-xl sm:text-2xl font-bold text-[#20252B] tracking-tight">
                    {user?.fullName ? `Welcome back, ${user.fullName}` : 'Student Workspace'}
                  </h1>
                  <Badge variant="teal" size="sm">
                    Student
                  </Badge>
                </div>
                <p className="text-xs sm:text-sm text-[#697386] mt-1">
                  {user?.email} &bull; Manage your ongoing courses, track assessment results, and access credentials.
                </p>
              </div>
            </div>

            <Link
              to="/courses"
              className="inline-flex items-center justify-center space-x-2 bg-[#172B4D] hover:bg-[#0F1E36] text-white text-xs sm:text-sm font-medium px-4 py-2.5 rounded-lg shadow-sm transition-colors shrink-0"
            >
              <span>Explore Courses</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Metrics summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-[#E5E7EB]">
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-md bg-slate-100 text-[#172B4D] flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-[#697386] font-medium">Enrolled Courses</p>
                <p className="text-lg font-bold text-[#20252B]">{enrollments.length}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-md bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-[#697386] font-medium">Completed Courses</p>
                <p className="text-lg font-bold text-[#20252B]">{completedCount}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-md bg-teal-50 text-[#287C78] flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-[#697386] font-medium">Verifiable Certificates</p>
                <p className="text-lg font-bold text-[#20252B]">{certificates.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Learning / Enrolled Courses Section */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#20252B] tracking-tight">
                My Learning Courses
              </h2>
              <p className="text-xs text-[#697386] mt-0.5">Resume your progress or start a new lesson</p>
            </div>
            {enrollments.length > 0 && (
              <Link
                to="/courses"
                className="text-xs font-medium text-[#172B4D] hover:underline"
              >
                Browse Catalog &rarr;
              </Link>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[1, 2].map((i) => (
                <div key={i} className="h-44 bg-white border border-[#E5E7EB] rounded-lg p-5 animate-pulse" />
              ))}
            </div>
          ) : enrollments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {enrollments.map((item) => (
                <div
                  key={item.enrollmentId}
                  className="bg-white p-5 sm:p-6 rounded-lg border border-[#E5E7EB] shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <Badge variant="neutral" size="sm">
                        {item.course.level}
                      </Badge>
                      {item.status === 'COMPLETED' ? (
                        <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Completed</span>
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-[#287C78] bg-teal-50 px-2 py-0.5 rounded border border-[#287C78]/20">
                          In Progress
                        </span>
                      )}
                    </div>

                    <h3 className="font-semibold text-base text-[#20252B] mb-2 line-clamp-1">
                      {item.course.title}
                    </h3>

                    {/* Progress Bar */}
                    <div className="space-y-1.5 my-3.5">
                      <div className="flex justify-between text-xs text-[#697386]">
                        <span>Curriculum Progress</span>
                        <span className="font-medium text-[#20252B]">{item.progressPct}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#287C78] h-full rounded-full transition-all duration-300"
                          style={{ width: `${item.progressPct}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#E5E7EB] mt-auto">
                    <Link
                      to={`/learn/${item.course.id}`}
                      className="inline-flex items-center justify-center space-x-2 text-xs sm:text-sm font-medium bg-[#172B4D] hover:bg-[#0F1E36] text-white px-4 py-2 rounded-lg transition-colors w-full"
                    >
                      <PlayCircle className="w-4 h-4" />
                      <span>{item.status === 'COMPLETED' ? 'Review Classroom' : 'Resume Learning'}</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<BookOpen className="w-6 h-6" />}
              title="You haven't enrolled in any courses yet"
              description="Explore our industry-focused technical courses and bootcamps to get started on your learning journey."
              actionLabel="Explore Course Catalog"
              actionHref="/courses"
            />
          )}
        </div>

        {/* Earned Certificates Section */}
        <div>
          <div className="mb-5">
            <h2 className="text-lg sm:text-xl font-bold text-[#20252B] tracking-tight">
              Earned Certificates
            </h2>
            <p className="text-xs text-[#697386] mt-0.5">Tamper-proof verifiable PDF credentials</p>
          </div>

          {certificates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="bg-white p-5 sm:p-6 rounded-lg border border-[#E5E7EB] shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-md bg-teal-50 text-[#287C78] flex items-center justify-center mb-3.5 border border-[#287C78]/20">
                      <Award className="w-5 h-5" />
                    </div>

                    <h3 className="font-semibold text-base text-[#20252B] mb-1 line-clamp-1">
                      {cert.courseTitle}
                    </h3>
                    <p className="text-xs text-[#697386] mb-3">Issued on {cert.issueDate}</p>

                    <div className="bg-slate-50 p-2 rounded-md border border-[#E5E7EB] mb-4 font-mono text-xs text-[#20252B]">
                      Credential ID: <span className="font-semibold text-[#172B4D]">{cert.certificateId}</span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-[#E5E7EB]">
                    <button
                      onClick={() => downloadCertificate(cert.certificateId)}
                      disabled={downloadingCertId === cert.certificateId}
                      className="w-full flex items-center justify-center space-x-2 bg-[#172B4D] hover:bg-[#0F1E36] text-white font-medium text-xs py-2 rounded-md transition-colors disabled:opacity-60 shadow-sm"
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
                      className="w-full flex items-center justify-center space-x-1.5 text-xs text-[#287C78] hover:text-[#1A5250] font-medium py-1.5 transition-colors"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Public Verification Link</span>
                      <ExternalLink className="w-3 h-3 ml-0.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-[#E5E7EB] p-8 text-center max-w-md mx-auto shadow-subtle">
              <Award className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-[#20252B] font-semibold text-sm">No certificates earned yet</p>
              <p className="text-[#697386] text-xs mt-1 leading-relaxed">
                Complete all required lessons in an enrolled course and pass the final assessment with a score above 70% to generate your verifiable certificate.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
