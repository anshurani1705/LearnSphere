import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { EnrollmentItem, Certificate } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  Download,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import { downloadCertificatePdf } from '../utils/fileDownload';
import { getCourseThumbnail } from '../components/CourseCard';

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
    <div className="flex-1 bg-[#FAF8F5] py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Editorial Greeting Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-6 border-b border-[#E7E2DA]">
          <div>
            <h1 className="font-serif font-semibold text-3xl text-[#1F2328] tracking-tight">
              Pick up where you left off
            </h1>
            <p className="text-sm text-[#5F6368] mt-1">
              Welcome back, {user?.fullName || 'student'}. Track your progress and finish your next lesson.
            </p>
          </div>

          <Link
            to="/courses"
            className="text-xs font-medium text-[#0E6B6B] hover:underline"
          >
            Explore all courses &rarr;
          </Link>
        </div>

        {/* 1. Continue Learning Section (FIRST) */}
        <div>
          <div className="mb-4">
            <h2 className="font-serif font-semibold text-xl text-[#1F2328]">
              In-progress courses
            </h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="h-40 bg-white border border-[#E7E2DA] rounded-[8px] p-5 animate-pulse"></div>
              ))}
            </div>
          ) : enrollments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {enrollments.map((item) => (
                <div
                  key={item.enrollmentId}
                  className="bg-white p-5 rounded-[8px] border border-[#E7E2DA] shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:border-[#D1C9BE] transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start space-x-3.5 mb-3">
                      <div className="w-20 h-14 rounded-[6px] bg-[#FAF8F5] overflow-hidden shrink-0 border border-[#E7E2DA]">
                        <img
                          src={getCourseThumbnail(item.course)}
                          alt={item.course.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80';
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 text-xs text-[#5F6368] mb-1">
                          <span>{item.course.level}</span>
                          <span>&bull;</span>
                          <span>{item.status === 'COMPLETED' ? 'Completed' : 'In progress'}</span>
                        </div>
                        <h3 className="font-serif font-semibold text-base text-[#1F2328] line-clamp-1">
                          {item.course.title}
                        </h3>
                      </div>
                    </div>

                    {/* Primary Progress Bar */}
                    <div className="space-y-1.5 my-3">
                      <div className="flex justify-between text-xs text-[#5F6368]">
                        <span>Curriculum progress</span>
                        <span className="font-medium text-[#1F2328]">{item.progressPct}%</span>
                      </div>
                      <div className="w-full bg-[#FAF8F5] h-2 rounded-full overflow-hidden border border-[#E7E2DA]">
                        <div
                          className="bg-[#0E6B6B] h-full rounded-full transition-all duration-300"
                          style={{ width: `${item.progressPct}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link
                      to={`/learn/${item.course.id}`}
                      className="inline-flex items-center justify-center text-xs font-medium bg-[#0E6B6B] hover:bg-[#0A5555] text-white px-4 py-2 rounded-[6px] transition-colors w-full"
                    >
                      <span>Continue lesson</span>
                      <span className="ml-1" aria-hidden="true">&rarr;</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-[8px] border border-[#E7E2DA] p-10 text-center max-w-md mx-auto shadow-sm">
              <h3 className="font-serif font-semibold text-base text-[#1F2328] mb-1">
                You haven't enrolled in any courses yet
              </h3>
              <p className="text-xs text-[#5F6368] mb-4">
                Explore our project-based curriculum to get started.
              </p>
              <Link
                to="/courses"
                className="inline-block bg-[#0E6B6B] text-white font-medium text-xs px-4 py-2 rounded-[6px] hover:bg-[#0A5555] transition"
              >
                Browse catalog
              </Link>
            </div>
          )}
        </div>

        {/* 2. Simple Stats Row */}
        <div>
          <div className="mb-4">
            <h2 className="font-serif font-semibold text-xl text-[#1F2328]">
              Learning overview
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-[8px] border border-[#E7E2DA] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
              <p className="text-xs text-[#5F6368]">Active enrollments</p>
              <p className="font-serif font-semibold text-2xl text-[#1F2328] mt-1">{enrollments.length}</p>
              <p className="text-[11px] text-[#5F6368] mt-0.5">{inProgressCount} in progress</p>
            </div>

            <div className="bg-white p-5 rounded-[8px] border border-[#E7E2DA] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
              <p className="text-xs text-[#5F6368]">Completed tracks</p>
              <p className="font-serif font-semibold text-2xl text-[#1F2328] mt-1">{completedCount}</p>
              <p className="text-[11px] text-[#2F855A] mt-0.5">Assessed & certified</p>
            </div>

            <div className="bg-white p-5 rounded-[8px] border border-[#E7E2DA] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
              <p className="text-xs text-[#5F6368]">Verified credentials</p>
              <p className="font-serif font-semibold text-2xl text-[#1F2328] mt-1">{certificates.length}</p>
              <p className="text-[11px] text-[#0E6B6B] mt-0.5">Shareable on LinkedIn</p>
            </div>
          </div>
        </div>

        {/* 3. Earned Certificates Section */}
        <div>
          <div className="mb-4">
            <h2 className="font-serif font-semibold text-xl text-[#1F2328]">
              Earned certificates
            </h2>
            <p className="text-xs text-[#5F6368]">Accredited PDF credentials with public verification</p>
          </div>

          {certificates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="bg-white p-5 rounded-[8px] border border-[#E7E2DA] shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:border-[#D1C9BE] transition-all flex flex-col justify-between"
                >
                  <div>
                    <h3 className="font-serif font-semibold text-[#1F2328] text-base mb-1 line-clamp-1">{cert.courseTitle}</h3>
                    <p className="text-xs text-[#5F6368] mb-3">Issued on {cert.issueDate}</p>

                    <div className="bg-[#FAF8F5] p-2.5 rounded-[6px] border border-[#E7E2DA] mb-3 font-mono text-xs text-[#5F6368]">
                      ID: <span className="font-medium text-[#1F2328]">{cert.certificateId}</span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-[#E7E2DA]">
                    <button
                      onClick={() => downloadCertificate(cert.certificateId)}
                      disabled={downloadingCertId === cert.certificateId}
                      className="w-full flex items-center justify-center space-x-1.5 bg-[#0E6B6B] hover:bg-[#0A5555] text-white text-xs font-medium py-2 rounded-[6px] transition disabled:opacity-60"
                    >
                      {downloadingCertId === cert.certificateId ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Download className="w-3.5 h-3.5" />
                      )}
                      <span>{downloadingCertId === cert.certificateId ? 'Downloading...' : 'Download PDF certificate'}</span>
                    </button>
                    <Link
                      to={`/verify-certificate/${cert.certificateId}`}
                      className="w-full flex items-center justify-center space-x-1 text-[#5F6368] hover:text-[#0E6B6B] text-xs font-medium py-1 transition"
                    >
                      <span>Public verification page</span>
                      <ExternalLink className="w-3 h-3 ml-0.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-[8px] border border-[#E7E2DA] p-8 text-center max-w-md mx-auto shadow-sm">
              <h3 className="font-serif font-semibold text-sm text-[#1F2328] mb-1">No certificates yet</h3>
              <p className="text-xs text-[#5F6368]">
                Complete all required lessons in a course and achieve 70%+ on the final assessment to unlock your certificate.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
