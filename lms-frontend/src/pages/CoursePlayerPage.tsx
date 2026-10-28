import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { CourseDetail, Lesson, Quiz } from '../types';
import {
  PlayCircle,
  FileText,
  CheckCircle2,
  Lock,
  ChevronLeft,
  ChevronRight,
  Award,
  HelpCircle,
  Download,
  AlertCircle,
  ListOrdered,
  Sparkles,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import { downloadCertificatePdf } from '../utils/fileDownload';

export const CoursePlayerPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [completedLessonIds, setCompletedLessonIds] = useState<number[]>([]);
  const [progressPct, setProgressPct] = useState<number>(0);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingProgress, setUpdatingProgress] = useState(false);
  const [certificateId, setCertificateId] = useState<string | null>(null);
  const [enrolling, setEnrolling] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [downloadingCert, setDownloadingCert] = useState(false);

  const fetchCourseData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Course Detail
      const courseRes = await api.get(`/v1/courses/${courseId}`);
      if (courseRes.data?.success) {
        const c: CourseDetail = courseRes.data.data;
        c.isEnrolled = Boolean(c.isEnrolled ?? c.enrolled);
        setCourse(c);

        // Find first lesson to play
        let firstLesson: Lesson | null = null;
        for (const s of c.sections || []) {
          if (s.lessons && s.lessons.length > 0) {
            firstLesson = s.lessons[0];
            break;
          }
        }
        setCurrentLesson(firstLesson);

        // If enrolled, fetch classroom data (progress, quizzes, certificates) safely
        if (c.isEnrolled) {
          const [progRes, quizRes, certRes] = await Promise.allSettled([
            api.get(`/v1/student/courses/${courseId}/progress`),
            api.get(`/v1/courses/${courseId}/quizzes`),
            api.get('/v1/student/certificates'),
          ]);

          if (progRes.status === 'fulfilled' && progRes.value.data?.success) {
            setCompletedLessonIds(progRes.value.data.data.completedLessonIds || []);
            setProgressPct(progRes.value.data.data.overallProgressPct || 0);
          }

          if (quizRes.status === 'fulfilled' && quizRes.value.data?.success) {
            setQuizzes(quizRes.value.data.data || []);
          }

          if (certRes.status === 'fulfilled' && certRes.value.data?.success) {
            const userCerts = certRes.value.data.data || [];
            const matchingCert = userCerts.find((cert: any) => cert.courseId === Number(courseId));
            if (matchingCert) {
              setCertificateId(matchingCert.certificateId);
            }
          }
        }
      }
    } catch (err: any) {
      console.error('Failed to load course player data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  const handleToggleLessonComplete = async (lessonId?: number) => {
    const targetId = lessonId || currentLesson?.id;
    if (!targetId) return;

    const isAlreadyCompleted = completedLessonIds.includes(targetId);
    const newCompleted = !isAlreadyCompleted;

    // Optimistic local state update so the UI updates with zero delay
    const newCompletedIds = newCompleted
      ? [...completedLessonIds, targetId]
      : completedLessonIds.filter((id) => id !== targetId);
    setCompletedLessonIds(newCompletedIds);

    const calculatedPct = allLessons.length > 0
      ? Math.round((newCompletedIds.length / allLessons.length) * 100)
      : 0;
    setProgressPct(calculatedPct);

    setUpdatingProgress(true);
    try {
      await api.post(`/v1/lessons/${targetId}/progress`, {
        completed: newCompleted,
        progressPct: newCompleted ? 100 : 0,
      });

      // Re-fetch progress & certificates in case this completed the course
      const [progRes, certRes] = await Promise.allSettled([
        api.get(`/v1/student/courses/${courseId}/progress`),
        api.get('/v1/student/certificates'),
      ]);

      if (progRes.status === 'fulfilled' && progRes.value.data?.success) {
        setCompletedLessonIds(progRes.value.data.data.completedLessonIds || []);
        setProgressPct(Number(progRes.value.data.data.overallProgressPct) ?? calculatedPct);
      }

      if (certRes.status === 'fulfilled' && certRes.value.data?.success) {
        const userCerts = certRes.value.data.data || [];
        const matchingCert = userCerts.find((c: any) => c.courseId === Number(courseId));
        if (matchingCert) {
          setCertificateId(matchingCert.certificateId);
        }
      }

      // Auto-advance to next lesson if completing current lesson
      if (newCompleted && targetId === currentLesson?.id) {
        goToNextLesson();
      }
    } catch (err) {
      console.error('Failed to update lesson progress', err);
      // Revert if error
      setCompletedLessonIds(completedLessonIds);
    } finally {
      setUpdatingProgress(false);
    }
  };

  const handleMarkComplete = () => handleToggleLessonComplete();

  // Helper to gather all lessons flattened in order
  const allLessons: Lesson[] = course?.sections ? course.sections.flatMap((s) => s.lessons || []) : [];
  const currentIndex = currentLesson ? allLessons.findIndex((l) => l.id === currentLesson.id) : -1;

  const goToNextLesson = () => {
    if (currentIndex >= 0 && currentIndex < allLessons.length - 1) {
      setCurrentLesson(allLessons[currentIndex + 1]);
    }
  };

  const goToPrevLesson = () => {
    if (currentIndex > 0) {
      setCurrentLesson(allLessons[currentIndex - 1]);
    }
  };

  const downloadCert = async () => {
    if (!certificateId) return;
    setDownloadingCert(true);
    try {
      await downloadCertificatePdf(certificateId);
    } catch (err: any) {
      alert(err.message || 'Failed to download certificate.');
    } finally {
      setDownloadingCert(false);
    }
  };

  const handleClaimCertificate = async () => {
    if (!course) return;
    setClaiming(true);
    try {
      const res = await api.post(`/v1/student/courses/${course.id}/claim-certificate`);
      if (res.data?.success && res.data.data?.certificateId) {
        setCertificateId(res.data.data.certificateId);
        alert('🎉 Congratulations! Your certificate has been issued.');
      }
    } catch (err: any) {
      const msg = err.message || err.response?.data?.message || 'Course requirements not satisfied yet. Please complete all lessons and pass the required assessment.';
      alert(msg);
    } finally {
      setClaiming(false);
    }
  };

  const handleQuickEnroll = async () => {
    if (!course) return;
    setEnrolling(true);
    try {
      const res = await api.post(`/v1/student/courses/${course.id}/enroll`);
      if (res.data?.success) {
        await fetchCourseData();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to enroll in course');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-24 bg-slate-900 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex-1 flex items-center justify-center py-24 p-4">
        <div className="bg-white p-8 rounded-xl border border-slate-200 text-center max-w-md shadow-sm">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold mb-2">Course Not Found</h2>
          <p className="text-slate-600 text-sm mb-6">The requested course could not be located or loaded.</p>
          <Link to="/courses" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition">
            Browse All Courses
          </Link>
        </div>
      </div>
    );
  }

  const isUserEnrolled = Boolean(course?.isEnrolled ?? course?.enrolled);
  if (!isUserEnrolled) {
    return (
      <div className="flex-1 flex items-center justify-center py-24 p-4">
        <div className="bg-white p-8 rounded-xl border border-slate-200 text-center max-w-md shadow-sm">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold mb-2">Access Denied</h2>
          <p className="text-slate-600 text-sm mb-6">
            You must be enrolled in <strong>{course.title}</strong> to access the lessons and materials.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={handleQuickEnroll}
              disabled={enrolling}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition flex items-center justify-center space-x-1.5 shadow disabled:opacity-50"
            >
              {enrolling ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Enrolling...</span>
                </>
              ) : (
                <span>⚡ Instant Enroll (Free/Demo)</span>
              )}
            </button>
            <Link
              to="/dashboard"
              className="border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2.5 rounded-lg text-sm font-semibold transition text-center"
            >
              My Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isCurrentLessonCompleted = currentLesson ? completedLessonIds.includes(currentLesson.id) : false;
  const isCourseFullyCompleted = allLessons.length > 0 && completedLessonIds.length >= allLessons.length;

  return (
    <div className="flex-1 bg-slate-900 text-slate-100 flex flex-col lg:flex-row">
      {/* Main Classroom Player Area */}
      <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {/* Navigation Breadcrumb & Back */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <Link
            to="/dashboard"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Dashboard</span>
            <span className="text-slate-600">/</span>
            <span className="text-indigo-400 font-bold truncate max-w-xs">{course.title}</span>
          </Link>

          <div className="flex items-center space-x-2">
            {currentLesson && (
              <button
                onClick={() => handleToggleLessonComplete()}
                disabled={updatingProgress}
                className={`inline-flex items-center space-x-1.5 text-xs font-bold px-3 py-1.5 rounded-lg shadow transition ${
                  isCurrentLessonCompleted
                    ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/50 hover:bg-emerald-600/40'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                }`}
                title="Mark this lesson completed or incomplete"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isCurrentLessonCompleted ? 'Completed' : 'Mark Lesson Complete'}</span>
              </button>
            )}

            {certificateId ? (
              <button
                onClick={downloadCert}
                disabled={downloadingCert}
                className="inline-flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow transition disabled:opacity-60"
              >
                {downloadingCert ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                <span>{downloadingCert ? 'Downloading...' : 'Download Certificate'}</span>
              </button>
            ) : (
              isCourseFullyCompleted && (
                <button
                  onClick={handleClaimCertificate}
                  disabled={claiming}
                  className="inline-flex items-center space-x-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow transition disabled:opacity-50"
                >
                  <Award className="w-4 h-4" />
                  <span>{claiming ? 'Checking...' : 'Claim Certificate'}</span>
                </button>
              )
            )}
          </div>
        </div>

        {/* 1. Verified Certificate Ready Banner */}
        {certificateId && (
          <div className="mb-6 bg-slate-900 border border-emerald-500/60 p-4 sm:p-5 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
            <div className="flex items-center space-x-4 text-left">
              <div className="w-11 h-11 bg-emerald-600 text-white rounded-lg flex items-center justify-center shrink-0 font-extrabold shadow-sm">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="font-bold text-emerald-400 text-base">Course Completed & Certified</h4>
                  <span className="text-[11px] bg-emerald-950 text-emerald-300 font-mono px-2 py-0.5 rounded border border-emerald-700/50">
                    #{certificateId}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Your official Certificate of Completion is cryptographically verified and ready for download.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2.5 shrink-0 w-full sm:w-auto justify-end">
              <button
                onClick={downloadCert}
                disabled={downloadingCert}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-md flex items-center space-x-2 shadow-sm transition disabled:opacity-60"
              >
                {downloadingCert ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                <span>{downloadingCert ? 'Downloading PDF...' : 'Download PDF'}</span>
              </button>
              <Link
                to={`/verify-certificate/${certificateId}`}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-3.5 py-2 rounded-md border border-slate-700 flex items-center space-x-1.5 transition"
              >
                <span>Verify</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* 2. All Lessons Completed - Assessment / Claim Prompt Banner */}
        {isCourseFullyCompleted && !certificateId && (
          <div className="mb-6 bg-slate-900 border border-blue-500/60 p-5 rounded-lg flex flex-col md:flex-row items-center justify-between gap-4 shadow-md">
            <div className="flex items-center space-x-4 text-left">
              <div className="w-11 h-11 bg-blue-600 text-white rounded-lg flex items-center justify-center shrink-0 font-bold shadow-sm">
                <Sparkles className="w-6 h-6 text-blue-100" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base flex items-center space-x-2">
                  <span>All {allLessons.length} Lessons Completed (100%)</span>
                </h4>
                <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
                  {quizzes.length > 0
                    ? `Final Step: Pass the "${quizzes[0].title}" (minimum ${quizzes[0].passingScore}% required) to unlock and download your official verified certificate.`
                    : 'All requirements have been met. Claim your official verified certificate now.'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 shrink-0 w-full md:w-auto justify-end">
              {quizzes.length > 0 ? (
                <Link
                  to={`/quiz/${quizzes[0].id}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-md flex items-center space-x-2 shadow-sm transition"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Take Assessment &rarr;</span>
                </Link>
              ) : (
                <button
                  onClick={handleClaimCertificate}
                  disabled={claiming}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-md flex items-center space-x-2 shadow-sm transition"
                >
                  <Award className="w-4 h-4" />
                  <span>{claiming ? 'Generating Certificate...' : 'Claim Certificate Now'}</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Video / Content Display */}
        {currentLesson ? (
          <div className="space-y-6">
            <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-800 relative flex items-center justify-center">
              {currentLesson.videoUrl ? (
                <iframe
                  src={currentLesson.videoUrl}
                  title={currentLesson.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="text-center p-8 max-w-lg">
                  <PlayCircle className="w-16 h-16 text-indigo-500 mx-auto mb-3 opacity-70" />
                  <h3 className="text-lg font-bold text-white mb-2">{currentLesson.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {currentLesson.description || 'Watch the video lesson attentively and follow the code walkthroughs.'}
                  </p>
                </div>
              )}
            </div>

            {/* Lesson Title & Controls */}
            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                  Lesson {currentIndex + 1} of {allLessons.length}
                </span>
                <h2 className="text-xl font-bold text-white mt-1">{currentLesson.title}</h2>
                {currentLesson.description && (
                  <p className="text-xs text-slate-400 mt-1 max-w-xl">{currentLesson.description}</p>
                )}
              </div>

              <div className="flex items-center space-x-3 shrink-0 w-full sm:w-auto justify-end flex-wrap gap-2">
                <button
                  onClick={goToPrevLesson}
                  disabled={currentIndex <= 0}
                  className="p-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:pointer-events-none transition text-slate-300"
                  title="Previous Lesson"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  onClick={handleMarkComplete}
                  disabled={updatingProgress}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-xs font-semibold transition shadow-sm ${
                    isCurrentLessonCompleted
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isCurrentLessonCompleted ? 'Completed' : 'Mark Complete & Next'}</span>
                </button>

                <button
                  onClick={goToNextLesson}
                  disabled={currentIndex >= allLessons.length - 1}
                  className="p-2 rounded-md bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:pointer-events-none transition text-slate-300"
                  title="Next Lesson"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Next Step Shortcut on Last Lesson */}
                {currentIndex === allLessons.length - 1 && (
                  <>
                    {certificateId ? (
                      <button
                        onClick={downloadCert}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3.5 py-2 rounded-md flex items-center space-x-1.5 shadow-sm"
                      >
                        <Download className="w-4 h-4" />
                        <span>Get Certificate</span>
                      </button>
                    ) : (
                      quizzes.length > 0 && (
                        <Link
                          to={`/quiz/${quizzes[0].id}`}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3.5 py-2 rounded-md flex items-center space-x-1.5 shadow-sm"
                        >
                          <HelpCircle className="w-4 h-4" />
                          <span>Final Quiz &rarr;</span>
                        </Link>
                      )
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Lesson Text or Resources if available */}
            {currentLesson.contentText && (
              <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/40 text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                <h3 className="font-bold text-white text-base mb-3">Lesson Notes & Resources</h3>
                {currentLesson.contentText}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20 text-slate-500">Select a lesson to begin.</div>
        )}
      </div>

      {/* Curriculum & Quizzes Sidebar Drawer (Sticky) */}
      <div className="w-full lg:w-96 bg-slate-850 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col shrink-0 lg:sticky lg:top-0 lg:h-[calc(100vh-64px)]">
        {/* Progress header - Sticky at top of drawer */}
        <div className="p-5 border-b border-slate-800 bg-slate-900/95 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center justify-between text-xs font-bold mb-2">
            <span className="text-slate-300 uppercase tracking-wider">Course Progress</span>
            <span className="text-indigo-400">
              {allLessons.length > 0
                ? Math.max(progressPct, Math.round((completedLessonIds.length / allLessons.length) * 100))
                : progressPct}%
            </span>
          </div>
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-indigo-500 h-full rounded-full transition-all duration-300"
              style={{
                width: `${
                  allLessons.length > 0
                    ? Math.max(progressPct, Math.round((completedLessonIds.length / allLessons.length) * 100))
                    : progressPct
                }%`,
              }}
            ></div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-[11px] text-slate-400">
              {completedLessonIds.length} of {allLessons.length} lessons completed
            </p>
            {certificateId && (
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
                Certified ✅
              </span>
            )}
          </div>
        </div>

        {/* Quizzes & Certification Section */}
        {quizzes.length > 0 && (
          <div className="p-4 border-b border-slate-800 bg-indigo-950/40 sticky top-[89px] z-10 backdrop-blur-md">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center space-x-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Certification Assessments</span>
              </p>
              {isCourseFullyCompleted && !certificateId && (
                <span className="text-[10px] font-bold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded animate-pulse">
                  Required 📝
                </span>
              )}
            </div>

            <div className="space-y-2">
              {quizzes.map((q) => (
                <Link
                  key={q.id}
                  to={`/quiz/${q.id}`}
                  className={`flex items-center justify-between p-3 rounded-xl border transition text-xs font-bold group ${
                    certificateId
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200 hover:bg-emerald-900/40'
                      : isCourseFullyCompleted
                      ? 'bg-indigo-600/30 border-indigo-400 text-white hover:bg-indigo-600/40 ring-2 ring-indigo-500/40'
                      : 'bg-slate-800 hover:bg-slate-700/80 border-indigo-500/30 text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <ListOrdered className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition" />
                    <span>{q.title}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-400 shrink-0">
                    {certificateId ? 'Passed ✅' : `Pass ${q.passingScore}% →`}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Sections & Lessons List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/80">
          {course.sections.map((section, sIdx) => (
            <div key={section.id} className="py-2">
              <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                Section {sIdx + 1}: {section.title}
              </div>

              <div className="space-y-0.5">
                {section.lessons.map((lesson) => {
                  const isActive = currentLesson?.id === lesson.id;
                  const isDone = completedLessonIds.includes(lesson.id);

                  return (
                    <button
                      key={lesson.id}
                      onClick={() => setCurrentLesson(lesson)}
                      className={`w-full flex items-center justify-between px-4 py-3 text-left transition ${
                        isActive
                          ? 'bg-indigo-600/20 text-white border-l-4 border-indigo-500'
                          : 'hover:bg-slate-800/40 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3 text-xs pr-2 flex-1 min-w-0">
                        <span
                          role="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleLessonComplete(lesson.id);
                          }}
                          className="p-0.5 hover:scale-125 transition rounded cursor-pointer shrink-0"
                          title={isDone ? 'Click to mark incomplete' : 'Click to mark completed'}
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-slate-600 hover:border-indigo-400 hover:bg-indigo-500/20" />
                          )}
                        </span>
                        <span className={`font-medium truncate ${isActive ? 'text-white font-bold' : ''}`}>
                          {lesson.title}
                        </span>
                      </div>

                      {lesson.videoDurationSeconds && (
                        <span className="text-[10px] text-slate-500 shrink-0">
                          {Math.round(lesson.videoDurationSeconds / 60)}m
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
