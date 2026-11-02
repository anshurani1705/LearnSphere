import React from 'react';
import { Link } from 'react-router-dom';
import { CourseSummary } from '../types';
import { Clock, User, ArrowRight, BookOpen, Star, Sparkles, Play } from 'lucide-react';

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

  return (
    <div className="group bg-white rounded-xl border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col h-full overflow-hidden">
      {/* Thumbnail Container */}
      <div className="h-52 bg-slate-900 relative overflow-hidden flex items-center justify-center">
        {course.thumbnailUrl ? (
          <img
            src={course.thumbnailUrl}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
          />
        ) : (
          <div className="text-center p-6 text-white relative z-10">
            <div className="w-14 h-14 mx-auto mb-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-sm">
              <BookOpen className="w-7 h-7 text-blue-200" />
            </div>
            <span className="text-[11px] font-bold tracking-widest uppercase text-slate-300">
              SkillForge
            </span>
          </div>
        )}

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
          <span className={`px-2.5 py-1 text-[11px] font-semibold rounded-md border ${levelBadge} shadow-sm`}>
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
            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-slate-950/80 text-white text-[11px] font-medium border border-white/10">
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
