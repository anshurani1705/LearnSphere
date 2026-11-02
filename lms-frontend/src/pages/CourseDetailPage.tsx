import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../api/client';
import { CourseDetail, Lesson, OrderResponse } from '../types';
import { useAuth } from '../context/AuthContext';
import { initiateCheckout } from '../utils/razorpay';
import { MockCheckoutModal } from '../components/payment/MockCheckoutModal';
import { Badge } from '../components/ui/Badge';
import { Alert } from '../components/ui/Alert';
import {
  Clock,
  User,
  ShieldCheck,
  CheckCircle2,
  PlayCircle,
  Lock,
  ChevronDown,
  ChevronUp,
  Award,
  AlertCircle,
  FileText,
  X,
  BookOpen,
  ArrowLeft,
} from 'lucide-react';

export const CourseDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>({});
  const [previewLesson, setPreviewLesson] = useState<Lesson | null>(null);
  const [activeMockOrder, setActiveMockOrder] = useState<OrderResponse | null>(null);
  const [quickEnrolling, setQuickEnrolling] = useState(false);

  const fetchCourse = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/v1/courses/${slug}`);
      if (res.data?.success) {
        const c: CourseDetail = res.data.data;
        c.isEnrolled = Boolean(c.isEnrolled ?? c.enrolled);
        setCourse(c);
        // Expand all sections by default
        const initialExpanded: Record<number, boolean> = {};
        (c.sections || []).forEach((s) => {
          initialExpanded[s.id] = true;
        });
        setExpandedSections(initialExpanded);
      } else {
        setError('Course not found');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [slug]);

  const toggleSection = (sectionId: number) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const handleEnrollClick = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/courses/${slug}` } });
      return;
    }

    if (!course) return;

    setCheckoutLoading(true);
    setCheckoutError(null);

    await initiateCheckout({
      courseId: course.id,
      courseTitle: course.title,
      user,
      onMockCheckout: (mockOrder) => {
        setCheckoutLoading(false);
        setActiveMockOrder(mockOrder);
      },
      onSuccess: (orderNumber) => {
        setCheckoutLoading(false);
        setActiveMockOrder(null);
        navigate(`/learn/${course.id}`, {
          state: { message: `Enrollment confirmed! Order #${orderNumber}` },
        });
      },
      onError: (errMsg) => {
        setCheckoutLoading(false);
        setCheckoutError(errMsg);
      },
    });
  };

  const handleQuickEnroll = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/courses/${slug}` } });
      return;
    }
    if (!course) return;
    setQuickEnrolling(true);
    setCheckoutError(null);
    try {
      const res = await api.post(`/v1/student/courses/${course.id}/enroll`);
      if (res.data?.success) {
        navigate(`/learn/${course.id}`, {
          state: { message: 'Enrolled successfully!' },
        });
      }
    } catch (err: any) {
      setCheckoutError(err.response?.data?.message || 'Failed to enroll');
    } finally {
      setQuickEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-24 bg-[#FAFAF8]">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#172B4D] border-t-transparent"></div>
          <span className="text-xs text-[#697386]">Loading course curriculum...</span>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex-1 flex items-center justify-center py-20 px-4 bg-[#FAFAF8]">
        <div className="max-w-md w-full bg-white p-8 rounded-lg border border-[#E5E7EB] shadow-card text-center">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-[#20252B] mb-1">Course Unavailable</h2>
          <p className="text-[#697386] text-xs sm:text-sm mb-6">{error || 'Could not find this course.'}</p>
          <Link
            to="/courses"
            className="inline-flex items-center justify-center font-medium rounded-lg text-xs sm:text-sm px-4 py-2 bg-[#172B4D] text-white hover:bg-[#0F1E36] transition-colors"
          >
            Back to Course Catalog
          </Link>
        </div>
      </div>
    );
  }

  const levelVariant = {
    BEGINNER: 'success',
    INTERMEDIATE: 'teal',
    ADVANCED: 'primary',
  }[course.level] as 'success' | 'teal' | 'primary' || 'neutral';

  const totalLessons = (course.sections || []).reduce((acc, s) => acc + (s.lessons?.length || 0), 0);

  return (
    <div className="flex-1 bg-[#FAFAF8]">
      {/* Course Hero Banner */}
      <section className="bg-[#172B4D] text-white py-12 lg:py-16 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-xs text-slate-300 mb-4">
            <Link to="/courses" className="hover:text-white flex items-center gap-1 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>All Courses</span>
            </Link>
            <span>/</span>
            <span className="text-slate-400 truncate max-w-xs">{course.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center space-x-2">
                <Badge variant={levelVariant} size="sm">
                  {course.level}
                </Badge>
                {course.durationHours ? (
                  <>
                    <span className="text-slate-400 text-xs">&bull;</span>
                    <span className="text-xs text-slate-300 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-teal-400" />
                      <span>{course.durationHours} Hours Self-Paced</span>
                    </span>
                  </>
                ) : null}
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
                {course.title}
              </h1>

              {course.shortDescription && (
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
                  {course.shortDescription}
                </p>
              )}

              {course.instructorName && (
                <div className="flex items-center space-x-3 pt-2">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-semibold text-white text-xs border border-white/20">
                    {course.instructorName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400">Course Instructor</p>
                    <p className="text-xs sm:text-sm font-medium text-white">{course.instructorName}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile View Enrollment Box */}
            <div className="lg:hidden bg-white text-[#20252B] p-5 rounded-lg border border-[#E5E7EB] shadow-card">
              <div className="flex items-baseline space-x-2 mb-3">
                <span className="text-2xl font-bold text-[#20252B]">
                  ₹{course.price.toLocaleString('en-IN')}
                </span>
                {course.originalPrice && course.originalPrice > course.price && (
                  <span className="text-xs text-[#697386] line-through">
                    ₹{course.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>

              {checkoutError && (
                <div className="mb-3">
                  <Alert type="error" message={checkoutError} />
                </div>
              )}

              {course.isEnrolled ? (
                <Link
                  to={`/learn/${course.id}`}
                  className="block w-full text-center bg-[#287C78] hover:bg-[#206562] text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
                >
                  Continue Learning
                </Link>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={handleEnrollClick}
                    disabled={checkoutLoading || quickEnrolling}
                    className="w-full bg-[#172B4D] hover:bg-[#0F1E36] text-white font-medium py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50"
                  >
                    {checkoutLoading ? 'Opening Checkout...' : 'Enroll in Course'}
                  </button>
                  <button
                    onClick={handleQuickEnroll}
                    disabled={checkoutLoading || quickEnrolling}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-[#20252B] font-medium py-2 rounded-lg text-xs transition-colors disabled:opacity-50"
                  >
                    {quickEnrolling ? 'Enrolling...' : 'Instant Test Enrollment'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          {/* Left Column: Syllabus, Learning Outcomes, Description */}
          <div className="lg:col-span-2 space-y-8">
            {/* What you will learn */}
            {course.learningOutcomes && course.learningOutcomes.length > 0 && (
              <div className="bg-white p-6 rounded-lg border border-[#E5E7EB] shadow-card">
                <h2 className="text-base sm:text-lg font-semibold text-[#20252B] mb-4">
                  What You Will Learn
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {course.learningOutcomes.map((outcome, idx) => (
                    <div key={idx} className="flex items-start space-x-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#287C78] shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-[#20252B] leading-relaxed">{outcome}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Curriculum Sections */}
            <div className="bg-white p-6 rounded-lg border border-[#E5E7EB] shadow-card">
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#E5E7EB]">
                <div>
                  <h2 className="text-base sm:text-lg font-semibold text-[#20252B]">Course Curriculum</h2>
                  <p className="text-xs text-[#697386] mt-0.5">
                    {course.sections.length} sections &bull; {totalLessons} lessons total
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {course.sections.map((section, sIdx) => {
                  const isExpanded = expandedSections[section.id];
                  const lessonCount = section.lessons?.length || 0;
                  return (
                    <div key={section.id} className="border border-[#E5E7EB] rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="w-full flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
                      >
                        <div className="flex items-center space-x-2.5">
                          <span className="text-xs font-semibold text-[#172B4D]">
                            Section {sIdx + 1}:
                          </span>
                          <span className="text-xs sm:text-sm font-medium text-[#20252B]">
                            {section.title}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2.5 text-[#697386] text-xs">
                          <span>{lessonCount} lessons</span>
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="divide-y divide-[#E5E7EB] bg-white">
                          {(section.lessons || []).map((lesson) => (
                            <div
                              key={lesson.id}
                              className="p-3 sm:px-4 sm:py-3 flex items-center justify-between hover:bg-slate-50/60 transition-colors text-xs sm:text-sm"
                            >
                              <div className="flex items-center space-x-2.5">
                                {lesson.contentType === 'VIDEO' ? (
                                  <PlayCircle className="w-4 h-4 text-[#287C78] shrink-0" />
                                ) : (
                                  <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                                )}
                                <span className="text-[#20252B] font-medium">{lesson.title}</span>
                              </div>

                              <div className="flex items-center space-x-2.5">
                                {lesson.videoDurationSeconds ? (
                                  <span className="text-[11px] text-[#697386]">
                                    {Math.round(lesson.videoDurationSeconds / 60)} min
                                  </span>
                                ) : null}

                                {lesson.preview ? (
                                  <button
                                    onClick={() => setPreviewLesson(lesson)}
                                    className="text-[11px] font-medium text-[#287C78] hover:text-[#1A5250] bg-teal-50 hover:bg-teal-100 px-2.5 py-0.5 rounded transition-colors"
                                  >
                                    Preview
                                  </button>
                                ) : (
                                  <Lock className="w-3.5 h-3.5 text-slate-300" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Course Description */}
            <div className="bg-white p-6 rounded-lg border border-[#E5E7EB] shadow-card space-y-3">
              <h2 className="text-base sm:text-lg font-semibold text-[#20252B]">About this Course</h2>
              <div className="text-[#20252B] text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                {course.description}
              </div>
            </div>

            {/* Prerequisites */}
            {course.prerequisites && course.prerequisites.length > 0 && (
              <div className="bg-white p-6 rounded-lg border border-[#E5E7EB] shadow-card">
                <h2 className="text-base sm:text-lg font-semibold text-[#20252B] mb-3">Requirements & Prerequisites</h2>
                <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-[#697386]">
                  {course.prerequisites.map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Column: Desktop Sticky Checkout Card */}
          <div className="hidden lg:block sticky top-24">
            <div className="bg-white rounded-lg border border-[#E5E7EB] shadow-card p-6 space-y-5">
              <div>
                <div className="flex items-baseline space-x-2 mb-1">
                  <span className="text-2xl font-bold text-[#20252B]">
                    ₹{course.price.toLocaleString('en-IN')}
                  </span>
                  {course.originalPrice && course.originalPrice > course.price && (
                    <span className="text-xs text-[#697386] line-through">
                      ₹{course.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
                <p className="text-xs text-emerald-700 font-medium">Self-Paced Lifetime Access</p>
              </div>

              {checkoutError && (
                <Alert type="error" message={checkoutError} />
              )}

              {course.isEnrolled ? (
                <div className="space-y-2">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md text-xs text-emerald-800 font-medium flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>You are enrolled in this course</span>
                  </div>
                  <Link
                    to={`/learn/${course.id}`}
                    className="block w-full text-center bg-[#287C78] hover:bg-[#206562] text-white font-medium py-2.5 rounded-lg text-xs sm:text-sm transition-colors shadow-sm"
                  >
                    Go to Course Workspace
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={handleEnrollClick}
                    disabled={checkoutLoading || quickEnrolling}
                    className="w-full bg-[#172B4D] hover:bg-[#0F1E36] text-white font-medium py-2.5 rounded-lg text-xs sm:text-sm transition-colors shadow-sm disabled:opacity-50"
                  >
                    {checkoutLoading ? 'Opening Checkout...' : 'Enroll in Course'}
                  </button>
                  <button
                    onClick={handleQuickEnroll}
                    disabled={checkoutLoading || quickEnrolling}
                    className="w-full bg-slate-50 hover:bg-slate-100 text-[#20252B] font-medium py-2 rounded-lg text-xs border border-[#E5E7EB] transition-colors disabled:opacity-50 flex items-center justify-center space-x-1"
                  >
                    {quickEnrolling ? 'Enrolling...' : '⚡ Instant Test Enrollment'}
                  </button>
                </div>
              )}

              <div className="border-t border-[#E5E7EB] pt-4 space-y-2.5 text-xs text-[#697386]">
                <p className="font-semibold text-[#20252B]">This course includes:</p>
                <div className="flex items-center space-x-2">
                  <PlayCircle className="w-4 h-4 text-[#287C78] shrink-0" />
                  <span>On-demand self-paced lessons</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#287C78] shrink-0" />
                  <span>Interactive code assessments</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-[#287C78] shrink-0" />
                  <span>Verifiable digital completion certificate</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Secure transaction processing</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Lesson Modal */}
      {previewLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full overflow-hidden shadow-modal border border-[#E5E7EB]">
            <div className="p-4 bg-[#172B4D] text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <PlayCircle className="w-4 h-4 text-teal-400" />
                <h3 className="font-semibold text-sm truncate">{previewLesson.title}</h3>
              </div>
              <button
                onClick={() => setPreviewLesson(null)}
                className="text-slate-300 hover:text-white p-1 rounded"
                aria-label="Close preview"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-3.5">
              <div className="aspect-video bg-slate-900 rounded-md overflow-hidden flex items-center justify-center text-slate-400">
                {previewLesson.videoUrl ? (
                  <iframe
                    src={previewLesson.videoUrl}
                    title={previewLesson.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div className="text-center p-6">
                    <PlayCircle className="w-12 h-12 mx-auto mb-2 text-teal-400 opacity-70" />
                    <p className="text-xs sm:text-sm font-semibold text-slate-200">Interactive Preview</p>
                    <p className="text-xs text-slate-400 mt-1">Full content unlocked upon enrollment</p>
                  </div>
                )}
              </div>
              {previewLesson.description && (
                <p className="text-[#697386] text-xs sm:text-sm leading-relaxed">{previewLesson.description}</p>
              )}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setPreviewLesson(null)}
                  className="bg-slate-100 hover:bg-slate-200 text-[#20252B] text-xs font-medium px-4 py-2 rounded-md transition-colors"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mock Payment Simulation Modal */}
      {activeMockOrder && user && (
        <MockCheckoutModal
          order={activeMockOrder}
          user={user}
          onSuccess={(orderNumber) => {
            setActiveMockOrder(null);
            navigate(`/learn/${course.id}`, {
              state: { message: `Enrollment confirmed! Order #${orderNumber}` },
            });
          }}
          onError={(errMsg) => {
            setCheckoutError(errMsg);
          }}
          onClose={() => {
            setActiveMockOrder(null);
          }}
        />
      )}
    </div>
  );
};
