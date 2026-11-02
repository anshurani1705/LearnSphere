import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import { DashboardStats } from '../../types';
import { AdminNav } from '../../components/AdminNav';
import { Badge } from '../../components/ui/Badge';
import {
  Users,
  BookOpen,
  GraduationCap,
  Award,
  IndianRupee,
  Clock,
  CheckCircle2,
  Archive,
  EyeOff,
  ArrowRight,
  TrendingUp,
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
    <div className="flex-1 bg-[#FAFAF8] min-h-screen">
      <AdminNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-5 border-b border-[#E5E7EB]">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#20252B] tracking-tight">
              Administration Overview
            </h1>
            <p className="text-xs sm:text-sm text-[#697386] mt-1">
              Real-time telemetry and management for courses, students, orders, and credentials.
            </p>
          </div>
          <Link
            to="/admin/courses/create"
            className="inline-flex items-center space-x-1.5 bg-[#172B4D] hover:bg-[#0F1E36] text-white font-medium text-xs sm:text-sm px-4 py-2 rounded-lg shadow-sm transition-colors shrink-0"
          >
            <span>+ Create Course</span>
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#172B4D] border-t-transparent"></div>
          </div>
        ) : (
          <>
            {/* Top Primary Volume & Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-5 rounded-lg border border-[#E5E7EB] shadow-card">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-[#697386] uppercase tracking-wider">
                    Verified Revenue
                  </span>
                  <div className="w-8 h-8 bg-emerald-50 text-emerald-700 rounded-md flex items-center justify-center">
                    <IndianRupee className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-[#20252B]">
                  ₹{(stats?.totalRevenue || 0).toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-emerald-700 font-medium mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> Razorpay Processed
                </p>
              </div>

              <div className="bg-white p-5 rounded-lg border border-[#E5E7EB] shadow-card">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-[#697386] uppercase tracking-wider">
                    Registered Students
                  </span>
                  <div className="w-8 h-8 bg-slate-100 text-[#172B4D] rounded-md flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-[#20252B]">{stats?.totalStudents || 0}</p>
                <p className="text-xs text-[#697386] mt-1">Verified student accounts</p>
              </div>

              <div className="bg-white p-5 rounded-lg border border-[#E5E7EB] shadow-card">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-[#697386] uppercase tracking-wider">
                    Total Enrollments
                  </span>
                  <div className="w-8 h-8 bg-blue-50 text-blue-700 rounded-md flex items-center justify-center">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-[#20252B]">{stats?.totalEnrollments || 0}</p>
                <p className="text-xs text-[#697386] mt-1">Active course access records</p>
              </div>

              <div className="bg-white p-5 rounded-lg border border-[#E5E7EB] shadow-card">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-[#697386] uppercase tracking-wider">
                    Certificates Issued
                  </span>
                  <div className="w-8 h-8 bg-teal-50 text-[#287C78] rounded-md flex items-center justify-center">
                    <Award className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-[#20252B]">{stats?.totalCertificatesIssued || 0}</p>
                <p className="text-xs text-[#697386] mt-1">Verifiable completion credentials</p>
              </div>
            </div>

            {/* Course Status Summary Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
              <div className="bg-white p-4 rounded-lg border border-[#E5E7EB] shadow-subtle flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-[#697386]">Total Courses</p>
                  <p className="text-xl font-bold text-[#20252B] mt-0.5">{stats?.totalCourses || 0}</p>
                </div>
                <BookOpen className="w-5 h-5 text-slate-400" />
              </div>

              <div className="bg-white p-4 rounded-lg border border-[#E5E7EB] shadow-subtle flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-emerald-700">Published</p>
                  <p className="text-xl font-bold text-emerald-700 mt-0.5">{stats?.publishedCourses || 0}</p>
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>

              <div className="bg-white p-4 rounded-lg border border-[#E5E7EB] shadow-subtle flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-amber-700">Drafts</p>
                  <p className="text-xl font-bold text-amber-700 mt-0.5">{stats?.draftCourses || 0}</p>
                </div>
                <Clock className="w-5 h-5 text-amber-500" />
              </div>

              <div className="bg-white p-4 rounded-lg border border-[#E5E7EB] shadow-subtle flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-[#697386]">Unpublished</p>
                  <p className="text-xl font-bold text-slate-700 mt-0.5">{stats?.unpublishedCourses || 0}</p>
                </div>
                <EyeOff className="w-5 h-5 text-slate-400" />
              </div>

              <div className="bg-white p-4 rounded-lg border border-[#E5E7EB] shadow-subtle flex items-center justify-between col-span-2 sm:col-span-1">
                <div>
                  <p className="text-xs font-medium text-rose-700">Archived</p>
                  <p className="text-xl font-bold text-rose-700 mt-0.5">{stats?.archivedCourses || 0}</p>
                </div>
                <Archive className="w-5 h-5 text-rose-500" />
              </div>
            </div>

            {/* Course Performance Table */}
            <div className="bg-white rounded-lg border border-[#E5E7EB] shadow-card mb-8 overflow-hidden">
              <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-[#20252B]">Course Enrollment Breakdown</h2>
                  <p className="text-xs text-[#697386] mt-0.5">Live performance metrics per course from database</p>
                </div>
                <Link
                  to="/admin/courses"
                  className="text-xs font-medium text-[#172B4D] hover:underline flex items-center space-x-1"
                >
                  <span>Manage Courses</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm text-[#20252B]">
                  <thead className="bg-slate-50 text-[11px] uppercase font-semibold text-[#697386] border-b border-[#E5E7EB]">
                    <tr>
                      <th className="px-5 py-3">Course Title</th>
                      <th className="px-5 py-3">Category</th>
                      <th className="px-5 py-3">Price</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3 text-center">Enrollments</th>
                      <th className="px-5 py-3 text-right">Captured Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB]">
                    {stats?.coursePerformance && stats.coursePerformance.length > 0 ? (
                      stats.coursePerformance.map((c) => (
                        <tr key={c.courseId} className="hover:bg-slate-50/70 transition-colors">
                          <td className="px-5 py-3.5 font-medium text-[#20252B]">{c.title}</td>
                          <td className="px-5 py-3.5">
                            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs">
                              {c.category || 'General'}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 font-mono text-xs">₹{c.price.toLocaleString('en-IN')}</td>
                          <td className="px-5 py-3.5">
                            <Badge
                              variant={
                                c.status === 'PUBLISHED'
                                  ? 'success'
                                  : c.status === 'DRAFT'
                                  ? 'warning'
                                  : 'neutral'
                              }
                              size="sm"
                            >
                              {c.status}
                            </Badge>
                          </td>
                          <td className="px-5 py-3.5 text-center font-semibold text-[#20252B]">{c.enrollmentCount}</td>
                          <td className="px-5 py-3.5 text-right font-mono font-semibold text-emerald-700">
                            ₹{c.totalRevenue.toLocaleString('en-IN')}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-5 py-8 text-center text-[#697386] text-xs">
                          No course records found in database.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Orders Table */}
            <div className="bg-white rounded-lg border border-[#E5E7EB] shadow-card overflow-hidden">
              <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-[#20252B]">Recent Transactions</h2>
                  <p className="text-xs text-[#697386] mt-0.5">Latest enrollments and order statuses</p>
                </div>
                <Link
                  to="/admin/orders"
                  className="text-xs font-medium text-[#172B4D] hover:underline flex items-center space-x-1"
                >
                  <span>View All Orders</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm text-[#20252B]">
                  <thead className="bg-slate-50 text-[11px] uppercase font-semibold text-[#697386] border-b border-[#E5E7EB]">
                    <tr>
                      <th className="px-5 py-3">Order #</th>
                      <th className="px-5 py-3">Student</th>
                      <th className="px-5 py-3">Course</th>
                      <th className="px-5 py-3">Amount</th>
                      <th className="px-5 py-3">Provider</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB]">
                    {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                      stats.recentOrders.map((o) => (
                        <tr key={o.orderId} className="hover:bg-slate-50/70 transition-colors">
                          <td className="px-5 py-3.5 font-mono text-xs font-semibold text-[#20252B]">{o.orderNumber}</td>
                          <td className="px-5 py-3.5">
                            <div className="font-medium text-[#20252B]">{o.studentName}</div>
                            <div className="text-[11px] text-[#697386]">{o.studentEmail}</div>
                          </td>
                          <td className="px-5 py-3.5 text-[#20252B] max-w-xs truncate">{o.courseTitle}</td>
                          <td className="px-5 py-3.5 font-mono font-semibold text-[#20252B]">
                            ₹{o.amount.toLocaleString('en-IN')}
                          </td>
                          <td className="px-5 py-3.5 text-xs text-[#697386]">
                            {o.provider} ({o.paymentMode})
                          </td>
                          <td className="px-5 py-3.5">
                            <Badge
                              variant={
                                o.status === 'PAID'
                                  ? 'success'
                                  : o.status === 'PENDING'
                                  ? 'warning'
                                  : 'error'
                              }
                              size="sm"
                            >
                              {o.status}
                            </Badge>
                          </td>
                          <td className="px-5 py-3.5 text-right text-xs text-[#697386]">
                            {new Date(o.createdAt).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-5 py-8 text-center text-[#697386] text-xs">
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
