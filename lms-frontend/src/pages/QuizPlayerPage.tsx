import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { Quiz, QuizResult } from '../types';
import {
  HelpCircle,
  Award,
  CheckCircle,
  XCircle,
  Download,
  ArrowRight,
  ChevronLeft,
  AlertCircle,
  Clock,
  Loader2,
} from 'lucide-react';
import { downloadCertificatePdf } from '../utils/fileDownload';

export const QuizPlayerPage: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number[]>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingCert, setDownloadingCert] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/v1/quizzes/${quizId}`);
        if (res.data?.success) {
          setQuiz(res.data.data);
        } else {
          setError('Quiz not found');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load assessment questions.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  const handleOptionSelect = (questionId: number, optionId: number, isMultiple: boolean) => {
    if (result) return; // Locked once submitted

    setSelectedAnswers((prev) => {
      const current = prev[questionId] || [];
      if (isMultiple) {
        if (current.includes(optionId)) {
          return { ...prev, [questionId]: current.filter((id) => id !== optionId) };
        } else {
          return { ...prev, [questionId]: [...current, optionId] };
        }
      } else {
        return { ...prev, [questionId]: [optionId] };
      }
    });
  };

  const handleSubmitQuiz = async () => {
    if (!quiz) return;
    setSubmitting(true);
    try {
      const payload = {
        answers: quiz.questions.map((q) => ({
          questionId: q.id,
          selectedOptionIds: selectedAnswers[q.id] || [],
        })),
      };

      const res = await api.post(`/v1/quizzes/${quiz.id}/submit`, payload);
      if (res.data?.success) {
        setResult(res.data.data);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to submit quiz.');
    } finally {
      setSubmitting(false);
    }
  };

  const downloadCertificate = async (certId: string) => {
    setDownloadingCert(true);
    try {
      await downloadCertificatePdf(certId);
    } catch (err: any) {
      alert(err.message || 'Failed to download certificate.');
    } finally {
      setDownloadingCert(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-24 bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="flex-1 flex items-center justify-center py-24 p-4 bg-slate-50">
        <div className="bg-white p-8 rounded-xl border border-slate-200 text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold mb-2">Quiz Unavailable</h2>
          <p className="text-slate-600 text-sm mb-6">{error || 'Could not load quiz questions.'}</p>
          <Link to="/dashboard" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-50 py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to={`/learn/${quiz.courseId}`}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Course Player</span>
          </Link>
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
            <span>Passing Mark: {quiz.passingScore}%</span>
          </div>
        </div>

        {/* Title Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm mb-8">
          <div className="flex items-center space-x-3 text-indigo-600 mb-2">
            <HelpCircle className="w-6 h-6" />
            <span className="text-xs font-bold uppercase tracking-wider">Course Assessment</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">{quiz.title}</h1>
          <p className="text-slate-600 text-sm leading-relaxed">{quiz.description}</p>
        </div>

        {/* Result Banner (if submitted) */}
        {result && (
          <div
            className={`p-6 rounded-2xl border mb-8 shadow-sm ${
              result.passed
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : 'bg-rose-50 border-rose-200 text-rose-950'
            }`}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  {result.passed ? (
                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                  ) : (
                    <XCircle className="w-6 h-6 text-rose-600" />
                  )}
                  <h3 className="text-xl font-bold">
                    {result.passed ? 'Assessment Passed!' : 'Did Not Pass'}
                  </h3>
                </div>
                <p className="text-sm mt-1">
                  You scored <span className="font-extrabold">{result.score}%</span> ({result.earnedPoints}/
                  {result.totalPoints} points). Passing score required: {result.passingScore}%.
                </p>
              </div>

              {result.certificateId ? (
                <div className="shrink-0 space-y-2">
                  <button
                    onClick={() => downloadCertificate(result.certificateId!)}
                    disabled={downloadingCert}
                    className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-lg shadow transition disabled:opacity-60"
                  >
                    {downloadingCert ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    <span>{downloadingCert ? 'Downloading...' : 'Download Certificate'}</span>
                  </button>
                  <p className="text-[11px] text-emerald-700 font-semibold text-center">
                    All requirements satisfied!
                  </p>
                </div>
              ) : (
                result.passed && (
                  <Link
                    to={`/learn/${quiz.courseId}`}
                    className="inline-flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-lg shadow transition shrink-0"
                  >
                    <span>Back to Classroom</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )
              )}
            </div>
          </div>
        )}

        {/* Question Cards */}
        <div className="space-y-6">
          {quiz.questions.map((q, qIndex) => {
            const feedback = result?.feedback.find((f) => f.questionId === q.id);
            const isMultiple = q.questionType === 'MULTIPLE_CHOICE';

            return (
              <div key={q.id} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <span>Question {qIndex + 1} of {quiz.questions.length}</span>
                    <span>&bull;</span>
                    <span>{q.points} pt{q.points > 1 ? 's' : ''}</span>
                  </div>

                  {feedback && (
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-md flex items-center space-x-1 ${
                        feedback.correct ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {feedback.correct ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Correct</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Incorrect</span>
                        </>
                      )}
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">{q.questionText}</h3>
                {isMultiple && (
                  <p className="text-xs text-indigo-600 font-semibold">(Select all that apply)</p>
                )}

                {/* Answer Options */}
                <div className="space-y-2.5 pt-2">
                  {q.options.map((opt) => {
                    const isSelected = (selectedAnswers[q.id] || []).includes(opt.id);
                    const isAnswerCorrect = feedback?.correctOptionIds.includes(opt.id);

                    let optionBorder = 'border-slate-200 hover:border-indigo-400 bg-slate-50/50';
                    if (isSelected && !result) {
                      optionBorder = 'border-indigo-600 bg-indigo-50/40 text-indigo-900 font-semibold';
                    } else if (result) {
                      if (isAnswerCorrect) {
                        optionBorder = 'border-emerald-500 bg-emerald-50/40 text-emerald-900 font-semibold';
                      } else if (isSelected && !isAnswerCorrect) {
                        optionBorder = 'border-rose-400 bg-rose-50/40 text-rose-900';
                      }
                    }

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleOptionSelect(q.id, opt.id, isMultiple)}
                        disabled={!!result}
                        className={`w-full text-left p-4 rounded-xl border text-sm transition flex items-center justify-between ${optionBorder}`}
                      >
                        <span>{opt.optionText}</span>
                        <div
                          className={`w-5 h-5 rounded-${
                            isMultiple ? 'md' : 'full'
                          } border flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300'
                          }`}
                        >
                          {isSelected && (
                            <span className="text-xs font-bold">{isMultiple ? '✓' : '•'}</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Explanation feedback */}
                {feedback && feedback.explanation && (
                  <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
                    <span className="font-bold text-slate-900">Explanation: </span>
                    {feedback.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Submit Actions */}
        <div className="mt-8 flex justify-end">
          {result ? (
            <div className="flex space-x-4">
              {!result.passed && (
                <button
                  onClick={() => {
                    setResult(null);
                    setSelectedAnswers({});
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition shadow"
                >
                  Retake Assessment
                </button>
              )}
              <Link
                to={`/learn/${quiz.courseId}`}
                className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs px-6 py-3 rounded-xl transition"
              >
                Back to Classroom
              </Link>
            </div>
          ) : (
            <button
              onClick={handleSubmitQuiz}
              disabled={submitting}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-8 py-3.5 rounded-xl transition shadow-lg shadow-indigo-600/20 disabled:opacity-50"
            >
              {submitting ? 'Evaluating Answers...' : 'Submit Assessment'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
