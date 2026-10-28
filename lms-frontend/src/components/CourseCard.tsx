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
    BEGINNER: 'bg-emerald-500/15 text-emerald-700 border-emerald-300/40',
    INTERMEDIATE: 'bg-blue-500/15 text-blue-700 border-blue-300/40',
    ADVANCED: 'bg-purple-500/15 text-purple-700 border-purple-300/40',
  }[course.level] || 'bg-slate-500/15 text-slate-700 border-slate-300/40';

  const discountPct = course.originalPrice && course.originalPrice > course.price
    ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)
    : 0;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full overflow-hidden">
      {/* Thumbnail Container */}
      <div className="h-52 bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 relative overflow-hidden flex items-center justify-center">
        {course.thumbnailUrl ? (
          <img
            src={course.thumbnailUrl}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="text-center p-6 text-white relative z-10">
            <div className="w-14 h-14 mx-auto mb-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg">
              <BookOpen className="w-7 h-7 text-indigo-300" />
            </div>
            <span className="text-[11px] font-bold tracking-widest uppercase text-indigo-200/90">
              SkillForge Elite
            </span>
          </div>
        )}

        {/* Dark Gradient Overlay for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 pointer-events-none" />

        {/* Hover Play Button Glow */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-md text-indigo-600 flex items-center justify-center shadow-xl transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </div>
        </div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center space-x-1.5">
          <span className={`px-2.5 py-1 text-[11px] font-bold rounded-lg backdrop-blur-md border ${levelBadge} shadow-sm`}>
            {course.level}
          </span>
        </div>

        {course.featured && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 text-[11px] font-extrabold rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md">
              <Sparkles className="w-3 h-3 text-slate-950 fill-current" />
              <span>Featured</span>
            </span>
          </div>
        )}

        {/* Bottom thumbnail duration bar */}
        {course.durationHours && (
          <div className="absolute bottom-3 left-3">
            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white text-[11px] font-medium">
              <Clock className="w-3 h-3 text-indigo-300" />
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
              <span>4.9</span>
              <span className="text-slate-400 font-normal">(1.2k+)</span>
            </div>

            {course.instructorName && (
              <span className="flex items-center space-x-1.5 text-slate-600 truncate max-w-[150px]">
                <User className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span className="truncate">{course.instructorName}</span>
              </span>
            )}
          </div>

          <h3 className="font-extrabold text-slate-900 text-lg leading-snug mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
            {course.title}
          </h3>

          <p className="text-slate-600 text-sm line-clamp-2 mb-5 leading-relaxed">
            {course.shortDescription || 'Master industry-relevant software skills with hands-on labs, guided projects, and quizzes.'}
          </p>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-black text-slate-900">
                ₹{course.price.toLocaleString('en-IN')}
              </span>
              {course.originalPrice && course.originalPrice > course.price && (
                <span className="text-xs text-slate-400 line-through">
                  ₹{course.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            {discountPct > 0 && (
              <span className="inline-block text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider">
                Save {discountPct}% OFF
              </span>
            )}
          </div>

          {isEnrolled ? (
            <Link
              to={`/learn/${course.id}`}
              className="inline-flex items-center space-x-1 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2.5 rounded-xl shadow-sm hover:shadow transition-all group-hover:translate-x-0.5"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          ) : (
            <Link
              to={`/courses/${course.slug}`}
              className="inline-flex items-center space-x-1 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2.5 rounded-xl shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all group-hover:translate-x-0.5"
            >
              <span>View Details</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
