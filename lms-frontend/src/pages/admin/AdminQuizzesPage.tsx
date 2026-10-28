import React, { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { Quiz } from '../../types';
import { AdminNav } from '../../components/AdminNav';
import { FileQuestion, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminQuizzesPage: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await api.get('/v1/admin/quizzes');
        if (res.data?.success) {
          setQuizzes(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load quizzes', err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  return (
    <div className="flex-1 bg-slate-50 min-h-screen pb-16">
      <AdminNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Assessments & Quizzes</h1>
          <p className="text-slate-500 text-sm mt-1">
            Review server-evaluated course quizzes, passing benchmarks, and certificate eligibility rules.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : quizzes.length === 0 ? (
            <div className="p-12 text-center">
              <FileQuestion className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">No Quizzes Configured</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                Quizzes can be attached to company courses or individual lessons to assess learner competencies.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">Quiz Title</th>
                    <th className="px-6 py-4">Description</th>
                    <th className="px-6 py-4 text-center">Passing Score</th>
                    <th className="px-6 py-4 text-center">Time Limit</th>
                    <th className="px-6 py-4 text-center">Mandatory</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {quizzes.map((quiz) => (
                    <tr key={quiz.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4 font-bold text-slate-900 flex items-center space-x-2">
                        <FileQuestion className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                        <span>{quiz.title}</span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500 max-w-sm truncate">{quiz.description || '—'}</td>
                      <td className="px-6 py-4 text-center font-mono font-bold text-slate-900">
                        {quiz.passingScore}%
                      </td>
                      <td className="px-6 py-4 text-center font-mono text-xs text-slate-600">
                        {quiz.timeLimitMinutes ? `${quiz.timeLimitMinutes} mins` : 'Untimed'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {quiz.required ? (
                          <span className="bg-rose-100 text-rose-800 text-xs font-bold px-2 py-0.5 rounded-full">
                            Required for Cert
                          </span>
                        ) : (
                          <span className="bg-slate-100 text-slate-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                            Optional
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
