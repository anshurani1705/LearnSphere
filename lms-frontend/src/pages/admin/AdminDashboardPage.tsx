import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import { DashboardStats } from '../../types';
import { AdminNav } from '../../components/AdminNav';
import {
  Users,
  BookOpen,
  GraduationCap,
  CreditCard,
  Award,
  IndianRupee,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Archive,
  EyeOff,
  Layers,
  ArrowRight,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/v1/admin/dashboard');
        if (res.data?.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch admin stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="flex-1 bg-slate-50 min-h-screen">
      <AdminNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Company Administrator Dashboard</h1>
            <p className="text-slate-500 text-sm mt-1">
              Live enterprise management for company-owned courses, students, orders, and verified completion credentials.
            </p>
          </div>
          <Link
            to="/admin/courses/create"
            className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-4 py-2.5 rounded-xl shadow transition"
          >
            <span>+ Create New Course</span>
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <>
            {/* Top Revenue & Primary Volume Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Verified Revenue</span>
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                    <IndianRupee className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-3xl font-extrabold text-slate-900">
                  ₹{(stats?.totalRevenue || 0).toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center">
                  <TrendingUp className="w-3.5 h-3.5 mr-1" /> Captured via Razorpay Gateway
                </p>
                {stats?.mockRevenue !== undefined && stats.mockRevenue > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg">
                    <span className="font-semibold">🧪 Dev Mock Volume:</span>
                    <span className="font-bold font-mono">₹{stats.mockRevenue.toLocaleString('en-IN')}</span>
                  </div>
                )}
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Registered Students</span>
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-3xl font-extrabold text-slate-900">{stats?.totalStudents || 0}</p>
                <p className="text-xs text-slate-500 mt-1">Verified student accounts in MySQL</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Enrollments</span>
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-3xl font-extrabold text-slate-900">{stats?.totalEnrollments || 0}</p>
                <p className="text-xs text-slate-500 mt-1">Active course access records</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Certificates Issued</span>
                  <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600">
                    <Award className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-3xl font-extrabold text-slate-900">{stats?.totalCertificatesIssued || 0}</p>
                <p className="text-xs text-slate-500 mt-1">Cryptographically authenticated PDFs</p>
              </div>
            </div>

            {/* Course & Transaction Breakdown Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Total Courses</p>
                  <p className="text-2xl font-black text-slate-900 mt-0.5">{stats?.totalCourses || 0}</p>
                </div>
                <BookOpen className="w-7 h-7 text-indigo-500" />
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-emerald-600 uppercase">Published</p>
                  <p className="text-2xl font-black text-emerald-700 mt-0.5">{stats?.publishedCourses || 0}</p>
                </div>
                <CheckCircle2 className="w-7 h-7 text-emerald-500" />
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-amber-600 uppercase">Drafts</p>
                  <p className="text-2xl font-black text-amber-700 mt-0.5">{stats?.draftCourses || 0}</p>
                </div>
                <Clock className="w-7 h-7 text-amber-500" />
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Unpublished</p>
                  <p className="text-2xl font-black text-slate-700 mt-0.5">{stats?.unpublishedCourses || 0}</p>
                </div>
                <EyeOff className="w-7 h-7 text-slate-400" />
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-rose-500 uppercase">Archived</p>
                  <p className="text-2xl font-black text-rose-700 mt-0.5">{stats?.archivedCourses || 0}</p>
                </div>
                <Archive className="w-7 h-7 text-rose-400" />
              </div>
            </div>

            {/* Course Performance Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mb-8 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Course Performance & Enrollment Statistics</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Real-time statistics per company course from MySQL</p>
                </div>
                <Link
                  to="/admin/courses"
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
                >
                  <span>Manage All Courses</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3.5">Course Title</th>
                      <th className="px-6 py-3.5">Category</th>
                      <th className="px-6 py-3.5">Price</th>
                      <th className="px-6 py-3.5">Status</th>
                      <th className="px-6 py-3.5 text-center">Enrollments</th>
                      <th className="px-6 py-3.5 text-right">Captured Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {stats?.coursePerformance && stats.coursePerformance.length > 0 ? (
                      stats.coursePerformance.map((c) => (
                        <tr key={c.courseId} className="hover:bg-slate-50 transition">
                          <td className="px-6 py-4 font-semibold text-slate-900">{c.title}</td>
                          <td className="px-6 py-4">
                            <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md text-xs font-medium">
                              {c.category || 'General'}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-mono">₹{c.price.toLocaleString('en-IN')}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                c.status === 'PUBLISHED'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : c.status === 'DRAFT'
                                  ? 'bg-amber-100 text-amber-800'
                                  : c.status === 'UNPUBLISHED'
                                  ? 'bg-slate-200 text-slate-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {c.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center font-bold text-slate-800">{c.enrollmentCount}</td>
                          <td className="px-6 py-4 text-right font-mono font-bold text-emerald-700">
                            ₹{c.totalRevenue.toLocaleString('en-IN')}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-slate-400 text-sm">
                          No course records found in database.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Orders Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Recent Checkout Orders</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Latest purchase attempts and captured transactions</p>
                </div>
                <Link
                  to="/admin/orders"
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
                >
                  <span>View All Orders</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3.5">Order Number</th>
                      <th className="px-6 py-3.5">Student</th>
                      <th className="px-6 py-3.5">Course</th>
                      <th className="px-6 py-3.5">Amount</th>
                      <th className="px-6 py-3.5">Provider</th>
                      <th className="px-6 py-3.5">Status</th>
                      <th className="px-6 py-3.5">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                      stats.recentOrders.map((o) => (
                        <tr key={o.orderId} className="hover:bg-slate-50 transition">
                          <td className="px-6 py-4 font-mono text-xs font-bold text-slate-800">{o.orderNumber}</td>
                          <td className="px-6 py-4">
                            <div className="font-semibold text-slate-900">{o.studentName}</div>
                            <div className="text-xs text-slate-400">{o.studentEmail}</div>
                          </td>
                          <td className="px-6 py-4 text-slate-800">{o.courseTitle}</td>
                          <td className="px-6 py-4 font-mono font-bold text-slate-900">₹{o.amount.toLocaleString('en-IN')}</td>
                          <td className="px-6 py-4">
                            <span className="text-xs font-mono font-medium text-slate-600">
                              {o.provider} ({o.paymentMode})
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                o.status === 'PAID'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : o.status === 'PENDING'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {o.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-400">
                            {new Date(o.createdAt).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-6 py-8 text-center text-slate-400 text-sm">
                          No recent transactions recorded.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
