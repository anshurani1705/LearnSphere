import React from 'react';
import { Link } from 'react-router-dom';
import { CourseSummary } from '../types';
import { Clock, User, ArrowRight, BookOpen } from 'lucide-react';
import { Badge } from './ui/Badge';

interface CourseCardProps {
  course: CourseSummary;
  isEnrolled?: boolean;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, isEnrolled }) => {
  const levelVariant = {
    BEGINNER: 'success',
    INTERMEDIATE: 'teal',
    ADVANCED: 'primary',
  }[course.level] as 'success' | 'teal' | 'primary' || 'neutral';

  const formatPrice = (price: number, originalPrice?: number) => {
    if (price === 0) {
      return <span className="text-emerald-700 font-bold text-base">Free</span>;
    }
    return (
      <div className="flex items-baseline gap-2">
        <span className="text-[#20252B] font-bold text-base sm:text-lg">
          ₹{price.toLocaleString('en-IN')}
        </span>
        {originalPrice && originalPrice > price && (
          <span className="text-xs text-[#697386] line-through">
            ₹{originalPrice.toLocaleString('en-IN')}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="group bg-white rounded-lg border border-[#E5E7EB] hover:border-slate-300 shadow-card hover:shadow-card-hover transition-all duration-200 flex flex-col h-full overflow-hidden">
      {/* Thumbnail */}
      <Link to={`/courses/${course.slug}`} className="block relative aspect-video bg-slate-100 overflow-hidden">
        {course.thumbnailUrl ? (
          <img
            src={course.thumbnailUrl}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-4">
            <BookOpen className="w-8 h-8 text-slate-400 mb-1" />
            <span className="text-xs font-medium text-slate-500">SkillForge Course</span>
          </div>
        )}

        {/* Level Badge in top corner */}
        <div className="absolute top-3 left-3">
          <Badge variant={levelVariant} size="sm">
            {course.level}
          </Badge>
        </div>
      </Link>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata Row: Instructor & Duration */}
          <div className="flex items-center justify-between text-xs text-[#697386] mb-2.5">
            {course.instructorName ? (
              <span className="flex items-center gap-1.5 truncate max-w-[160px]">
                <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{course.instructorName}</span>
              </span>
            ) : (
              <span className="text-slate-400">SkillForge Instructor</span>
            )}

            {course.durationHours ? (
              <span className="flex items-center gap-1 shrink-0">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{course.durationHours} hrs</span>
              </span>
            ) : null}
          </div>

          {/* Title */}
          <h3 className="font-semibold text-base text-[#20252B] leading-snug mb-2 group-hover:text-[#172B4D] transition-colors line-clamp-2">
            <Link to={`/courses/${course.slug}`}>
              {course.title}
            </Link>
          </h3>

          {/* Short description */}
          {course.shortDescription && (
            <p className="text-xs text-[#697386] line-clamp-2 leading-relaxed mb-4">
              {course.shortDescription}
            </p>
          )}
        </div>

        {/* Footer: Price & Action */}
        <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-between mt-auto">
          <div>{formatPrice(course.price, course.originalPrice)}</div>

          {isEnrolled ? (
            <Link
              to={`/learn/${course.id}`}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#287C78] hover:text-[#1A5250] transition-colors"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <Link
              to={`/courses/${course.slug}`}
              className="inline-flex items-center gap-1 text-xs font-medium text-[#172B4D] hover:text-[#0F1E36] transition-colors"
            >
              <span>View Course</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
