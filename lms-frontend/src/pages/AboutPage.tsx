import React from 'react';
import { GraduationCap, Award, Users, ShieldCheck, Code2, BookOpen } from 'lucide-react';
import { Badge } from '../components/ui/Badge';

export const AboutPage: React.FC = () => {
  return (
    <div className="flex-1 bg-[#FAFAF8] py-12 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        <div className="text-center max-w-3xl mx-auto">
          <Badge variant="teal" size="sm" className="mb-3">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Platform Overview</span>
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#20252B] tracking-tight">
            Bridging Practical Theory & Engineering Excellence
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#697386] leading-relaxed">
            SkillForge was built with a clear purpose: to provide learners with structured, self-paced access to production-grade engineering curricula with automated assessments and verifiable credentials.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg border border-[#E5E7EB] shadow-card text-center space-y-3">
            <div className="w-10 h-10 bg-[#172B4D]/10 text-[#172B4D] rounded-md flex items-center justify-center mx-auto">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-base text-[#20252B]">Practical Codebases</h3>
            <p className="text-xs sm:text-sm text-[#697386] leading-relaxed">
              Curricula centered on real software engineering patterns, system design, modern libraries, and deployable projects.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-[#E5E7EB] shadow-card text-center space-y-3">
            <div className="w-10 h-10 bg-[#287C78]/10 text-[#287C78] rounded-md flex items-center justify-center mx-auto">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-base text-[#20252B]">Verifiable Credentials</h3>
            <p className="text-xs sm:text-sm text-[#697386] leading-relaxed">
              Every graduate receives an independently verifiable certificate with a unique UUID lookup and QR verification.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-[#E5E7EB] shadow-card text-center space-y-3">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-700 rounded-md flex items-center justify-center mx-auto">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-base text-[#20252B]">Self-Paced Structure</h3>
            <p className="text-xs sm:text-sm text-[#697386] leading-relaxed">
              Lifetime course access allowing students to learn at their own pace, revisit lectures, and complete assessments whenever ready.
            </p>
          </div>
        </div>

        <div className="bg-[#172B4D] text-white rounded-lg p-6 sm:p-10 border border-slate-800 space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Our Platform Principles</h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
            We prioritize deep conceptual understanding, code hygiene, and real deployment workflows over passive video consumption.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs sm:text-sm text-slate-200">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
              <span>Full-stack architecture and security standards</span>
            </div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
              <span>Instant public verification lookup for recruiters</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
