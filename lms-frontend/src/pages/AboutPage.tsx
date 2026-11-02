import React from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="flex-1 bg-[#FAF8F5] py-16 lg:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="max-w-2xl">
          <h1 className="font-serif font-semibold text-3xl sm:text-4xl lg:text-[42px] text-[#1F2328] tracking-tight leading-[1.2]">
            Teaching real software craft through projects.
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#5F6368] leading-relaxed">
            SkillForge began with a straightforward observation: most online tutorials focus on syntax memorization rather than the judgment needed to ship reliable applications.
          </p>
        </div>

        {/* 3 Core Principles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-[8px] border border-[#E7E2DA] shadow-[0_1px_2px_rgba(0,0,0,0.05)] space-y-2">
            <span className="font-serif font-semibold text-lg text-[#0E6B6B]">01</span>
            <h3 className="font-serif font-semibold text-base text-[#1F2328]">Depth over novelty</h3>
            <p className="text-sm text-[#5F6368] leading-relaxed">
              We teach durable software design patterns, state management, and debugging skills that remain relevant across framework shifts.
            </p>
          </div>

          <div className="bg-white p-6 rounded-[8px] border border-[#E7E2DA] shadow-[0_1px_2px_rgba(0,0,0,0.05)] space-y-2">
            <span className="font-serif font-semibold text-lg text-[#0E6B6B]">02</span>
            <h3 className="font-serif font-semibold text-base text-[#1F2328]">Tested comprehension</h3>
            <p className="text-sm text-[#5F6368] leading-relaxed">
              Assessments evaluate code edge cases, database transactions, and error handling rather than surface-level multiple choice questions.
            </p>
          </div>

          <div className="bg-white p-6 rounded-[8px] border border-[#E7E2DA] shadow-[0_1px_2px_rgba(0,0,0,0.05)] space-y-2">
            <span className="font-serif font-semibold text-lg text-[#0E6B6B]">03</span>
            <h3 className="font-serif font-semibold text-base text-[#1F2328]">Fair, lifetime access</h3>
            <p className="text-sm text-[#5F6368] leading-relaxed">
              One-time course enrollment with perpetual access to materials, revisions, and verified certificates. No recurring subscriptions.
            </p>
          </div>
        </div>

        {/* Teaching Philosophy */}
        <div className="bg-white rounded-[8px] p-8 border border-[#E7E2DA] shadow-[0_1px_2px_rgba(0,0,0,0.05)] space-y-4">
          <h2 className="font-serif font-semibold text-2xl text-[#1F2328]">
            Our approach to curriculum design
          </h2>
          <p className="text-sm text-[#5F6368] leading-relaxed max-w-prose">
            Every course on SkillForge is authored by engineers with hands-on production experience. Instead of toy examples, you build applications using realistic databases, authentication flows, and automated deployments.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-sm text-[#1F2328]">
            <div className="flex items-center space-x-2.5">
              <span className="w-4 h-4 rounded-full bg-[#E6F2F1] text-[#0E6B6B] flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5" />
              </span>
              <span>Complete repository source code provided</span>
            </div>
            <div className="flex items-center space-x-2.5">
              <span className="w-4 h-4 rounded-full bg-[#E6F2F1] text-[#0E6B6B] flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5" />
              </span>
              <span>Self-paced with lifetime access</span>
            </div>
            <div className="flex items-center space-x-2.5">
              <span className="w-4 h-4 rounded-full bg-[#E6F2F1] text-[#0E6B6B] flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5" />
              </span>
              <span>Public certificate verification URL</span>
            </div>
            <div className="flex items-center space-x-2.5">
              <span className="w-4 h-4 rounded-full bg-[#E6F2F1] text-[#0E6B6B] flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5" />
              </span>
              <span>Real-world architectural case studies</span>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center pt-4">
          <Link
            to="/courses"
            className="inline-block bg-[#0E6B6B] hover:bg-[#0A5555] text-white px-5 py-2.5 rounded-[6px] text-sm font-medium transition-colors shadow-sm focus-ring"
          >
            Explore available courses &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};
