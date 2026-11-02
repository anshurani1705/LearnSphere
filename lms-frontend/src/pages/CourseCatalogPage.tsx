import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { CourseSummary } from '../types';
import { CourseCard } from '../components/CourseCard';
import { CourseCardSkeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { Search, X, BookOpen, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export const CourseCatalogPage: React.FC = () => {
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'duration'>('default');

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (searchTerm) params.q = searchTerm;
      if (selectedLevel) params.level = selectedLevel;

      const res = await api.get('/v1/courses', { params });
      if (res.data?.success) {
        let list: CourseSummary[] = res.data.data.content || [];

        // Client-side sorting for immediate responsive feel
        if (sortBy === 'price-asc') {
          list = [...list].sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price-desc') {
          list = [...list].sort((a, b) => b.price - a.price);
        } else if (sortBy === 'duration') {
          list = [...list].sort((a, b) => (b.durationHours || 0) - (a.durationHours || 0));
        }

        setCourses(list);
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
    }, 200);
    return () => clearTimeout(timer);
  }, [searchTerm, selectedLevel, sortBy]);

  return (
    <div className="flex-1 bg-[#FAFAF8] py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 sm:flex sm:items-end sm:justify-between pb-6 border-b border-[#E5E7EB]">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#20252B] tracking-tight">
              Course Catalog
            </h1>
            <p className="text-sm text-[#697386] mt-1 max-w-2xl leading-relaxed">
              Explore self-paced technical curricula with hands-on lesson walkthroughs, quizzes, and verified credentials.
            </p>
          </div>

          <div className="mt-4 sm:mt-0 text-xs font-medium text-[#697386] bg-white px-3 py-1.5 rounded-md border border-[#E5E7EB]">
            {loading ? 'Updating catalog...' : `${courses.length} courses available`}
          </div>
        </div>

        {/* Filter and Search Controls */}
        <div className="bg-white p-4 rounded-lg border border-[#E5E7EB] shadow-card mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by topic, language, title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-[#E5E7EB] rounded-md text-xs sm:text-sm text-[#20252B] focus:outline-none focus:ring-2 focus:ring-[#172B4D] focus:bg-white transition"
              aria-label="Search courses"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded"
                aria-label="Clear search query"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Level Filter and Sorting Controls */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Level Selector */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0">
              <span className="text-xs font-medium text-[#697386] mr-1 hidden sm:inline-flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" /> Level:
              </span>
              {[
                { id: '', label: 'All' },
                { id: 'BEGINNER', label: 'Beginner' },
                { id: 'INTERMEDIATE', label: 'Intermediate' },
                { id: 'ADVANCED', label: 'Advanced' },
              ].map((level) => {
                const active = selectedLevel === level.id;
                return (
                  <button
                    key={level.id}
                    onClick={() => setSelectedLevel(level.id)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                      active
                        ? 'bg-[#172B4D] text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {level.label}
                  </button>
                );
              })}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-1.5 ml-auto">
              <span className="text-xs font-medium text-[#697386] hidden lg:inline-flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" /> Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-50 border border-[#E5E7EB] text-xs text-[#20252B] rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#172B4D]"
                aria-label="Sort courses"
              >
                <option value="default">Default Order</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="duration">Longest Duration</option>
              </select>
            </div>
          </div>
        </div>

        {/* Course Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <CourseCardSkeleton key={i} />
            ))}
          </div>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<BookOpen className="w-6 h-6" />}
            title="No matching courses found"
            description="We couldn't find any courses matching your selected search query or level criteria. Try clearing the filters or searching for another topic."
            actionLabel="Reset All Filters"
            onAction={() => {
              setSearchTerm('');
              setSelectedLevel('');
              setSortBy('default');
            }}
          />
        )}
      </div>
    </div>
  );
};
