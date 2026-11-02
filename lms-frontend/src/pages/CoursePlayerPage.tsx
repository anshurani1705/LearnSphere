import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { CourseDetail, Lesson, Quiz } from '../types';
import {
  PlayCircle,
  FileText,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Award,
  HelpCircle,
  Download,
  AlertCircle,
  ListOrdered,
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
      const courseRes = await api.get(`/v1/courses/${courseId}`);
      if (courseRes.data?.success) {
        const c: CourseDetail = courseRes.data.data;
        c.isEnrolled = Boolean(c.isEnrolled ?? c.enrolled);
        setCourse(c);

        let firstLesson: Lesson | null = null;
        for (const s of c.sections || []) {
          if (s.lessons && s.lessons.length > 0) {
            firstLesson = s.lessons[0];
            break;
          }
        }
        setCurrentLesson(firstLesson);

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

      if (newCompleted && targetId === currentLesson?.id) {
        goToNextLesson();
      }
    } catch (err) {
      console.error('Failed to update lesson progress', err);
      setCompletedLessonIds(completedLessonIds);
    } finally {
      setUpdatingProgress(false);
    }
  };

  const handleMarkComplete = () => handleToggleLessonComplete();

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
        alert('Congratulations! Your certificate has been issued.');
      }
    } catch (err: any) {
      const msg = err.message || err.response?.data?.message || 'Course requirements not satisfied yet. Please complete all lessons and pass the assessment.';
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
      <div className="flex-1 flex items-center justify-center py-24 bg-[#1F2328] text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#0E6B6B] border-t-transparent"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex-1 flex items-center justify-center py-24 p-4 bg-[#FAF8F5]">
        <div className="bg-white p-8 rounded-[8px] border border-[#E7E2DA] text-center max-w-md shadow-sm">
          <AlertCircle className="w-8 h-8 text-[#C0392B] mx-auto mb-2" />
          <h2 className="font-serif font-semibold text-xl mb-1 text-[#1F2328]">Course not found</h2>
          <p className="text-[#5F6368] text-sm mb-4">The requested course could not be located.</p>
          <Link to="/courses" className="bg-[#0E6B6B] hover:bg-[#0A5555] text-white px-4 py-2 rounded-[6px] text-xs font-medium transition">
            Browse all courses
          </Link>
        </div>
      </div>
    );
  }

  const isUserEnrolled = Boolean(course?.isEnrolled ?? course?.enrolled);
  if (!isUserEnrolled) {
    return (
      <div className="flex-1 flex items-center justify-center py-24 p-4 bg-[#FAF8F5]">
        <div className="bg-white p-8 rounded-[8px] border border-[#E7E2DA] text-center max-w-md shadow-sm">
          <h2 className="font-serif font-semibold text-xl mb-1 text-[#1F2328]">Enrollment required</h2>
          <p className="text-[#5F6368] text-sm mb-6">
            You must be enrolled in <strong>{course.title}</strong> to view lessons.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={handleQuickEnroll}
              disabled={enrolling}
              className="bg-[#0E6B6B] hover:bg-[#0A5555] text-white px-4 py-2 rounded-[6px] text-xs font-medium transition disabled:opacity-50"
            >
              {enrolling ? 'Enrolling...' : '1-click demo enrollment'}
            </button>
            <Link
              to="/dashboard"
              className="border border-[#E7E2DA] text-[#1F2328] hover:bg-[#FAF8F5] px-4 py-2 rounded-[6px] text-xs font-medium transition text-center"
            >
              My learning
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isCurrentLessonCompleted = currentLesson ? completedLessonIds.includes(currentLesson.id) : false;
  const isCourseFullyCompleted = allLessons.length > 0 && completedLessonIds.length >= allLessons.length;

  return (
    <div className="flex-1 bg-[#1F2328] text-[#FAF8F5] flex flex-col lg:flex-row">
      {/* Main Classroom Player Area */}
      <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {/* Navigation Breadcrumb & Back */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <Link
            to="/dashboard"
            className="inline-flex items-center space-x-1.5 text-xs text-[#8B949E] hover:text-[#FAF8F5] transition"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
            <span className="text-[#484F58]">/</span>
            <span className="text-[#FAF8F5] font-medium truncate max-w-xs">{course.title}</span>
          </Link>

          <div className="flex items-center space-x-2">
            {currentLesson && (
              <button
                onClick={() => handleToggleLessonComplete()}
                disabled={updatingProgress}
                className={`inline-flex items-center space-x-1.5 text-xs font-medium px-3 py-1.5 rounded-[6px] transition ${
                  isCurrentLessonCompleted
                    ? 'bg-[#2F855A]/20 text-[#2F855A] border border-[#2F855A]/40'
                    : 'bg-[#0E6B6B] hover:bg-[#0A5555] text-white'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isCurrentLessonCompleted ? 'Completed' : 'Mark complete'}</span>
              </button>
            )}

            {certificateId ? (
              <button
                onClick={downloadCert}
                disabled={downloadingCert}
                className="inline-flex items-center space-x-1.5 bg-[#2F855A] hover:bg-[#276749] text-white text-xs font-medium px-3 py-1.5 rounded-[6px] transition disabled:opacity-60"
              >
                {downloadingCert ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                <span>{downloadingCert ? 'Downloading...' : 'Certificate'}</span>
              </button>
            ) : (
              isCourseFullyCompleted && (
                <button
                  onClick={handleClaimCertificate}
                  disabled={claiming}
                  className="inline-flex items-center space-x-1.5 bg-[#D9663A] hover:bg-[#C2552B] text-white text-xs font-medium px-3 py-1.5 rounded-[6px] transition disabled:opacity-50"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>{claiming ? 'Checking...' : 'Claim certificate'}</span>
                </button>
              )
            )}
          </div>
        </div>

        {/* Verified Certificate Ready Banner */}
        {certificateId && (
          <div className="mb-6 bg-[#161B22] border border-[#2F855A]/40 p-4 rounded-[8px] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-3 text-left">
              <Award className="w-5 h-5 text-[#2F855A] shrink-0" />
              <div>
                <p className="font-serif font-semibold text-[#FAF8F5] text-sm">Course completed & certified</p>
                <p className="text-xs text-[#8B949E]">Certificate #{certificateId}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={downloadCert}
                disabled={downloadingCert}
                className="bg-[#2F855A] hover:bg-[#276749] text-white text-xs font-medium px-3 py-1.5 rounded-[6px] transition"
              >
                Download PDF
              </button>
              <Link
                to={`/verify-certificate/${certificateId}`}
                className="bg-[#21262D] hover:bg-[#30363D] text-[#FAF8F5] text-xs font-medium px-3 py-1.5 rounded-[6px] border border-[#30363D] transition flex items-center space-x-1"
              >
                <span>Verify</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        )}

        {/* Video / Content Display */}
        {currentLesson ? (
          <div className="space-y-4">
            <div className="aspect-video bg-black rounded-[8px] overflow-hidden border border-[#30363D] flex items-center justify-center">
              {currentLesson.videoUrl ? (
                <iframe
                  src={currentLesson.videoUrl}
                  title={currentLesson.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="text-center p-6 max-w-sm">
                  <PlayCircle className="w-12 h-12 text-[#8B949E] mx-auto mb-2 opacity-50" />
                  <p className="font-serif font-semibold text-sm text-[#FAF8F5] mb-1">{currentLesson.title}</p>
                  <p className="text-xs text-[#8B949E]">Follow the lesson walkthrough.</p>
                </div>
              )}
            </div>

            {/* Lesson Title & Controls */}
            <div className="bg-[#161B22] p-4 rounded-[8px] border border-[#30363D] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs text-[#8B949E]">
                  Lesson {currentIndex + 1} of {allLessons.length}
                </p>
                <h2 className="font-serif font-semibold text-lg text-[#FAF8F5] mt-0.5">{currentLesson.title}</h2>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={goToPrevLesson}
                  disabled={currentIndex <= 0}
                  className="p-1.5 rounded-[6px] bg-[#21262D] hover:bg-[#30363D] disabled:opacity-30 transition text-[#FAF8F5]"
                  aria-label="Previous lesson"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={handleMarkComplete}
                  disabled={updatingProgress}
                  className={`px-3 py-1.5 rounded-[6px] text-xs font-medium transition ${
                    isCurrentLessonCompleted
                      ? 'bg-[#2F855A] text-white'
                      : 'bg-[#0E6B6B] hover:bg-[#0A5555] text-white'
                  }`}
                >
                  {isCurrentLessonCompleted ? 'Completed' : 'Mark complete & next'}
                </button>

                <button
                  onClick={goToNextLesson}
                  disabled={currentIndex >= allLessons.length - 1}
                  className="p-1.5 rounded-[6px] bg-[#21262D] hover:bg-[#30363D] disabled:opacity-30 transition text-[#FAF8F5]"
                  aria-label="Next lesson"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Lesson Text Notes */}
            {currentLesson.contentText && (
              <div className="bg-[#161B22] p-5 rounded-[8px] border border-[#30363D] text-[#8B949E] text-xs leading-relaxed whitespace-pre-line">
                <h3 className="font-sans font-medium text-[#FAF8F5] text-sm mb-2">Lesson notes</h3>
                {currentLesson.contentText}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20 text-[#8B949E] text-sm">Select a lesson to begin.</div>
        )}
      </div>

      {/* Curriculum Sidebar */}
      <div className="w-full lg:w-80 bg-[#161B22] border-t lg:border-t-0 lg:border-l border-[#30363D] flex flex-col shrink-0 lg:h-[calc(100vh-64px)]">
        {/* Progress header */}
        <div className="p-4 border-b border-[#30363D]">
          <div className="flex items-center justify-between text-xs text-[#8B949E] mb-2">
            <span>Course progress</span>
            <span className="text-[#FAF8F5] font-medium">
              {allLessons.length > 0
                ? Math.max(progressPct, Math.round((completedLessonIds.length / allLessons.length) * 100))
                : progressPct}%
            </span>
          </div>
          <div className="w-full bg-[#21262D] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#0E6B6B] h-full rounded-full transition-all duration-300"
              style={{
                width: `${
                  allLessons.length > 0
                    ? Math.max(progressPct, Math.round((completedLessonIds.length / allLessons.length) * 100))
                    : progressPct
                }%`,
              }}
            ></div>
          </div>
          <p className="text-[11px] text-[#6E7681] mt-2">
            {completedLessonIds.length} of {allLessons.length} lessons finished
          </p>
        </div>

        {/* Quizzes Section */}
        {quizzes.length > 0 && (
          <div className="p-3 border-b border-[#30363D] bg-[#21262D]/60">
            <p className="text-[11px] text-[#8B949E] mb-1.5 font-medium">Final assessment</p>
            <div className="space-y-1">
              {quizzes.map((q) => (
                <Link
                  key={q.id}
                  to={`/quiz/${q.id}`}
                  className="flex items-center justify-between p-2 rounded-[6px] bg-[#161B22] border border-[#30363D] hover:border-[#0E6B6B] text-xs transition"
                >
                  <span className="text-[#FAF8F5] truncate">{q.title}</span>
                  <span className="text-[11px] text-[#0E6B6B] ml-2 shrink-0">
                    {certificateId ? 'Passed' : `Pass ${q.passingScore}%`}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Lessons List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#21262D]">
          {course.sections.map((section, sIdx) => (
            <div key={section.id} className="py-2">
              <div className="px-3 py-1.5 text-[11px] font-medium text-[#6E7681]">
                Part {sIdx + 1}: {section.title}
              </div>

              <div className="space-y-0.5">
                {section.lessons.map((lesson) => {
                  const isActive = currentLesson?.id === lesson.id;
                  const isDone = completedLessonIds.includes(lesson.id);

                  return (
                    <button
                      key={lesson.id}
                      onClick={() => setCurrentLesson(lesson)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-left transition text-xs ${
                        isActive
                          ? 'bg-[#21262D] text-[#FAF8F5] border-l-2 border-[#0E6B6B]'
                          : 'hover:bg-[#21262D]/50 text-[#8B949E]'
                      }`}
                    >
                      <div className="flex items-center space-x-2 pr-2 flex-1 min-w-0">
                        <span
                          role="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleLessonComplete(lesson.id);
                          }}
                          className="shrink-0"
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#2F855A]" />
                          ) : (
                            <div className="w-3.5 h-3.5 rounded-full border border-[#484F58]" />
                          )}
                        </span>
                        <span className={`truncate ${isActive ? 'text-[#FAF8F5] font-medium' : ''}`}>
                          {lesson.title}
                        </span>
                      </div>

                      {lesson.videoDurationSeconds && (
                        <span className="text-[10px] text-[#484F58] shrink-0">
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
