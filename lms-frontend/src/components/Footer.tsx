import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ShieldCheck, Mail, ArrowRight, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#172B4D] text-slate-300 mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-8 h-8 rounded-md bg-white/10 flex items-center justify-center text-white border border-white/20">
                <GraduationCap className="w-4 h-4 text-teal-300" />
              </div>
              <span className="font-bold text-lg tracking-tight text-white">
                Skill<span className="text-teal-400">Forge</span>
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm">
              SkillForge is an enterprise learning platform providing structured technical curricula, self-paced assessments, and verifiable digital certificates for students and engineering teams.
            </p>

            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
              <span>Verifiable Credential System</span>
            </div>
          </div>

          {/* Programs */}
          <div>
            <h3 className="text-white font-semibold text-xs tracking-wider uppercase mb-4">
              Explore Programs
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
              <li>
                <Link to="/courses" className="hover:text-white transition-colors">
                  All Courses
                </Link>
              </li>
              <li>
                <Link to="/courses?level=BEGINNER" className="hover:text-white transition-colors">
                  Beginner Foundations
                </Link>
              </li>
              <li>
                <Link to="/courses?level=INTERMEDIATE" className="hover:text-white transition-colors">
                  Intermediate Projects
                </Link>
              </li>
              <li>
                <Link to="/courses?level=ADVANCED" className="hover:text-white transition-colors">
                  Advanced Engineering
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform & Verification */}
          <div>
            <h3 className="text-white font-semibold text-xs tracking-wider uppercase mb-4">
              Credentials
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
              <li>
                <Link to="/verify-certificate" className="hover:text-teal-300 transition-colors flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                  <span>Verify Certificate</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About the Platform
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold text-xs tracking-wider uppercase mb-4">
              Policies
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/refund" className="hover:text-white transition-colors">
                  Refund & Cancellation Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>&copy; {new Date().getFullYear()} SkillForge Enterprise LMS. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <Link to="/privacy" className="hover:text-slate-200 transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-slate-200 transition-colors">
              Terms
            </Link>
            <Link to="/contact" className="hover:text-slate-200 transition-colors">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
