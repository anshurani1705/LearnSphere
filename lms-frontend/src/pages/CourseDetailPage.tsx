import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../api/client';
import { CourseDetail, Lesson, OrderResponse } from '../types';
import { useAuth } from '../context/AuthContext';
import { initiateCheckout } from '../utils/razorpay';
import { MockCheckoutModal } from '../components/payment/MockCheckoutModal';
import { getCourseThumbnail } from '../components/CourseCard';
import {
  Check,
  ChevronDown,
  ChevronUp,
  FileText,
  Lock,
  PlayCircle,
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
      <div className="flex-1 flex items-center justify-center py-24 bg-[#FAF8F5]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#0E6B6B] border-t-transparent"></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex-1 flex items-center justify-center py-24 px-4 bg-[#FAF8F5]">
        <div className="max-w-md w-full bg-white p-8 rounded-[8px] border border-[#E7E2DA] text-center shadow-sm">
          <h2 className="font-serif font-semibold text-xl text-[#1F2328] mb-2">Course not found</h2>
          <p className="text-[#5F6368] text-sm mb-6">{error || 'Could not find this course.'}</p>
          <Link
            to="/courses"
            className="inline-block bg-[#0E6B6B] text-white px-4 py-2 rounded-[6px] font-medium text-sm hover:bg-[#0A5555] transition"
          >
            Back to courses
          </Link>
        </div>
      </div>
    );
  }

  const levelLabel = {
    BEGINNER: 'Beginner',
    INTERMEDIATE: 'Intermediate',
    ADVANCED: 'Advanced',
  }[course.level] || course.level;

  return (
    <div className="flex-1 bg-[#FAF8F5] dark:bg-[#14171A] transition-colors duration-200">
      {/* Light Hero Section */}
      <section className="py-12 lg:py-16 border-b border-[#E7E2DA] dark:border-[#2A3038]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center space-x-2 text-xs text-[#5F6368] dark:text-[#8B949E]">
                <span>{levelLabel}</span>
                <span>&bull;</span>
                <span>{course.durationHours || 40} hours of material</span>
                {course.instructorName && (
                  <>
                    <span>&bull;</span>
                    <span>Taught by {course.instructorName}</span>
                  </>
                )}
              </div>

              <h1 className="font-serif font-semibold text-3xl sm:text-4xl lg:text-[40px] text-[#1F2328] dark:text-[#E6EDF3] tracking-tight leading-[1.2]">
                {course.title}
              </h1>

              <p className="text-base sm:text-lg text-[#5F6368] dark:text-[#8B949E] leading-relaxed max-w-2xl">
                {course.shortDescription}
              </p>
            </div>

            {/* Mobile pricing card */}
            <div className="lg:hidden bg-white dark:bg-[#1C2025] p-5 rounded-[8px] border border-[#E7E2DA] dark:border-[#2A3038] shadow-sm">
              <div className="aspect-video rounded-[6px] overflow-hidden mb-4 bg-[#FAF8F5] dark:bg-[#14171A]">
                <img
                  src={getCourseThumbnail(course)}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex items-baseline space-x-2 mb-4">
                <span className="text-2xl font-semibold text-[#1F2328] dark:text-[#E6EDF3]">
                  ₹{course.price.toLocaleString('en-IN')}
                </span>
                {course.originalPrice && course.originalPrice > course.price && (
                  <span className="text-sm text-[#8B949E] dark:text-[#6E7681] line-through">
                    ₹{course.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>

              {course.isEnrolled ? (
                <Link
                  to={`/learn/${course.id}`}
                  className="block w-full text-center bg-[#0E6B6B] hover:bg-[#0A5555] dark:bg-[#149B9B] dark:hover:bg-[#118585] text-white font-medium py-2.5 rounded-[6px] transition text-sm"
                >
                  Continue learning
                </Link>
              ) : (
                <button
                  onClick={handleEnrollClick}
                  disabled={checkoutLoading}
                  className="w-full bg-[#D9663A] hover:bg-[#C2552B] dark:bg-[#E27248] dark:hover:bg-[#EC825A] text-white font-medium py-2.5 rounded-[6px] transition text-sm disabled:opacity-50"
                >
                  {checkoutLoading ? 'Processing...' : 'Enroll in course'}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Learning Outcomes, Curriculum, Bio, Prerequisites */}
          <div className="lg:col-span-8 space-y-12">
            {/* What you will learn */}
            {course.learningOutcomes && course.learningOutcomes.length > 0 && (
              <div className="bg-white dark:bg-[#1C2025] p-6 sm:p-8 rounded-[8px] border border-[#E7E2DA] dark:border-[#2A3038] shadow-sm">
                <h2 className="font-serif font-semibold text-xl text-[#1F2328] dark:text-[#E6EDF3] mb-4">
                  What you will learn
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {course.learningOutcomes.map((outcome, idx) => (
                    <div key={idx} className="flex items-start space-x-2.5">
                      <span className="w-4 h-4 rounded-full bg-[#E6F2F1] dark:bg-[#172D2D] text-[#0E6B6B] dark:text-[#149B9B] flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                      <span className="text-sm text-[#1F2328] dark:text-[#E6EDF3] leading-relaxed">{outcome}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Course Curriculum Accordion */}
            <div className="bg-white dark:bg-[#1C2025] p-6 sm:p-8 rounded-[8px] border border-[#E7E2DA] dark:border-[#2A3038] shadow-sm">
              <div className="flex items-baseline justify-between mb-6 pb-3 border-b border-[#E7E2DA] dark:border-[#2A3038]">
                <div>
                  <h2 className="font-serif font-semibold text-xl text-[#1F2328] dark:text-[#E6EDF3]">
                    Syllabus
                  </h2>
                  <p className="text-xs text-[#5F6368] dark:text-[#8B949E] mt-1">
                    {course.sections.length} sections &bull;{' '}
                    {course.sections.reduce((acc, s) => acc + s.lessons.length, 0)} lessons
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {course.sections.map((section, sIdx) => {
                  const isExpanded = expandedSections[section.id];
                  return (
                    <div key={section.id} className="border border-[#E7E2DA] dark:border-[#2A3038] rounded-[6px] overflow-hidden">
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="w-full flex items-center justify-between p-3.5 bg-[#FAF8F5] dark:bg-[#16191D] hover:bg-[#F2EFE9] dark:hover:bg-[#20252C] transition text-left"
                      >
                        <div className="flex items-center space-x-2.5">
                          <span className="text-xs text-[#5F6368] dark:text-[#8B949E] font-medium">
                            Part {sIdx + 1}:
                          </span>
                          <span className="font-medium text-sm text-[#1F2328] dark:text-[#E6EDF3]">{section.title}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-[#5F6368] dark:text-[#8B949E]">
                          <span>{section.lessons.length} lessons</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="divide-y divide-[#E7E2DA]/60 dark:divide-[#2A3038] bg-white dark:bg-[#1C2025]">
                          {section.lessons.map((lesson) => (
                            <div
                              key={lesson.id}
                              className="p-3.5 flex items-center justify-between hover:bg-[#FAF8F5]/60 dark:hover:bg-[#20252C]/60 transition text-sm"
                            >
                              <div className="flex items-center space-x-2.5">
                                {lesson.contentType === 'VIDEO' ? (
                                  <PlayCircle className="w-4 h-4 text-[#0E6B6B] dark:text-[#149B9B] shrink-0" />
                                ) : (
                                  <FileText className="w-4 h-4 text-[#8B949E] shrink-0" />
                                )}
                                <span className="text-sm text-[#1F2328] dark:text-[#E6EDF3]">{lesson.title}</span>
                              </div>

                              <div className="flex items-center space-x-2 text-xs">
                                {lesson.videoDurationSeconds && (
                                  <span className="text-[#5F6368]">
                                    {Math.round(lesson.videoDurationSeconds / 60)} min
                                  </span>
                                )}

                                {lesson.preview ? (
                                  <button
                                    onClick={() => setPreviewLesson(lesson)}
                                    className="text-xs font-medium text-[#0E6B6B] hover:underline px-2 py-0.5"
                                  >
                                    Preview
                                  </button>
                                ) : (
                                  <Lock className="w-3.5 h-3.5 text-[#A0A5AA]" />
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

            {/* About this course */}
            <div className="bg-white dark:bg-[#1C2025] p-6 sm:p-8 rounded-[8px] border border-[#E7E2DA] dark:border-[#2A3038] shadow-sm space-y-4">
              <h2 className="font-serif font-semibold text-xl text-[#1F2328] dark:text-[#E6EDF3]">
                About this course
              </h2>
              <div className="text-sm text-[#5F6368] dark:text-[#8B949E] leading-relaxed whitespace-pre-line max-w-prose">
                {course.description}
              </div>
            </div>

            {/* Instructor Bio */}
            {course.instructorName && (
              <div className="bg-white dark:bg-[#1C2025] p-6 sm:p-8 rounded-[8px] border border-[#E7E2DA] dark:border-[#2A3038] shadow-sm space-y-3">
                <h2 className="font-serif font-semibold text-xl text-[#1F2328] dark:text-[#E6EDF3]">
                  Your instructor
                </h2>
                <div className="flex items-start space-x-4 pt-1">
                  <div className="w-12 h-12 rounded-[6px] bg-[#E6F2F1] dark:bg-[#172D2D] text-[#0E6B6B] dark:text-[#149B9B] flex items-center justify-center font-serif font-semibold text-lg border border-[#E7E2DA] dark:border-[#2A3038] shrink-0">
                    {course.instructorName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-sans font-medium text-base text-[#1F2328] dark:text-[#E6EDF3]">
                      {course.instructorName}
                    </h3>
                    <p className="text-sm text-[#5F6368] dark:text-[#8B949E] mt-1 leading-relaxed max-w-prose">
                      {course.instructorBio || 'Senior engineer and practitioner with extensive production experience.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Requirements & Prerequisites */}
            {course.prerequisites && course.prerequisites.length > 0 && (
              <div className="bg-white dark:bg-[#1C2025] p-6 sm:p-8 rounded-[8px] border border-[#E7E2DA] dark:border-[#2A3038] shadow-sm">
                <h2 className="font-serif font-semibold text-xl text-[#1F2328] dark:text-[#E6EDF3] mb-3">
                  Requirements
                </h2>
                <ul className="list-disc list-inside space-y-1.5 text-sm text-[#5F6368] dark:text-[#8B949E]">
                  {course.prerequisites.map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Column: Desktop Sticky Checkout Card */}
          <div className="hidden lg:block lg:col-span-4 sticky top-24">
            <div className="bg-white dark:bg-[#1C2025] rounded-[8px] border border-[#E7E2DA] dark:border-[#2A3038] shadow-sm p-5 space-y-4">
              <div className="aspect-video rounded-[6px] overflow-hidden bg-[#FAF8F5] dark:bg-[#14171A]">
                <img
                  src={getCourseThumbnail(course)}
                  alt={course.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80';
                  }}
                />
              </div>

              <div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-semibold text-[#1F2328] dark:text-[#E6EDF3]">
                    ₹{course.price.toLocaleString('en-IN')}
                  </span>
                  {course.originalPrice && course.originalPrice > course.price && (
                    <span className="text-xs text-[#8B949E] dark:text-[#6E7681] line-through">
                      ₹{course.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#5F6368] dark:text-[#8B949E] mt-0.5">Lifetime access with certificate included</p>
              </div>

              {checkoutError && (
                <div className="p-2.5 bg-[#C0392B]/10 border border-[#C0392B]/20 rounded-[6px] text-xs text-[#C0392B]">
                  {checkoutError}
                </div>
              )}

              {course.isEnrolled ? (
                <div className="space-y-2">
                  <p className="text-xs text-[#2F855A] font-medium">You are enrolled in this course</p>
                  <Link
                    to={`/learn/${course.id}`}
                    className="block w-full text-center bg-[#0E6B6B] hover:bg-[#0A5555] dark:bg-[#149B9B] dark:hover:bg-[#118585] text-white font-medium py-2.5 rounded-[6px] transition text-sm shadow-sm"
                  >
                    Go to course player
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={handleEnrollClick}
                    disabled={checkoutLoading || quickEnrolling}
                    className="w-full bg-[#D9663A] hover:bg-[#C2552B] dark:bg-[#E27248] dark:hover:bg-[#EC825A] text-white font-medium py-2.5 rounded-[6px] transition text-sm shadow-sm disabled:opacity-50"
                  >
                    {checkoutLoading ? 'Opening checkout...' : 'Enroll in course'}
                  </button>
                  <button
                    onClick={handleQuickEnroll}
                    disabled={checkoutLoading || quickEnrolling}
                    className="w-full bg-[#FAF8F5] dark:bg-[#16191D] hover:bg-[#E7E2DA]/40 dark:hover:bg-[#232931] text-[#1F2328] dark:text-[#E6EDF3] font-medium py-2 rounded-[6px] transition text-xs border border-[#E7E2DA] dark:border-[#2A3038] flex items-center justify-center space-x-1 disabled:opacity-50"
                  >
                    {quickEnrolling ? 'Enrolling...' : 'Try 1-click demo enrollment'}
                  </button>
                </div>
              )}

              <div className="border-t border-[#E7E2DA] dark:border-[#2A3038] pt-3.5 space-y-2 text-xs text-[#5F6368] dark:text-[#8B949E]">
                <p className="font-medium text-[#1F2328] dark:text-[#E6EDF3]">Included with this course:</p>
                <div className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-[#0E6B6B] dark:text-[#149B9B] shrink-0" />
                  <span>On-demand HD video walk-throughs</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-[#0E6B6B] dark:text-[#149B9B] shrink-0" />
                  <span>Interactive quizzes with instant grading</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-[#0E6B6B] dark:text-[#149B9B] shrink-0" />
                  <span>Publicly verifiable completion certificate</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Lesson Modal */}
      {previewLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-[#1C2025] rounded-[8px] max-w-2xl w-full overflow-hidden shadow-lg border border-[#E7E2DA] dark:border-[#2A3038]">
            <div className="p-4 border-b border-[#E7E2DA] dark:border-[#2A3038] flex items-center justify-between">
              <h3 className="font-serif font-semibold text-sm text-[#1F2328] dark:text-[#E6EDF3] truncate">{previewLesson.title}</h3>
              <button
                onClick={() => setPreviewLesson(null)}
                className="text-[#5F6368] dark:text-[#8B949E] hover:text-[#1F2328] dark:hover:text-[#E6EDF3]"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-3">
              <div className="aspect-video bg-[#1F2328] rounded-[6px] overflow-hidden flex items-center justify-center text-[#8B949E]">
                {previewLesson.videoUrl ? (
                  <iframe
                    src={previewLesson.videoUrl}
                    title={previewLesson.title}
                    className="w-full h-full"
                    allowFullScreen
                  />
                ) : (
                  <p className="text-xs">Video stream preview loaded from demo content.</p>
                )}
              </div>
              <p className="text-xs text-[#5F6368] leading-relaxed">
                {previewLesson.description || 'Sample preview lesson from this course.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Razorpay Mock Checkout Modal */}
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
            setActiveMockOrder(null);
          }}
          onClose={() => setActiveMockOrder(null)}
        />
      )}
    </div>
  );
};
