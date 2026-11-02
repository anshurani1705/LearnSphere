import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { CourseSummary } from '../types';
import { CourseCard } from '../components/CourseCard';
import {
  GraduationCap,
  ShieldCheck,
  CheckCircle,
  PlayCircle,
  Award,
  ArrowRight,
  Star,
  Users,
  Clock,
  Sparkles,
  Zap,
  Code2,
  Terminal,
  Cpu,
  Database,
  Cloud,
  ChevronDown,
  TrendingUp,
  Flame,
  CheckCircle2,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const [featuredCourses, setFeaturedCourses] = useState<CourseSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

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

  const categories = [
    { name: 'Full-Stack Web', icon: Code2, count: '12 Courses', color: 'from-blue-600 to-indigo-700' },
    { name: 'Cloud & DevOps', icon: Cloud, count: '8 Courses', color: 'from-sky-600 to-blue-700' },
    { name: 'AI & Data Science', icon: Cpu, count: '10 Courses', color: 'from-slate-700 to-slate-900' },
    { name: 'Backend & APIs', icon: Terminal, count: '9 Courses', color: 'from-emerald-600 to-teal-700' },
    { name: 'System Design', icon: Database, count: '6 Courses', color: 'from-amber-600 to-amber-700' },
  ];

  const faqs = [
    {
      q: 'How do I receive my verified completion certificate?',
      a: 'Certificates are automatically issued the moment you complete all required course lessons and pass the final assessment with a score above 70%. Your credential includes a unique verification code and QR code shareable on LinkedIn and CVs.',
    },
    {
      q: 'Are the courses self-paced or scheduled?',
      a: 'All courses are 100% self-paced with lifetime access. You can watch HD lectures anytime, complete code challenges on your own schedule, and test your knowledge whenever you feel ready.',
    },
    {
      q: 'What payment methods are supported in India and internationally?',
      a: 'Through our seamless Razorpay gateway, we accept UPI (Google Pay, PhonePe, Paytm), Net Banking across 50+ major banks, all Credit & Debit cards (Visa, MasterCard, RuPay), and EMI options.',
    },
    {
      q: 'Can employers independently verify my credential?',
      a: 'Yes! Every certificate has a public verification page accessible at /verify-certificate where recruiters can enter your certificate ID to view issue date, instructor signature, and accredited skills without needing an account.',
    },
  ];

  return (
    <div className="flex-1 overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-[#0F172A] text-white pt-16 pb-20 lg:pt-20 lg:pb-28 overflow-hidden border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 bg-slate-800/90 border border-slate-700 px-3.5 py-1.5 rounded-full text-slate-300 text-xs font-semibold uppercase tracking-wider mb-6 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Industry-Standard Technical Education</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15] mb-5 text-white">
                Master In-Demand Skills. <br />
                <span className="text-blue-400">Launch Your Next Role.</span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-300 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Join ambitious engineers and professionals learning full-stack development, cloud architecture, and AI engineering with production-grade curricula, hands-on quizzes, and cryptographically verified credentials.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 mb-10">
                <Link
                  to="/courses"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3.5 rounded-lg shadow-sm hover:shadow transition-colors text-sm"
                >
                  <span>Explore All Courses</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/verify-certificate"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold px-6 py-3.5 rounded-lg transition-colors text-sm"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Verify a Credential</span>
                </Link>
              </div>

              {/* Social Proof Avatars */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 text-xs text-slate-400 font-medium pt-3 border-t border-slate-800">
                <div className="flex -space-x-2">
                  <div className="w-7 h-7 rounded-full bg-blue-700 border-2 border-slate-900 flex items-center justify-center text-white font-bold text-[10px]">
                    AK
                  </div>
                  <div className="w-7 h-7 rounded-full bg-emerald-600 border-2 border-slate-900 flex items-center justify-center text-white font-bold text-[10px]">
                    PS
                  </div>
                  <div className="w-7 h-7 rounded-full bg-slate-700 border-2 border-slate-900 flex items-center justify-center text-white font-bold text-[10px]">
                    RV
                  </div>
                  <div className="w-7 h-7 rounded-full bg-amber-600 border-2 border-slate-900 flex items-center justify-center text-white font-bold text-[10px]">
                    +
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-slate-300 font-semibold">4.9/5 Rating</span>
                  <span>•</span>
                  <span>10,000+ Enrolled Students</span>
                </div>
              </div>
            </div>

            {/* Right Showcase Column: Dynamic Floating Mockup */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Card */}
                <div className="bg-slate-900 rounded-xl border border-slate-700/80 p-6 shadow-xl relative overflow-hidden">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                      <span className="ml-2 text-xs font-mono text-slate-400">skillforge-player.tsx</span>
                    </div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      LIVE LESSON
                    </span>
                  </div>

                  {/* Video Lesson Mini Player */}
                  <div className="relative rounded-lg bg-slate-950 border border-slate-800 p-4 mb-5 overflow-hidden">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-400">Module 3 • Lesson 4</span>
                        <h4 className="text-sm font-bold text-white">Full-Stack Microservices Architecture</h4>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white shadow">
                        <PlayCircle className="w-4 h-4 fill-white/20" />
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                        <span>Progress: 85%</span>
                        <span className="text-emerald-400 font-bold">12/14 Lessons</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full w-[85%]"></div>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Checklist */}
                  <div className="space-y-2.5 mb-5">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/70 border border-slate-700/60">
                      <div className="flex items-center space-x-3">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-medium text-slate-200">Spring Boot REST API Security</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-mono">100% Score</span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/70 border border-slate-700/60">
                      <div className="flex items-center space-x-3">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-medium text-slate-200">React + Vite TypeScript Dashboard</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-mono">Completed</span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-blue-950/40 border border-blue-500/30">
                      <div className="flex items-center space-x-3">
                        <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">
                          <Zap className="w-3 h-3" />
                        </div>
                        <span className="text-xs font-medium text-blue-200">Final Assessment Quiz</span>
                      </div>
                      <span className="text-[10px] text-blue-400 font-semibold">In Progress</span>
                    </div>
                  </div>

                  {/* Certificate Earned Banner */}
                  <div className="p-3 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
                        <Award className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white">Verified Credential Ready</p>
                        <p className="text-[10px] text-slate-400">ID: SKL-CERT-2026-9042</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                      Tamper-Proof
                    </span>
                  </div>
                </div>

                {/* Micro Badge */}
                <div className="absolute -bottom-4 -left-4 bg-white text-slate-900 rounded-lg p-3 shadow-md border border-slate-200 flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-md bg-blue-50 text-blue-700 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">94% Placement Rate</p>
                    <p className="text-[10px] text-slate-500">Alumni in Top Tech Firms</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Bar */}
      <section className="bg-slate-900 border-b border-slate-800 py-8 text-white relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
            <div className="pt-3 md:pt-0">
              <p className="text-2xl sm:text-3xl font-extrabold text-white">
                10,000+
              </p>
              <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">Active Students</p>
            </div>
            <div className="pt-3 md:pt-0">
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
                95%
              </p>
              <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">Completion Rate</p>
            </div>
            <div className="pt-3 md:pt-0">
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-400">
                4.9 / 5
              </p>
              <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">Student Satisfaction</p>
            </div>
            <div className="pt-3 md:pt-0">
              <p className="text-2xl sm:text-3xl font-extrabold text-blue-400">
                100%
              </p>
              <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">Verifiable Credentials</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Tracks / Categories */}
      <section className="py-14 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
            <div>
              <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>Career Tracks</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Specialized Curricula for Modern Roles
              </h2>
            </div>
            <Link
              to="/courses"
              className="mt-3 md:mt-0 text-sm font-semibold text-blue-700 hover:text-blue-800 flex items-center space-x-1"
            >
              <span>Explore all disciplines</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={i}
                  to="/courses"
                  className="group p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all duration-200 bg-slate-50/70 hover:bg-white flex flex-col items-start"
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-tr ${cat.color} text-white flex items-center justify-center shadow-sm mb-3 group-hover:scale-105 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-700 transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-xs text-slate-500 mt-1">{cat.count}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Curated Programs</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Top Rated Industry Bootcamps
            </h2>
            <p className="text-slate-600 text-sm mt-1.5">
              Handcrafted by principal engineers to give you practical project mastery.
            </p>
          </div>
          <Link
            to="/courses"
            className="mt-4 md:mt-0 inline-flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-4 py-2.5 rounded-lg transition text-sm"
          >
            <span>View Full Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 rounded-xl bg-slate-200 animate-pulse"></div>
            ))}
          </div>
        ) : featuredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-8">
            <GraduationCap className="w-10 h-10 text-slate-300 mx-auto mb-2.5" />
            <p className="text-slate-600 font-medium">Browse our course catalog to explore open enrollments.</p>
            <Link to="/courses" className="mt-3 inline-block text-blue-700 font-semibold hover:underline">
              Go to Courses &rarr;
            </Link>
          </div>
        )}
      </section>

      {/* Why Choose SkillForge Platform Benefits */}
      <section className="bg-slate-900 py-16 sm:py-20 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center space-x-2 bg-slate-800 border border-slate-700 px-3 py-1 rounded-full text-slate-300 text-xs font-semibold uppercase tracking-wider mb-3">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>The SkillForge Advantage</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Engineered for Real-World Competence
            </h2>
            <p className="text-slate-400 mt-2 text-sm sm:text-base">
              Traditional courses rely on passive video watching. SkillForge enforces true skill acquisition through automated verification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 hover:border-slate-600 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
                <PlayCircle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Structured HD Video Modules</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Step-by-step sequential lessons accompanied by real code repositories, downloadable cheat sheets, and practical demonstrations.
              </p>
            </div>

            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 hover:border-slate-600 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                <CheckCircle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Server-Evaluated Quizzes</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Automated assessments test edge-cases and logic with instant grading, randomized question banks, and minimum pass thresholds.
              </p>
            </div>

            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 hover:border-slate-600 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center mb-4">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Verifiable PDF Credentials</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Upon meeting completion standards, generate cryptographic PDF certificates with unique IDs verified by recruiters and LinkedIn.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1.5">
            <Users className="w-3.5 h-3.5 text-blue-600" />
            <span>Learner Success</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Loved by Ambitious Developers
          </h2>
          <p className="text-slate-600 text-sm mt-1.5">
            Here is what our students have accomplished after finishing our certified tracks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-colors flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex text-amber-400 space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
              <p className="text-slate-700 text-sm leading-relaxed">
                "The Full-Stack Bootcamp gave me the practical knowledge and confidence to ace my interviews. The certificate verification link on my CV made a huge impression on recruiters."
              </p>
            </div>
            <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
                AK
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">Aman Kumar</p>
                <p className="text-xs text-slate-500">Software Engineer at Infosys</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-colors flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex text-amber-400 space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
              <p className="text-slate-700 text-sm leading-relaxed">
                "The assessments aren't just multiple choice guesses. They test edge cases and practical implementations. Easily the best investment I've made in my career."
              </p>
            </div>
            <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
                SP
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">Sneha Patel</p>
                <p className="text-xs text-slate-500">Data Analyst at Flipkart</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-colors flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex text-amber-400 space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
              <p className="text-slate-700 text-sm leading-relaxed">
                "Razorpay checkout was instant, and the course opened up on my dashboard within seconds with email and OTP confirmations. Outstanding learning experience."
              </p>
            </div>
            <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
                RV
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">Rohan Varma</p>
                <p className="text-xs text-slate-500">Cloud Consultant</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive FAQ Section */}
      <section className="bg-slate-50 py-16 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
              Got Questions?
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between text-slate-900 font-semibold hover:text-blue-700 transition-colors"
                  >
                    <span className="text-sm sm:text-base">{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-blue-700' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-4 pt-1 text-slate-600 text-sm leading-relaxed border-t border-slate-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#0F172A] text-white py-16 border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 mx-auto mb-4 flex items-center justify-center shadow-sm">
            <GraduationCap className="w-6 h-6 text-blue-400" />
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight mb-3">
            Start Learning Today. Build What Matters.
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mb-6 max-w-2xl mx-auto">
            Get instant access to top tier technical courses, practice labs, verified certifications, and career support.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/courses"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-lg shadow-sm transition-colors text-sm"
            >
              <span>Explore All Programs</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold px-6 py-3 rounded-lg border border-slate-700 transition-colors text-sm"
            >
              <span>Create Free Student Account</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
