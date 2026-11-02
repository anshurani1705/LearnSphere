import React from 'react';
import { GraduationCap, Award, Users, ShieldCheck, HeartHandshake, Sparkles } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="flex-1 bg-slate-50 py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-full text-indigo-700 text-xs font-bold uppercase tracking-wider mb-4">
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            <span>Our Mission</span>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
            Bridging The Gap Between Theory & Industry Excellence
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            SkillForge Academy was founded with a clear objective: to provide learners with direct access to production-grade engineering curricula taught by veterans from leading technology companies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-2">Rigorous Accreditation</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              We uphold uncompromising quality standards. Our certificates reflect genuine mastery through tested quizzes and projects.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-2">10,000+ Alumni</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Our students work as full-stack engineers, cloud architects, and data scientists across top tech companies worldwide.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-2">Hands-On Experience</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Every course is structured around real codebases, real architectural problems, and real-world deployment workflows.
            </p>
          </div>
        </div>

        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800">
          <h2 className="text-2xl font-extrabold mb-4">Our Teaching Philosophy</h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            We reject superficial tutorials. Every SkillForge curriculum focuses on fundamental software design patterns, architectural best practices, testing disciplines, and production reliability.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-200">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Curricula reviewed and vetted by senior engineering directors</span>
            </div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Automated certificate verification for recruiters</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
