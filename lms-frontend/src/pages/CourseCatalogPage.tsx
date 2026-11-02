import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { CourseSummary } from '../types';
import { CourseCard } from '../components/CourseCard';
import { Search, X } from 'lucide-react';

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
    <div className="flex-1 bg-[#FAF8F5] py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 max-w-2xl">
          <h1 className="font-serif font-semibold text-3xl sm:text-4xl text-[#1F2328] tracking-tight">
            Explore courses
          </h1>
          <p className="text-sm sm:text-base text-[#5F6368] mt-2 leading-relaxed">
            Every course includes hands-on exercises, real code repositories, and an accredited certificate upon completion.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-[8px] border border-[#E7E2DA] shadow-[0_1px_2px_rgba(0,0,0,0.05)] mb-10 flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#5F6368] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by topic or skill..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-[#FAF8F5] border border-[#E7E2DA] rounded-[6px] text-sm text-[#1F2328] placeholder-[#5F6368] focus-ring transition"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#5F6368] hover:text-[#1F2328]"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Level Filter Chips */}
          <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto">
            <span className="text-xs text-[#5F6368] mr-1">Level:</span>
            {[
              { id: '', label: 'All levels' },
              { id: 'BEGINNER', label: 'Beginner' },
              { id: 'INTERMEDIATE', label: 'Intermediate' },
              { id: 'ADVANCED', label: 'Advanced' },
            ].map((level) => {
              const active = selectedLevel === level.id;
              return (
                <button
                  key={level.id}
                  onClick={() => setSelectedLevel(level.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-[6px] transition-colors shrink-0 ${
                    active
                      ? 'bg-[#0E6B6B] text-white'
                      : 'bg-white text-[#1F2328] border border-[#E7E2DA] hover:bg-[#FAF8F5]'
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
              <div key={i} className="h-96 rounded-[8px] bg-white border border-[#E7E2DA] p-4 flex flex-col justify-between">
                <div className="aspect-video bg-[#FAF8F5] rounded-[6px] animate-pulse"></div>
                <div className="space-y-3 py-4">
                  <div className="h-3 bg-[#FAF8F5] rounded w-1/4 animate-pulse"></div>
                  <div className="h-5 bg-[#FAF8F5] rounded w-3/4 animate-pulse"></div>
                  <div className="h-3 bg-[#FAF8F5] rounded w-full animate-pulse"></div>
                </div>
                <div className="h-8 bg-[#FAF8F5] rounded-[6px] animate-pulse"></div>
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
          <div className="bg-white rounded-[8px] border border-[#E7E2DA] p-10 text-center max-w-md mx-auto shadow-sm">
            <h3 className="font-serif font-semibold text-lg text-[#1F2328] mb-1">No courses found</h3>
            <p className="text-[#5F6368] text-sm mb-4">
              Try adjusting your search keywords or clearing the level filter.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedLevel('');
              }}
              className="bg-[#0E6B6B] text-white text-xs font-medium px-4 py-2 rounded-[6px] hover:bg-[#0A5555] transition-colors"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
