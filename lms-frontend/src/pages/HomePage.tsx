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
    { name: 'Full-Stack Web', icon: Code2, count: '12 Courses', color: 'from-blue-500 to-indigo-600' },
    { name: 'Cloud & DevOps', icon: Cloud, count: '8 Courses', color: 'from-sky-500 to-cyan-600' },
    { name: 'AI & Data Science', icon: Cpu, count: '10 Courses', color: 'from-purple-500 to-pink-600' },
    { name: 'Backend & APIs', icon: Terminal, count: '9 Courses', color: 'from-emerald-500 to-teal-600' },
    { name: 'System Design', icon: Database, count: '6 Courses', color: 'from-amber-500 to-orange-600' },
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
      <section className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white pt-16 pb-24 lg:pt-24 lg:pb-32 overflow-hidden">
        {/* Ambient Glow Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 -right-20 w-[450px] h-[450px] bg-purple-600/20 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-emerald-600/15 rounded-full blur-[120px] pointer-events-none" />

        {/* Tech Grid Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:28px_28px] opacity-15 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-500/15 to-violet-500/15 border border-indigo-400/30 px-4 py-1.5 rounded-full text-indigo-300 text-xs font-bold uppercase tracking-wider mb-6 backdrop-blur-md shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>Next-Generation Technical Training</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12] mb-6">
                Master In-Demand Skills. <br />
                <span className="text-gradient">Launch Your Next Role.</span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-300 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Join ambitious engineers and professionals learning full-stack development, cloud architecture, and AI engineering with production-grade curricula, hands-on quizzes, and cryptographically verified credentials.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 mb-10">
                <Link
                  to="/courses"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-extrabold px-8 py-4 rounded-xl shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:-translate-y-0.5 transition-all text-base"
                >
                  <span>Explore All Courses</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <Link
                  to="/verify-certificate"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-bold px-6 py-4 rounded-xl backdrop-blur-md transition-all text-base hover:border-slate-600"
                >
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span>Verify a Credential</span>
                </Link>
              </div>

              {/* Social Proof Avatars */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 text-xs text-slate-400 font-medium pt-2 border-t border-slate-800/80">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-500 border-2 border-slate-900 flex items-center justify-center text-white font-bold text-[10px]">
                    AK
                  </div>
                  <div className="w-8 h-8 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center text-white font-bold text-[10px]">
                    PS
                  </div>
                  <div className="w-8 h-8 rounded-full bg-purple-500 border-2 border-slate-900 flex items-center justify-center text-white font-bold text-[10px]">
                    RV
                  </div>
                  <div className="w-8 h-8 rounded-full bg-amber-500 border-2 border-slate-900 flex items-center justify-center text-white font-bold text-[10px]">
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
                <div className="bg-slate-900/90 rounded-3xl border border-slate-700/70 p-6 backdrop-blur-2xl shadow-2xl shadow-indigo-950/60 relative overflow-hidden">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                    <div className="flex items-center space-x-2">
                      <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
                      <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
                      <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
                      <span className="ml-2 text-xs font-mono text-slate-400">skillforge-player.tsx</span>
                    </div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      LIVE LESSON
                    </span>
                  </div>

                  {/* Video Lesson Mini Player */}
                  <div className="relative rounded-2xl bg-gradient-to-tr from-slate-950 to-indigo-950 border border-slate-800 p-4 mb-5 overflow-hidden">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Module 3 • Lesson 4</span>
                        <h4 className="text-sm font-bold text-white">Full-Stack Microservices Architecture</h4>
                      </div>
                      <div className="w-9 h-9 rounded-full bg-indigo-600/90 flex items-center justify-center text-white shadow-lg shadow-indigo-600/40">
                        <PlayCircle className="w-5 h-5 fill-white/20" />
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                        <span>Progress: 85%</span>
                        <span className="text-emerald-400 font-bold">12/14 Lessons</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full w-[85%]"></div>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Checklist */}
                  <div className="space-y-2.5 mb-5">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-medium text-slate-200">Spring Boot REST API Security</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-mono">100% Score</span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-medium text-slate-200">React + Vite TypeScript Dashboard</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-mono">Completed</span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center animate-spin">
                          <Zap className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-medium text-indigo-200">Final Assessment Quiz</span>
                      </div>
                      <span className="text-[10px] text-indigo-400 font-bold">In Progress</span>
                    </div>
                  </div>

                  {/* Certificate Earned Banner */}
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-teal-500/15 to-indigo-500/20 border border-emerald-500/30 flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">Verified Credential Ready</p>
                        <p className="text-[10px] text-slate-300">ID: SKL-CERT-2026-9042</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-1 rounded-lg border border-emerald-500/30">
                      Tamper-Proof
                    </span>
                  </div>
                </div>

                {/* Floating Micro Badge */}
                <div className="absolute -bottom-5 -left-5 bg-white text-slate-900 rounded-2xl p-3.5 shadow-xl border border-slate-100 flex items-center space-x-3 animate-float-slow">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-black">94% Placement Rate</p>
                    <p className="text-[10px] text-slate-500">Alumni in Top Tech Firms</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Bar */}
      <section className="bg-slate-900 border-y border-slate-800 py-10 text-white relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
            <div className="pt-4 md:pt-0">
              <p className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-200">
                10,000+
              </p>
              <p className="text-xs sm:text-sm text-slate-400 font-semibold mt-1">Active Students</p>
            </div>
            <div className="pt-4 md:pt-0">
              <p className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
                95%
              </p>
              <p className="text-xs sm:text-sm text-slate-400 font-semibold mt-1">Completion Rate</p>
            </div>
            <div className="pt-4 md:pt-0">
              <p className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-200">
                4.9 / 5
              </p>
              <p className="text-xs sm:text-sm text-slate-400 font-semibold mt-1">Student Satisfaction</p>
            </div>
            <div className="pt-4 md:pt-0">
              <p className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-200">
                100%
              </p>
              <p className="text-xs sm:text-sm text-slate-400 font-semibold mt-1">Verifiable Credentials</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Tracks / Categories */}
      <section className="py-16 bg-white border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">
                <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>Career Tracks</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Specialized Curricula for Modern Roles
              </h2>
            </div>
            <Link
              to="/courses"
              className="mt-4 md:mt-0 text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center space-x-1 group"
            >
              <span>Explore all disciplines</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={i}
                  to="/courses"
                  className="group p-5 rounded-2xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-slate-50/60 hover:bg-white flex flex-col items-start"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${cat.color} text-white flex items-center justify-center shadow-md mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-sm sm:text-base group-hover:text-indigo-600 transition-colors">
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
      <section className="py-20 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span>Curated Programs</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Top Rated Industry Bootcamps
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              Handcrafted by principal engineers to give you practical project mastery.
            </p>
          </div>
          <Link
            to="/courses"
            className="mt-6 md:mt-0 inline-flex items-center space-x-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold px-5 py-2.5 rounded-xl transition text-sm"
          >
            <span>View Full Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 rounded-2xl bg-slate-200 animate-pulse"></div>
            ))}
          </div>
        ) : featuredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
            <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 font-medium">Browse our course catalog to explore open enrollments.</p>
            <Link to="/courses" className="mt-4 inline-block text-indigo-600 font-bold hover:underline">
              Go to Courses &rarr;
            </Link>
          </div>
        )}
      </section>

      {/* Why Choose SkillForge Platform Benefits */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-950 py-20 sm:py-28 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center space-x-2 bg-indigo-500/20 border border-indigo-400/30 px-3.5 py-1.5 rounded-full text-indigo-300 text-xs font-bold uppercase tracking-wider mb-4">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>The SkillForge Advantage</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Engineered for Real-World Competence
            </h2>
            <p className="text-slate-400 mt-3 text-sm sm:text-base">
              Traditional courses rely on passive video watching. SkillForge enforces true skill acquisition through automated verification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 p-8 backdrop-blur-md hover:border-indigo-500/50 hover:shadow-glow transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mb-6 shadow-inner">
                <PlayCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Structured HD Video Modules</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Step-by-step sequential lessons accompanied by real code repositories, downloadable cheat sheets, and practical demonstrations.
              </p>
            </div>

            <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 p-8 backdrop-blur-md hover:border-emerald-500/50 hover:shadow-glow transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-6 shadow-inner">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Server-Evaluated Quizzes</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Automated assessments test edge-cases and logic with instant grading, randomized question banks, and minimum pass thresholds.
              </p>
            </div>

            <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 p-8 backdrop-blur-md hover:border-purple-500/50 hover:shadow-glow transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-400 flex items-center justify-center mb-6 shadow-inner">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Verifiable PDF Credentials</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Upon meeting completion standards, generate cryptographic PDF certificates with unique IDs verified by recruiters and LinkedIn.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">
            <Users className="w-4 h-4 text-indigo-500" />
            <span>Learner Success</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Loved by Ambitious Developers
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Here is what our students have accomplished after finishing our certified tracks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-7 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex text-amber-400 space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-slate-700 text-sm leading-relaxed">
                "The Full-Stack Bootcamp gave me the practical knowledge and confidence to ace my interviews. The certificate verification link on my CV made a huge impression on recruiters."
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 text-white font-bold flex items-center justify-center text-sm shadow-md">
                AK
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">Aman Kumar</p>
                <p className="text-xs text-slate-500">Software Engineer at Infosys</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex text-amber-400 space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-slate-700 text-sm leading-relaxed">
                "The assessments aren't just multiple choice guesses. They test edge cases and practical implementations. Easily the best investment I've made in my career."
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold flex items-center justify-center text-sm shadow-md">
                SP
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">Sneha Patel</p>
                <p className="text-xs text-slate-500">Data Analyst at Flipkart</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex text-amber-400 space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-slate-700 text-sm leading-relaxed">
                "Razorpay checkout was instant, and the course opened up on my dashboard within seconds with email and OTP confirmations. Outstanding learning experience."
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 text-white font-bold flex items-center justify-center text-sm shadow-md">
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
      <section className="bg-slate-50 py-20 border-t border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
              Got Questions?
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3.5">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full text-left p-5 flex items-center justify-between text-slate-900 font-bold hover:text-indigo-600 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-indigo-600' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-slate-600 text-sm leading-relaxed border-t border-slate-100 animate-in fade-in duration-200">
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
      <section className="relative bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10"></div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 mx-auto mb-6 flex items-center justify-center shadow-lg">
            <GraduationCap className="w-9 h-9 text-indigo-300" />
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 leading-tight">
            Start Learning Today. Build What Matters.
          </h2>
          <p className="text-indigo-100 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
            Get instant access to top tier technical courses, practice labs, verified certifications, and career support.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/courses"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-white text-indigo-900 font-extrabold px-8 py-4 rounded-xl shadow-xl hover:bg-slate-100 hover:shadow-2xl hover:-translate-y-0.5 transition-all text-base"
            >
              <span>Explore All Programs</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-indigo-700/60 hover:bg-indigo-700 text-white font-bold px-8 py-4 rounded-xl border border-indigo-400/30 backdrop-blur-md transition-all text-base"
            >
              <span>Create Free Student Account</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
