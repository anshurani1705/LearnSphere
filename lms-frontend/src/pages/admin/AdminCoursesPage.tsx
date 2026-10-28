import React, { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { CourseDetail, Category } from '../../types';
import { AdminNav } from '../../components/AdminNav';
import {
  BookOpen,
  Plus,
  CheckCircle,
  Clock,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Archive,
  Search,
  Filter,
  IndianRupee,
  Layers,
  Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminCoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<CourseDetail[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params: any = { size: 50 };
      if (statusFilter !== 'ALL') params.status = statusFilter;
      if (categoryFilter !== 'ALL') params.category = categoryFilter;
      if (searchQuery.trim()) params.q = searchQuery.trim();

      const res = await api.get('/v1/admin/courses', { params });
      if (res.data?.success) {
        setCourses(res.data.data.content);
      }
    } catch (err) {
      console.error('Failed to load courses', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api.get('/v1/admin/categories');
        if (res.data?.success) setCategories(res.data.data);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    fetchCats();
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [statusFilter, categoryFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCourses();
  };

  const handleSetStatus = async (courseId: number, nextStatus: string) => {
    try {
      await api.patch(`/v1/admin/courses/${courseId}/status?status=${nextStatus}`);
      fetchCourses();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update course status.');
    }
  };

  const handleDeleteCourse = async (courseId: number, title: string) => {
    if (!window.confirm(`Are you sure you want to delete course "${title}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/v1/admin/courses/${courseId}`);
      fetchCourses();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Cannot delete course. Please archive it instead.');
    }
  };

  return (
    <div className="flex-1 bg-slate-50 min-h-screen pb-16">
      <AdminNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Course Management</h1>
            <p className="text-slate-500 text-sm mt-1">
              Manage all company-owned courses, set prices, publish or archive content, and manage curriculum modules.
            </p>
          </div>
          <Link
            to="/admin/courses/create"
            className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-4 py-2.5 rounded-xl shadow transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create Course</span>
          </Link>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto scrollbar-none">
            {['ALL', 'PUBLISHED', 'DRAFT', 'UNPUBLISHED', 'ARCHIVED'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                  statusFilter === st
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Search & Category Filter */}
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-700 bg-white"
            >
              <option value="ALL">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>

            <form onSubmit={handleSearchSubmit} className="relative flex-1 md:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </form>
          </div>
        </div>

        {/* Courses Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : courses.length === 0 ? (
            <div className="p-12 text-center">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">No Courses Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                No company courses match the selected filters. Create a new course or adjust your search.
              </p>
              <Link
                to="/admin/courses/create"
                className="inline-flex items-center space-x-1.5 bg-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-xl"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Course</span>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">Course</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4 text-center">Students</th>
                    <th className="px-6 py-4 text-center">Sections</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {courses.map((course) => (
                    <tr key={course.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          {course.thumbnailUrl ? (
                            <img
                              src={course.thumbnailUrl}
                              alt=""
                              className="w-12 h-9 object-cover rounded-lg border border-slate-200"
                            />
                          ) : (
                            <div className="w-12 h-9 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                              <BookOpen className="w-4 h-4" />
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-slate-900 hover:text-indigo-600 transition">
                              <Link to={`/admin/courses/${course.id}/edit`}>{course.title}</Link>
                            </div>
                            <div className="text-xs text-slate-400 flex items-center space-x-2 mt-0.5">
                              <span>{course.instructorName || 'SkillForge Faculty'}</span>
                              <span>•</span>
                              <span>{course.level}</span>
                              {course.featured && (
                                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.2 rounded">
                                  Featured
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md text-xs font-semibold">
                          {course.category || 'General'}
                        </span>
                      </td>

                      <td className="px-6 py-4 font-mono font-bold text-slate-900">
                        ₹{course.price.toLocaleString('en-IN')}
                        {course.originalPrice && course.originalPrice > course.price && (
                          <span className="block text-xs font-normal text-slate-400 line-through">
                            ₹{course.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-center font-bold text-slate-800">
                        {course.enrollmentCount || 0}
                      </td>

                      <td className="px-6 py-4 text-center text-xs font-mono text-slate-600">
                        {course.sections?.length || 0}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            course.status === 'PUBLISHED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : course.status === 'DRAFT'
                              ? 'bg-amber-100 text-amber-800'
                              : course.status === 'UNPUBLISHED'
                              ? 'bg-slate-200 text-slate-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {course.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            to={`/admin/courses/${course.id}/edit`}
                            title="Edit Course & Curriculum"
                            className="p-1.5 text-slate-500 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>

                          {course.slug && (
                            <a
                              href={`/courses/${course.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              title="Public Preview"
                              className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition"
                            >
                              <Eye className="w-4 h-4" />
                            </a>
                          )}

                          {/* Quick Status Changers */}
                          {course.status !== 'PUBLISHED' && (
                            <button
                              onClick={() => handleSetStatus(course.id, 'PUBLISHED')}
                              title="Publish Course"
                              className="p-1.5 text-slate-500 hover:text-emerald-600 rounded-lg hover:bg-emerald-50 transition"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}

                          {course.status === 'PUBLISHED' && (
                            <button
                              onClick={() => handleSetStatus(course.id, 'UNPUBLISHED')}
                              title="Unpublish Course"
                              className="p-1.5 text-slate-500 hover:text-amber-600 rounded-lg hover:bg-amber-50 transition"
                            >
                              <EyeOff className="w-4 h-4" />
                            </button>
                          )}

                          {course.status !== 'ARCHIVED' && (
                            <button
                              onClick={() => handleSetStatus(course.id, 'ARCHIVED')}
                              title="Archive Course"
                              className="p-1.5 text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
                            >
                              <Archive className="w-4 h-4" />
                            </button>
                          )}

                          <button
                            onClick={() => handleDeleteCourse(course.id, course.title)}
                            title="Delete Course (if no enrollments)"
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
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
