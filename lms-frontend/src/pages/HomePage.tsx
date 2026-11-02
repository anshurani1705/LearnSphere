import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { CourseSummary } from '../types';
import { CourseCard } from '../components/CourseCard';
import { ChevronDown, ArrowRight } from 'lucide-react';

export const HomePage: React.FC = () => {
  const [featuredCourses, setFeaturedCourses] = useState<CourseSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/v1/courses/featured');
        if (res.data?.success) {
          setFeaturedCourses(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load featured courses', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const disciplines = [
    { name: 'Full-stack development', count: '12 courses', path: '/courses' },
    { name: 'Data science & analytics', count: '8 courses', path: '/courses?level=INTERMEDIATE' },
    { name: 'Cloud & systems architecture', count: '6 courses', path: '/courses?level=ADVANCED' },
    { name: 'Backend engineering & APIs', count: '7 courses', path: '/courses' },
    { name: 'Foundations & computer science', count: '5 courses', path: '/courses?level=BEGINNER' },
  ];

  const faqs = [
    {
      q: 'How are completion certificates issued?',
      a: 'Certificates are generated automatically once you finish all required lessons in a course and achieve 70% or higher on the end-of-module assessment. Each certificate has a unique ID that anyone can look up publicly on our verification page.',
    },
    {
      q: 'Are courses live or self-paced?',
      a: 'All courses are completely self-paced. You receive lifetime access to video demonstrations, project walk-throughs, and quizzes, allowing you to learn around your own work schedule.',
    },
    {
      q: 'What payment options are supported?',
      a: 'We process payments securely through Razorpay, supporting UPI (Google Pay, PhonePe, Paytm), net banking from all major Indian banks, and debit/credit cards.',
    },
    {
      q: 'Can employers verify my credential directly?',
      a: 'Yes. Every certificate has a public verification link (/verify-certificate) where recruiters can enter the ID to verify the completion date, instructor name, and course syllabus without needing an account.',
    },
  ];

  return (
    <div className="flex-1 bg-[#FAF8F5]">
      {/* Editorial Hero Section */}
      <section className="py-16 sm:py-20 lg:py-24 border-b border-[#E7E2DA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column: Editorial Headline & Actions */}
            <div className="lg:col-span-7">
              <h1 className="font-serif font-semibold text-3xl sm:text-4xl lg:text-[46px] text-[#1F2328] tracking-tight leading-[1.18] mb-5">
                Learn to build real software, one project at a time.
              </h1>

              <p className="text-base sm:text-lg text-[#5F6368] leading-relaxed max-w-xl mb-8">
                Carefully structured courses in web development, data science, and cloud systems with guided code challenges and practical milestones.
              </p>

              <div className="flex flex-wrap items-center gap-4 mb-8">
                <Link
                  to="/courses"
                  className="bg-[#D9663A] hover:bg-[#C2552B] text-white px-6 py-3 rounded-[6px] font-medium text-sm transition-colors shadow-sm focus-ring"
                >
                  Explore courses
                </Link>

                <Link
                  to="/verify-certificate"
                  className="text-sm font-medium text-[#1F2328] hover:text-[#0E6B6B] transition-colors py-3 px-2 inline-flex items-center space-x-1"
                >
                  <span>Verify a certificate</span>
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>

              {/* Honest Social Proof */}
              <div className="pt-6 border-t border-[#E7E2DA] flex items-center space-x-3 text-xs text-[#5F6368]">
                <span className="w-2 h-2 rounded-full bg-[#2F855A]"></span>
                <span>Over 2,300 learners advancing their craft</span>
                <span>&bull;</span>
                <span>38 practical projects</span>
              </div>
            </div>

            {/* Right Column: Warm, Authentic Photographic Visual */}
            <div className="lg:col-span-5">
              <div className="rounded-[8px] border border-[#E7E2DA] overflow-hidden bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80"
                  alt="Students collaborating on modern programming projects"
                  className="w-full h-72 sm:h-80 object-cover"
                />
                <div className="p-4 bg-white border-t border-[#E7E2DA] flex items-center justify-between text-xs text-[#5F6368]">
                  <span>Project-based learning curriculum</span>
                  <span className="text-[#0E6B6B] font-medium">Self-paced with mentor support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Career Tracks Section: Simple List & Subtle Hover */}
      <section className="py-12 border-b border-[#E7E2DA] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <h2 className="font-serif font-semibold text-xl text-[#1F2328]">
              Browse by discipline
            </h2>
            <Link to="/courses" className="text-xs font-medium text-[#0E6B6B] hover:underline mt-1 sm:mt-0">
              View complete catalog &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {disciplines.map((item, i) => (
              <Link
                key={i}
                to={item.path}
                className="group p-3.5 rounded-[8px] border border-[#E7E2DA] bg-[#FAF8F5] hover:bg-white hover:border-[#D1C9BE] transition-colors"
              >
                <p className="font-medium text-sm text-[#1F2328] group-hover:text-[#0E6B6B] group-hover:underline transition-colors">
                  {item.name}
                </p>
                <p className="text-xs text-[#5F6368] mt-1">{item.count}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-10">
          <div>
            <h2 className="font-serif font-semibold text-2xl sm:text-3xl text-[#1F2328] tracking-tight">
              Featured courses
            </h2>
            <p className="text-sm text-[#5F6368] mt-1 max-w-xl">
              Practical curricula designed to take you from core principles to production-ready applications.
            </p>
          </div>
          <Link
            to="/courses"
            className="text-xs font-medium text-[#0E6B6B] hover:text-[#0A5555] mt-3 sm:mt-0"
          >
            All courses &rarr;
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
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
        ) : featuredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-[8px] border border-[#E7E2DA] p-8 max-w-md mx-auto">
            <p className="text-sm text-[#5F6368]">No featured courses at the moment.</p>
            <Link to="/courses" className="mt-3 inline-block text-xs font-medium text-[#0E6B6B] hover:underline">
              Browse full course catalog &rarr;
            </Link>
          </div>
        )}
      </section>

      {/* How It Works: Quiet Editorial Breakdown */}
      <section className="py-16 sm:py-20 border-t border-[#E7E2DA] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mb-12">
            <h2 className="font-serif font-semibold text-2xl sm:text-3xl text-[#1F2328] tracking-tight">
              How learning on SkillForge works
            </h2>
            <p className="text-sm text-[#5F6368] mt-1.5">
              Education should respect your time and focus on durable understanding.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <div className="space-y-2">
              <span className="font-serif text-2xl text-[#0E6B6B] font-semibold">01</span>
              <h3 className="font-serif font-semibold text-base text-[#1F2328]">
                Real projects over passive lectures
              </h3>
              <p className="text-sm text-[#5F6368] leading-relaxed">
                Every track revolves around building complete, working applications. You write code from the first lesson instead of simply watching videos.
              </p>
            </div>

            <div className="space-y-2">
              <span className="font-serif text-2xl text-[#0E6B6B] font-semibold">02</span>
              <h3 className="font-serif font-semibold text-base text-[#1F2328]">
                Milestone assessments with instant feedback
              </h3>
              <p className="text-sm text-[#5F6368] leading-relaxed">
                Quizzes and exercises test edge cases, logic, and common pitfalls so you can verify your grasp before advancing to the next module.
              </p>
            </div>

            <div className="space-y-2">
              <span className="font-serif text-2xl text-[#0E6B6B] font-semibold">03</span>
              <h3 className="font-serif font-semibold text-base text-[#1F2328]">
                Accredited verifiable credentials
              </h3>
              <p className="text-sm text-[#5F6368] leading-relaxed">
                When you pass a course, you receive a tamper-proof certificate with a public link that can be placed directly on your CV or LinkedIn profile.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Honest Learner Reflections */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mb-10">
          <h2 className="font-serif font-semibold text-2xl sm:text-3xl text-[#1F2328] tracking-tight">
            Notes from learners
          </h2>
          <p className="text-sm text-[#5F6368] mt-1">
            Feedback from engineers who used SkillForge to build projects and transition careers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-[8px] border border-[#E7E2DA] flex flex-col justify-between shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <p className="text-sm text-[#1F2328] leading-relaxed mb-6 font-normal">
              "The Full-Stack Bootcamp explained the why behind architecture decisions rather than just syntax. The portfolio project I built during the course helped me land my junior role."
            </p>
            <div className="pt-3 border-t border-[#E7E2DA]">
              <p className="font-medium text-xs text-[#1F2328]">Aman Kumar</p>
              <p className="text-[11px] text-[#5F6368]">Software Engineer, Bengaluru</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[8px] border border-[#E7E2DA] flex flex-col justify-between shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <p className="text-sm text-[#1F2328] leading-relaxed mb-6 font-normal">
              "The lessons are structured cleanly. I appreciated that every quiz actually tested edge cases and logic instead of surface-level trivia."
            </p>
            <div className="pt-3 border-t border-[#E7E2DA]">
              <p className="font-medium text-xs text-[#1F2328]">Sneha Patel</p>
              <p className="text-[11px] text-[#5F6368]">Data Analyst, Pune</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[8px] border border-[#E7E2DA] flex flex-col justify-between shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <p className="text-sm text-[#1F2328] leading-relaxed mb-6 font-normal">
              "Simple checkout, lifetime access, and no subscription traps. I completed the AWS cloud curriculum at my own pace over two months."
            </p>
            <div className="pt-3 border-t border-[#E7E2DA]">
              <p className="font-medium text-xs text-[#1F2328]">Rohan Varma</p>
              <p className="text-[11px] text-[#5F6368]">DevOps Engineer, Hyderabad</p>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-16 border-t border-[#E7E2DA] bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-serif font-semibold text-2xl sm:text-3xl text-[#1F2328] tracking-tight">
              Frequently asked questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-[8px] border border-[#E7E2DA] bg-[#FAF8F5] overflow-hidden"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between text-[#1F2328] font-medium text-sm sm:text-base hover:text-[#0E6B6B] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#5F6368] transition-transform duration-200 shrink-0 ml-3 ${
                        isOpen ? 'rotate-180 text-[#0E6B6B]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-4 pt-1 text-[#5F6368] text-sm leading-relaxed border-t border-[#E7E2DA]/60">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quiet Invitation CTA */}
      <section className="py-16 sm:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-serif font-semibold text-2xl sm:text-3xl text-[#1F2328] tracking-tight mb-3">
          Ready to build something real?
        </h2>
        <p className="text-sm sm:text-base text-[#5F6368] max-w-md mx-auto mb-6">
          Browse our courses and start learning at your own pace today.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/courses"
            className="bg-[#0E6B6B] hover:bg-[#0A5555] text-white px-5 py-2.5 rounded-[6px] font-medium text-sm transition-colors shadow-sm focus-ring"
          >
            Explore all courses
          </Link>
          <Link
            to="/register"
            className="bg-white hover:bg-[#FAF8F5] text-[#1F2328] border border-[#E7E2DA] px-5 py-2.5 rounded-[6px] font-medium text-sm transition-colors"
          >
            Create an account
          </Link>
        </div>
      </section>
    </div>
  );
};
