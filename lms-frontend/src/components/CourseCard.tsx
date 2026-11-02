import React from 'react';
import { Link } from 'react-router-dom';
import { CourseSummary } from '../types';
import { Clock, User, ArrowRight, Star, Sparkles, Play } from 'lucide-react';

export const DEFAULT_COURSE_THUMBNAILS: Record<string, string> = {
  'full-stack-web-development-bootcamp':
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
  'data-science-with-python':
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
  'digital-marketing-masterclass':
    'https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=800&q=80',
  'cloud-architecture-with-aws':
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
};

export const getCourseThumbnail = (course: { thumbnailUrl?: string | null; slug?: string; title?: string }): string => {
  if (course.thumbnailUrl && course.thumbnailUrl.trim() !== '') {
    return course.thumbnailUrl;
  }
  if (course.slug && DEFAULT_COURSE_THUMBNAILS[course.slug]) {
    return DEFAULT_COURSE_THUMBNAILS[course.slug];
  }
  const title = (course.title || '').toLowerCase();
  if (title.includes('python') || title.includes('data') || title.includes('ai') || title.includes('machine')) {
    return DEFAULT_COURSE_THUMBNAILS['data-science-with-python'];
  }
  if (title.includes('market') || title.includes('seo') || title.includes('business') || title.includes('growth')) {
    return DEFAULT_COURSE_THUMBNAILS['digital-marketing-masterclass'];
  }
  if (title.includes('cloud') || title.includes('aws') || title.includes('devops') || title.includes('docker') || title.includes('kubernetes')) {
    return DEFAULT_COURSE_THUMBNAILS['cloud-architecture-with-aws'];
  }
  return DEFAULT_COURSE_THUMBNAILS['full-stack-web-development-bootcamp'];
};

interface CourseCardProps {
  course: CourseSummary;
  isEnrolled?: boolean;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, isEnrolled }) => {
  const levelBadge = {
    BEGINNER: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    INTERMEDIATE: 'bg-blue-50 text-blue-800 border-blue-200',
    ADVANCED: 'bg-purple-50 text-purple-800 border-purple-200',
  }[course.level] || 'bg-slate-100 text-slate-800 border-slate-200';

  const discountPct =
    course.originalPrice && course.originalPrice > course.price
      ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)
      : 0;

  const thumbnail = getCourseThumbnail(course);

  return (
    <div className="group bg-white rounded-xl border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col h-full overflow-hidden">
      {/* Thumbnail Container */}
      <div className="h-52 bg-slate-900 relative overflow-hidden flex items-center justify-center">
        <img
          src={thumbnail}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
          loading="lazy"
          onError={(e) => {
            // Safe fallback if an external image ever fails
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Subtle Dark Gradient Overlay for high text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20 pointer-events-none" />

        {/* Hover Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="w-11 h-11 rounded-full bg-white/95 text-slate-900 flex items-center justify-center shadow-md transform scale-90 group-hover:scale-100 transition-transform duration-200">
            <Play className="w-5 h-5 fill-current ml-0.5 text-slate-900" />
          </div>
        </div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center space-x-1.5">
          <span className={`px-2.5 py-1 text-[11px] font-semibold rounded-md border ${levelBadge} shadow-sm backdrop-blur-sm bg-white/90`}>
            {course.level}
          </span>
        </div>

        {course.featured && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 text-[11px] font-bold rounded-md bg-amber-400 text-slate-950 shadow-sm">
              <Sparkles className="w-3 h-3 text-slate-950 fill-current" />
              <span>Featured</span>
            </span>
          </div>
        )}

        {/* Bottom thumbnail duration bar */}
        {course.durationHours && (
          <div className="absolute bottom-3 left-3">
            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-slate-950/80 text-white text-[11px] font-medium border border-white/10 backdrop-blur-sm">
              <Clock className="w-3 h-3 text-slate-300" />
              <span>{course.durationHours} Hours</span>
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating and Instructor Bar */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2.5">
            <div className="flex items-center space-x-1 text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="text-slate-800 font-semibold">4.9</span>
              <span className="text-slate-500 font-normal">(1.2k+)</span>
            </div>

            {course.instructorName && (
              <span className="flex items-center space-x-1.5 text-slate-600 truncate max-w-[150px]">
                <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="truncate">{course.instructorName}</span>
              </span>
            )}
          </div>

          <h3 className="font-bold text-slate-900 text-base leading-snug mb-2 group-hover:text-[#1E3A8A] transition-colors line-clamp-2">
            {course.title}
          </h3>

          <p className="text-slate-600 text-sm line-clamp-2 mb-4 leading-relaxed">
            {course.shortDescription || 'Master industry-relevant software skills with hands-on labs, guided projects, and quizzes.'}
          </p>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between mt-auto">
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-xl font-bold text-slate-900">
                ₹{course.price.toLocaleString('en-IN')}
              </span>
              {course.originalPrice && course.originalPrice > course.price && (
                <span className="text-xs text-slate-400 line-through">
                  ₹{course.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            {discountPct > 0 && (
              <span className="inline-block text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                Save {discountPct}% OFF
              </span>
            )}
          </div>

          {isEnrolled ? (
            <Link
              to={`/learn/${course.id}`}
              className="inline-flex items-center space-x-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-lg shadow-sm transition-all"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <Link
              to={`/courses/${course.slug}`}
              className="inline-flex items-center space-x-1 text-xs font-semibold bg-[#1E3A8A] hover:bg-[#172554] text-white px-3.5 py-2 rounded-lg shadow-sm transition-all"
            >
              <span>View Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
