import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ShieldCheck, Mail, Phone, MapPin, ArrowRight, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0F172A] text-slate-400 mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-white shadow-sm">
                <GraduationCap className="w-5 h-5 text-blue-300" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl tracking-tight text-white">
                  Skill<span className="text-blue-400">Forge</span>
                </span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest -mt-1">
                  Enterprise LMS
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Empowering engineers and career changers worldwide with hands-on coding curricula, automated assessments, and cryptographically verified certifications.
            </p>

            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Tamper-Proof Accredited Credentials</span>
            </div>

            {/* Newsletter Subscription */}
            <div className="pt-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Stay updated with new tech tracks
              </p>
              <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed successfully!'); }} className="flex max-w-sm">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  className="bg-slate-900 border border-slate-700 rounded-l-lg px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 flex-1"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white px-4 rounded-r-lg text-xs font-semibold transition flex items-center space-x-1"
                >
                  <span>Join</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-xs tracking-wider uppercase mb-3.5">
              Explore Programs
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/courses" className="hover:text-white transition">All Courses & Bootcamps</Link>
              </li>
              <li>
                <Link to="/courses?level=BEGINNER" className="hover:text-white transition">Beginner Foundations</Link>
              </li>
              <li>
                <Link to="/courses?level=INTERMEDIATE" className="hover:text-white transition">Intermediate Projects</Link>
              </li>
              <li>
                <Link to="/courses?level=ADVANCED" className="hover:text-white transition">Advanced Architecture</Link>
              </li>
              <li>
                <Link to="/verify-certificate" className="hover:text-emerald-400 transition flex items-center space-x-1">
                  <span>Verify Credential</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold text-xs tracking-wider uppercase mb-3.5">
              Organization
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-white transition">About SkillForge</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition">Contact Us</Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition">Terms & Conditions</Link>
              </li>
              <li>
                <Link to="/refund" className="hover:text-white transition">Refund Policy</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-white font-semibold text-xs tracking-wider uppercase mb-3.5">
              Contact & Support
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span className="text-xs leading-relaxed">Koramangala 4th Block, Bangalore, Karnataka 560034</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-xs">+91 98765 43210</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-xs">hello@skillforge.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>&copy; {new Date().getFullYear()} SkillForge Academy Pvt Ltd. All rights reserved.</p>
          <div className="flex space-x-6 text-xs">
            <Link to="/privacy" className="hover:text-slate-400 transition">Privacy</Link>
            <Link to="/terms" className="hover:text-slate-400 transition">Terms</Link>
            <Link to="/refund" className="hover:text-slate-400 transition">Refunds</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
