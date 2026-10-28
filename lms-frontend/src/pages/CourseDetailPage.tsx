import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../api/client';
import { CourseDetail, Lesson, OrderResponse } from '../types';
import { useAuth } from '../context/AuthContext';
import { initiateCheckout } from '../utils/razorpay';
import { MockCheckoutModal } from '../components/payment/MockCheckoutModal';
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
        c.sections.forEach((s) => {
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
        // Navigate to student dashboard or player
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

  const [quickEnrolling, setQuickEnrolling] = useState(false);

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
      <div className="flex-1 flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex-1 flex items-center justify-center py-24 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-xl border border-slate-200 text-center">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">Course Unavailable</h2>
          <p className="text-slate-600 text-sm mb-6">{error || 'Could not find this course.'}</p>
          <Link
            to="/courses"
            className="inline-block bg-indigo-600 text-white px-5 py-2 rounded-lg font-semibold text-sm hover:bg-indigo-700 transition"
          >
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-50">
      {/* Course Hero Banner */}
      <section className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white py-14 lg:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:28px_28px] opacity-15 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                  {course.level}
                </span>
                <span className="text-xs text-slate-400">&bull;</span>
                <span className="text-xs text-slate-300 flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{course.durationHours || 40} Hours Comprehensive</span>
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                {course.title}
              </h1>

              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                {course.shortDescription}
              </p>

              {course.instructorName && (
                <div className="flex items-center space-x-3 pt-2">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white text-sm">
                    {course.instructorName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Created by</p>
                    <p className="text-sm font-semibold text-white">{course.instructorName}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile / Tablet pricing banner */}
            <div className="lg:hidden bg-slate-800 p-6 rounded-2xl border border-slate-700">
              <div className="flex items-baseline space-x-3 mb-4">
                <span className="text-3xl font-extrabold text-white">
                  ₹{course.price.toLocaleString('en-IN')}
                </span>
                {course.originalPrice && course.originalPrice > course.price && (
                  <span className="text-sm text-slate-400 line-through">
                    ₹{course.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>

              {course.isEnrolled ? (
                <Link
                  to={`/learn/${course.id}`}
                  className="block w-full text-center bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl transition shadow"
                >
                  Continue Learning
                </Link>
              ) : (
                <button
                  onClick={handleEnrollClick}
                  disabled={checkoutLoading}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl transition shadow disabled:opacity-50"
                >
                  {checkoutLoading ? 'Processing Checkout...' : 'Enroll Now'}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Left Column: Curriculum, Description, Outcomes */}
          <div className="lg:col-span-2 space-y-12">
            {/* Learning Outcomes */}
            {course.learningOutcomes && course.learningOutcomes.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-6">What You Will Learn</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {course.learningOutcomes.map((outcome, idx) => (
                    <div key={idx} className="flex items-start space-x-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-slate-700 text-sm leading-relaxed">{outcome}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Curriculum Sections */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Course Curriculum</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    {course.sections.length} Sections &bull;{' '}
                    {course.sections.reduce((acc, s) => acc + s.lessons.length, 0)} Total Lessons
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {course.sections.map((section, sIdx) => {
                  const isExpanded = expandedSections[section.id];
                  return (
                    <div key={section.id} className="border border-slate-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition text-left"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                            Section {sIdx + 1}
                          </span>
                          <span className="font-bold text-slate-900 text-sm">{section.title}</span>
                        </div>
                        <div className="flex items-center space-x-3 text-slate-500 text-xs">
                          <span>{section.lessons.length} lessons</span>
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="divide-y divide-slate-100 bg-white">
                          {section.lessons.map((lesson) => (
                            <div
                              key={lesson.id}
                              className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition text-sm"
                            >
                              <div className="flex items-center space-x-3">
                                {lesson.contentType === 'VIDEO' ? (
                                  <PlayCircle className="w-4 h-4 text-indigo-500 shrink-0" />
                                ) : (
                                  <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                                )}
                                <span className="text-slate-800 font-medium">{lesson.title}</span>
                              </div>

                              <div className="flex items-center space-x-3">
                                {lesson.videoDurationSeconds && (
                                  <span className="text-xs text-slate-400">
                                    {Math.round(lesson.videoDurationSeconds / 60)} min
                                  </span>
                                )}

                                {lesson.preview ? (
                                  <button
                                    onClick={() => setPreviewLesson(lesson)}
                                    className="text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-md transition"
                                  >
                                    Preview
                                  </button>
                                ) : (
                                  <span className="text-slate-300">
                                    <Lock className="w-3.5 h-3.5" />
                                  </span>
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
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-slate-900">About this Course</h2>
              <div className="prose prose-slate max-w-none text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                {course.description}
              </div>
            </div>

            {/* Prerequisites */}
            {course.prerequisites && course.prerequisites.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Requirements & Prerequisites</h2>
                <ul className="list-disc list-inside space-y-2 text-slate-700 text-sm">
                  {course.prerequisites.map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Column: Desktop Sticky Checkout Card */}
          <div className="hidden lg:block sticky top-24">
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-7 space-y-6">
              <div>
                <div className="flex items-baseline space-x-3 mb-1">
                  <span className="text-3xl font-extrabold text-slate-900">
                    ₹{course.price.toLocaleString('en-IN')}
                  </span>
                  {course.originalPrice && course.originalPrice > course.price && (
                    <span className="text-sm text-slate-400 line-through">
                      ₹{course.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
                <p className="text-xs text-emerald-600 font-semibold">Instant Lifetime Access</p>
              </div>

              {checkoutError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
                  {checkoutError}
                </div>
              )}

              {course.isEnrolled ? (
                <div className="space-y-3">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 font-semibold flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>You are enrolled in this course</span>
                  </div>
                  <Link
                    to={`/learn/${course.id}`}
                    className="block w-full text-center bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl transition shadow text-sm"
                  >
                    Go to Learning Player
                  </Link>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <button
                    onClick={handleEnrollClick}
                    disabled={checkoutLoading || quickEnrolling}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-indigo-600/20 text-sm disabled:opacity-50"
                  >
                    {checkoutLoading ? 'Opening Checkout...' : 'Buy Course & Start Learning'}
                  </button>
                  <button
                    onClick={handleQuickEnroll}
                    disabled={checkoutLoading || quickEnrolling}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-2.5 rounded-xl transition text-xs border border-slate-300 flex items-center justify-center space-x-1.5 disabled:opacity-50"
                  >
                    {quickEnrolling ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-slate-600 border-t-transparent rounded-full animate-spin" />
                        <span>Enrolling...</span>
                      </>
                    ) : (
                      <span>⚡ 1-Click Instant Demo Enroll</span>
                    )}
                  </button>
                </div>
              )}

              <div className="border-t border-slate-100 pt-5 space-y-3 text-xs text-slate-600">
                <p className="font-semibold text-slate-900">This course includes:</p>
                <div className="flex items-center space-x-2">
                  <PlayCircle className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span>On-demand recorded HD video lessons</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Comprehensive graded assessments</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-purple-500 shrink-0" />
                  <span>Verified Certificate of Completion</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>Secure checkout via Razorpay</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Lesson Modal */}
      {previewLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <PlayCircle className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-sm truncate">{previewLesson.title}</h3>
              </div>
              <button onClick={() => setPreviewLesson(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="aspect-video bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center text-slate-400">
                {previewLesson.videoUrl ? (
                  <iframe
                    src={previewLesson.videoUrl}
                    title={previewLesson.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div className="text-center p-8">
                    <PlayCircle className="w-16 h-16 mx-auto mb-2 text-indigo-400 opacity-60" />
                    <p className="text-sm font-semibold text-slate-200">Interactive Preview Lecture</p>
                    <p className="text-xs text-slate-400 mt-1">Full content unlocked upon enrollment</p>
                  </div>
                )}
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">{previewLesson.description}</p>
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setPreviewLesson(null)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-4 py-2 rounded-lg transition"
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
