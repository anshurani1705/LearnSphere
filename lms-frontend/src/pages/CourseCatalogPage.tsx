import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { CourseSummary } from '../types';
import { CourseCard } from '../components/CourseCard';
import { Search, Filter, BookOpen, X, Sparkles, Layers, SlidersHorizontal } from 'lucide-react';

export const CourseCatalogPage: React.FC = () => {
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('');

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (searchTerm) params.q = searchTerm;
      if (selectedLevel) params.level = selectedLevel;

      const res = await api.get('/v1/courses', { params });
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
    const timer = setTimeout(() => {
      fetchCourses();
    }, 250);
    return () => clearTimeout(timer);
  }, [searchTerm, selectedLevel]);

  return (
    <div className="flex-1 bg-slate-50/70 py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Banner */}
        <div className="mb-10 text-center md:text-left md:flex md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/60 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-3">
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              <span>Full Curriculum</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Explore Courses & Bootcamps
            </h1>
            <p className="text-slate-600 mt-2 text-sm sm:text-base max-w-2xl">
              Learn in-demand full-stack development, cloud engineering, and system design with hands-on assessments and verified credentials.
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex items-center justify-center md:justify-end">
            <span className="text-xs font-bold text-slate-500 bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-sm">
              {loading ? 'Searching catalog...' : `${courses.length} Courses Available`}
            </span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm mb-10 flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, technology, or topic..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
                aria-label="Clear search query"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Level Filter Chips */}
          <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-1 flex items-center">
              <SlidersHorizontal className="w-3.5 h-3.5 mr-1.5 text-indigo-500" /> Level:
            </span>
            {[
              { id: '', label: 'All Levels' },
              { id: 'BEGINNER', label: 'Beginner' },
              { id: 'INTERMEDIATE', label: 'Intermediate' },
              { id: 'ADVANCED', label: 'Advanced' },
            ].map((level) => {
              const active = selectedLevel === level.id;
              return (
                <button
                  key={level.id}
                  onClick={() => setSelectedLevel(level.id)}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all shrink-0 ${
                    active
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'bg-slate-100/80 text-slate-700 hover:bg-slate-200/80'
                  }`}
                >
                  {level.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Course Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-96 rounded-2xl bg-white border border-slate-200 p-4 shadow-sm flex flex-col justify-between">
                <div className="h-44 bg-slate-200 rounded-xl animate-pulse"></div>
                <div className="space-y-3 py-4">
                  <div className="h-4 bg-slate-200 rounded w-1/3 animate-pulse"></div>
                  <div className="h-6 bg-slate-200 rounded w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-slate-200 rounded w-full animate-pulse"></div>
                </div>
                <div className="h-10 bg-slate-200 rounded-xl animate-pulse"></div>
              </div>
            ))}
          </div>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">No courses match your filter</h3>
            <p className="text-slate-500 text-sm mb-6">
              Try adjusting your search query or level filters to view other available tracks.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedLevel('');
              }}
              className="bg-indigo-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition shadow-md shadow-indigo-600/20"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
