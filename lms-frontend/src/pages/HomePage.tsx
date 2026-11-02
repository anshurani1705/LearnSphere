import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { CourseSummary, Category } from '../types';
import { CourseCard } from '../components/CourseCard';
import { CourseCardSkeleton } from '../components/ui/Skeleton';
import {
  GraduationCap,
  ShieldCheck,
  Compass,
  ArrowRight,
  ChevronDown,
  BookOpen,
  CheckCircle2,
  Code2,
  Cloud,
  Terminal,
  Database,
  Layers,
  HelpCircle,
  PlayCircle,
  FileCheck2,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const [featuredCourses, setFeaturedCourses] = useState<CourseSummary[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  useEffect(() => {
    const loadHomeData = async () => {
      setLoading(true);
      try {
        const [coursesRes, catRes] = await Promise.allSettled([
          api.get('/v1/courses/featured'),
          api.get('/v1/public/categories'),
        ]);

        if (coursesRes.status === 'fulfilled' && coursesRes.value.data?.success) {
          setFeaturedCourses(coursesRes.value.data.data || []);
        }
        if (catRes.status === 'fulfilled' && catRes.value.data?.success) {
          setCategories(catRes.value.data.data || []);
        }
      } catch (err) {
        console.error('Failed to load homepage data', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const defaultCategories = [
    { name: 'Full-Stack Development', icon: Code2, desc: 'Frontend frameworks, responsive interfaces & backend APIs' },
    { name: 'Cloud & Infrastructure', icon: Cloud, desc: 'Containerization, microservices & reliable deployment' },
    { name: 'Backend Systems', icon: Terminal, desc: 'Java, Spring Boot, authentication & database design' },
    { name: 'Database & Architecture', icon: Database, desc: 'Relational data modeling, indexing & query tuning' },
  ];

  const faqs = [
    {
      q: 'How does credential verification work on SkillForge?',
      a: 'Once you finish all required lessons in a course and pass the final evaluation, SkillForge automatically generates a digital certificate with a unique credential UUID and QR code. Anyone—including employers and recruiters—can verify its authenticity at any time on the public verification page.',
    },
    {
      q: 'Are courses self-paced or do they follow a schedule?',
      a: 'All courses on SkillForge are 100% self-paced. Once enrolled, you have continuous access to all video lessons, reading materials, code walkthroughs, and assessments, allowing you to learn according to your schedule.',
    },
    {
      q: 'Which payment options are supported?',
      a: 'We support secure payment processing via Razorpay, including UPI (Google Pay, PhonePe, Paytm), Net Banking across major banks, and all major Credit and Debit cards. In development environments, an instant mock checkout simulator is also provided for test enrollments.',
    },
    {
      q: 'What happens after I complete a course?',
      a: 'You can immediately download your certificate as a high-resolution PDF from your Student Dashboard. Your completed courses remain accessible in your dashboard for future review and reference.',
    },
  ];

  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="bg-white border-b border-[#E5E7EB] pt-14 pb-16 lg:pt-20 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700">
                <ShieldCheck className="w-4 h-4 text-[#287C78]" />
                <span>Enterprise-Grade Learning Management</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#20252B] leading-[1.18]">
                Build skills that move your career forward.
              </h1>

              <p className="text-base sm:text-lg text-[#697386] leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Master software engineering, cloud architecture, and modern application development through structured, self-paced curricula with practical assessments and verifiable credentials.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <Link
                  to="/courses"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#172B4D] hover:bg-[#0F1E36] text-white text-sm font-medium px-6 py-3 rounded-lg shadow-sm transition-colors focus-ring"
                >
                  <Compass className="w-4 h-4" />
                  <span>Explore Courses</span>
                </Link>

                <Link
                  to="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-[#20252B] border border-[#E5E7EB] text-sm font-medium px-6 py-3 rounded-lg shadow-subtle transition-colors focus-ring"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-4 h-4 text-slate-500" />
                </Link>
              </div>

              {/* Key Trust Signals */}
              <div className="pt-6 border-t border-[#E5E7EB] flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-[#697386]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#287C78]" />
                  <span>Curated technical syllabus</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#287C78]" />
                  <span>Integrated code assessments</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#287C78]" />
                  <span>Verifiable PDF certificates</span>
                </div>
              </div>
            </div>

            {/* Right Educational Visual: Authentic Product Preview */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-lg border border-[#E5E7EB] shadow-card p-5 sm:p-6 space-y-4">
                {/* Visual Header */}
                <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded bg-[#172B4D] flex items-center justify-center text-white text-xs font-semibold">
                      SF
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#20252B]">Course Learning Workspace</p>
                      <p className="text-[11px] text-[#697386]">Full-Stack Web Development</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    In Progress
                  </span>
                </div>

                {/* Simulated Lesson Row */}
                <div className="p-3.5 rounded-md bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[#20252B] flex items-center gap-1.5">
                      <PlayCircle className="w-4 h-4 text-[#287C78]" />
                      <span>Module 3 &bull; RESTful API Security</span>
                    </span>
                    <span className="text-slate-500 font-mono text-[11px]">80%</span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#287C78] h-full rounded-full w-4/5"></div>
                  </div>
                </div>

                {/* Lesson Checklist */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded border border-slate-100 bg-white">
                    <div className="flex items-center gap-2 text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Spring Security Filter Chain</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">Completed</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded border border-slate-100 bg-white">
                    <div className="flex items-center gap-2 text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>JWT Stateless Session Interceptors</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">Completed</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded border border-[#287C78]/20 bg-teal-50/40">
                    <div className="flex items-center gap-2 text-[#172B4D] font-medium">
                      <FileCheck2 className="w-4 h-4 text-[#287C78]" />
                      <span>Knowledge Check Assessment</span>
                    </div>
                    <span className="text-[11px] text-[#287C78] font-semibold">Active</span>
                  </div>
                </div>

                {/* Certificate Verification Badge */}
                <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#287C78]" />
                    <span className="text-xs text-[#20252B] font-medium">Verified Credential Included</span>
                  </div>
                  <Link
                    to="/verify-certificate"
                    className="text-xs text-[#287C78] hover:underline font-medium"
                  >
                    View Sample &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-[#E5E7EB]">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#20252B] tracking-tight">
              Featured Programs
            </h2>
            <p className="text-sm text-[#697386] mt-1">
              Structured courses crafted for foundational understanding and practical execution.
            </p>
          </div>
          <Link
            to="/courses"
            className="mt-4 sm:mt-0 inline-flex items-center gap-1.5 text-sm font-medium text-[#172B4D] hover:text-[#0F1E36] transition-colors"
          >
            <span>View All Courses</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3].map((i) => (
              <CourseCardSkeleton key={i} />
            ))}
          </div>
        ) : featuredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featuredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-[#E5E7EB] p-8">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-[#20252B] mb-1">Courses Currently Updating</h3>
            <p className="text-sm text-[#697386] max-w-md mx-auto mb-4">
              Explore the main catalog to browse all active courses and enrollments.
            </p>
            <Link
              to="/courses"
              className="inline-flex items-center text-sm font-medium text-[#172B4D] hover:underline"
            >
              Browse Complete Catalog &rarr;
            </Link>
          </div>
        )}
      </section>

      {/* Categories Section */}
      <section className="bg-slate-50/70 border-y border-[#E5E7EB] py-14 sm:py-18">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#20252B] tracking-tight">
              Explore by Discipline
            </h2>
            <p className="text-sm text-[#697386] mt-1.5">
              Targeted technical tracks designed to build end-to-end competencies.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {defaultCategories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={idx}
                  to="/courses"
                  className="bg-white p-5 rounded-lg border border-[#E5E7EB] hover:border-slate-300 shadow-card hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between group"
                >
                  <div>
                    <div className="w-10 h-10 rounded-md bg-slate-100 text-[#172B4D] flex items-center justify-center mb-4 group-hover:bg-[#172B4D] group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-sm sm:text-base text-[#20252B] group-hover:text-[#172B4D] transition-colors mb-1.5">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-[#697386] leading-relaxed">
                      {cat.desc}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-[#287C78]">
                    <span>Explore Track</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#20252B] tracking-tight">
            How Learning Works on SkillForge
          </h2>
          <p className="text-sm text-[#697386] mt-1.5">
            A clear, structured learning methodology focused on retention and real application.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-lg border border-[#E5E7EB] bg-white space-y-3">
            <div className="w-8 h-8 rounded-full bg-[#172B4D]/10 text-[#172B4D] font-bold text-sm flex items-center justify-center">
              1
            </div>
            <h3 className="font-semibold text-base text-[#20252B]">Enroll and Access Material</h3>
            <p className="text-xs sm:text-sm text-[#697386] leading-relaxed">
              Choose your program and receive immediate access to step-by-step video lessons, lecture summaries, and sample source code.
            </p>
          </div>

          <div className="p-6 rounded-lg border border-[#E5E7EB] bg-white space-y-3">
            <div className="w-8 h-8 rounded-full bg-[#287C78]/10 text-[#287C78] font-bold text-sm flex items-center justify-center">
              2
            </div>
            <h3 className="font-semibold text-base text-[#20252B]">Complete Practical Quizzes</h3>
            <p className="text-xs sm:text-sm text-[#697386] leading-relaxed">
              Verify your understanding with modular assessments that test architectural concepts, logic flow, and edge cases with instant feedback.
            </p>
          </div>

          <div className="p-6 rounded-lg border border-[#E5E7EB] bg-white space-y-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-sm flex items-center justify-center">
              3
            </div>
            <h3 className="font-semibold text-base text-[#20252B]">Receive Verifiable Credential</h3>
            <p className="text-xs sm:text-sm text-[#697386] leading-relaxed">
              Upon completing all lessons and passing the final exam, generate an official certificate with a verifiable ID shareable on resumes and LinkedIn.
            </p>
          </div>
        </div>
      </section>

      {/* Platform Features / Why SkillForge */}
      <section className="bg-slate-50/70 border-t border-[#E5E7EB] py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#20252B] tracking-tight">
              Designed for Focused Learning
            </h2>
            <p className="text-sm text-[#697386] mt-1.5">
              Tools and infrastructure built to support students from onboarding through completion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white p-6 rounded-lg border border-[#E5E7EB] shadow-card">
              <div className="w-10 h-10 rounded-md bg-[#172B4D]/10 text-[#172B4D] flex items-center justify-center mb-4">
                <PlayCircle className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-base text-[#20252B] mb-2">Self-Paced Player</h3>
              <p className="text-xs sm:text-sm text-[#697386] leading-relaxed">
                Clean, distraction-free player with automatic progress tracking, collapsible curriculum navigation, and multi-device support.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-[#E5E7EB] shadow-card">
              <div className="w-10 h-10 rounded-md bg-[#287C78]/10 text-[#287C78] flex items-center justify-center mb-4">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-base text-[#20252B] mb-2">Evaluated Assessments</h3>
              <p className="text-xs sm:text-sm text-[#697386] leading-relaxed">
                Objective quizzes with attempt limits and passing score thresholds to ensure genuine subject mastery.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-[#E5E7EB] shadow-card">
              <div className="w-10 h-10 rounded-md bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-base text-[#20252B] mb-2">Public Verification</h3>
              <p className="text-xs sm:text-sm text-[#697386] leading-relaxed">
                Certificates carry unique identifiers that third-party recruiters and academic institutions can verify independently without signing in.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-16 sm:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#20252B] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-[#697386] mt-1">
            Common questions regarding course access, certifications, and payments.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <div
                key={index}
                className="bg-white rounded-lg border border-[#E5E7EB] shadow-subtle overflow-hidden"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : index)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between font-medium text-sm sm:text-base text-[#20252B] hover:text-[#172B4D] transition-colors"
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ml-4 ${
                      isOpen ? 'rotate-180 text-[#172B4D]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-[#697386] leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="bg-[#172B4D] text-white py-14 sm:py-16 border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
            Ready to start learning?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Create an account in seconds or explore our courses to see what you can learn next.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/courses"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-[#172B4D] hover:bg-slate-100 font-medium text-sm px-6 py-3 rounded-lg shadow-sm transition-colors"
            >
              <span>Browse Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#287C78] hover:bg-[#206562] text-white font-medium text-sm px-6 py-3 rounded-lg transition-colors"
            >
              <span>Create Account</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
