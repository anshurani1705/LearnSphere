import React from 'react';
import { Link } from 'react-router-dom';
import { CourseSummary } from '../types';

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
  const levelLabel = {
    BEGINNER: 'Beginner',
    INTERMEDIATE: 'Intermediate',
    ADVANCED: 'Advanced',
  }[course.level] || course.level;

  const thumbnail = getCourseThumbnail(course);

  return (
    <article className="group bg-white rounded-[8px] border border-[#E7E2DA] shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:border-[#D1C9BE] transition-colors flex flex-col h-full overflow-hidden">
      {/* 16:9 Image */}
      <Link to={isEnrolled ? `/learn/${course.id}` : `/courses/${course.slug}`} className="block relative aspect-video bg-[#FAF8F5] overflow-hidden">
        <img
          src={thumbnail}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80';
          }}
        />
      </Link>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata row: plain text tags */}
          <div className="flex items-center space-x-2 text-xs text-[#5F6368] mb-2">
            <span>{levelLabel}</span>
            {course.durationHours && (
              <>
                <span>&bull;</span>
                <span>{course.durationHours} hours</span>
              </>
            )}
            {course.instructorName && (
              <>
                <span>&bull;</span>
                <span className="truncate">{course.instructorName}</span>
              </>
            )}
          </div>

          <h3 className="font-serif font-semibold text-lg text-[#1F2328] group-hover:text-[#0E6B6B] transition-colors line-clamp-2 leading-snug mb-2">
            <Link to={isEnrolled ? `/learn/${course.id}` : `/courses/${course.slug}`}>
              {course.title}
            </Link>
          </h3>

          <p className="text-sm text-[#5F6368] line-clamp-2 leading-relaxed mb-4">
            {course.shortDescription || 'Hands-on curriculum focused on practical projects and fundamentals.'}
          </p>
        </div>

        {/* Pricing & Single Clear Action */}
        <div className="pt-3 border-t border-[#E7E2DA] flex items-center justify-between mt-auto">
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-base font-semibold text-[#1F2328]">
                ₹{course.price.toLocaleString('en-IN')}
              </span>
              {course.originalPrice && course.originalPrice > course.price && (
                <span className="text-xs text-[#8B949E] line-through">
                  ₹{course.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
          </div>

          {isEnrolled ? (
            <Link
              to={`/learn/${course.id}`}
              className="inline-flex items-center text-xs font-medium bg-[#E6F2F1] text-[#0E6B6B] hover:bg-[#0E6B6B] hover:text-white px-3.5 py-1.5 rounded-[6px] transition-colors"
            >
              Continue
            </Link>
          ) : (
            <Link
              to={`/courses/${course.slug}`}
              className="inline-flex items-center text-xs font-medium text-[#0E6B6B] hover:text-[#0A5555] px-2 py-1 transition-colors"
            >
              <span>View course</span>
              <span className="ml-1" aria-hidden="true">&rarr;</span>
            </Link>
          )}
        </div>
      </div>
    </article>
  );
};
