import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#1F2328] text-[#A0A5AA] mt-auto border-t border-[#2D333B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Column 1: Brand & Quiet Description */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2.5">
              <span className="w-7 h-7 rounded-[6px] bg-[#0E6B6B] flex items-center justify-center text-white font-serif font-bold text-sm">
                S
              </span>
              <span className="font-serif font-semibold text-lg text-[#FAF8F5]">
                SkillForge
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-[#8B949E] max-w-xs">
              Practical, project-based learning in web development, data science, and cloud systems. Designed for learners who build.
            </p>
          </div>

          {/* Column 2: Courses */}
          <div>
            <h3 className="font-sans font-semibold text-xs tracking-wider uppercase text-[#FAF8F5] mb-4">
              Courses
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/courses" className="hover:text-[#FAF8F5] transition-colors">
                  All courses
                </Link>
              </li>
              <li>
                <Link to="/courses?level=BEGINNER" className="hover:text-[#FAF8F5] transition-colors">
                  Beginner tracks
                </Link>
              </li>
              <li>
                <Link to="/courses?level=INTERMEDIATE" className="hover:text-[#FAF8F5] transition-colors">
                  Intermediate projects
                </Link>
              </li>
              <li>
                <Link to="/courses?level=ADVANCED" className="hover:text-[#FAF8F5] transition-colors">
                  Advanced architecture
                </Link>
              </li>
              <li>
                <Link to="/verify-certificate" className="hover:text-[#FAF8F5] transition-colors">
                  Verify a certificate
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: About & Policies */}
          <div>
            <h3 className="font-sans font-semibold text-xs tracking-wider uppercase text-[#FAF8F5] mb-4">
              About
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/about" className="hover:text-[#FAF8F5] transition-colors">
                  Our approach
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#FAF8F5] transition-colors">
                  Contact support
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-[#FAF8F5] transition-colors">
                  Privacy policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-[#FAF8F5] transition-colors">
                  Terms of service
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h3 className="font-sans font-semibold text-xs tracking-wider uppercase text-[#FAF8F5] mb-4">
              Newsletter
            </h3>
            <p className="text-sm text-[#8B949E] mb-3">
              New courses and practical tutorials, once every two weeks. No spam.
            </p>
            {subscribed ? (
              <p className="text-xs text-[#2F855A] bg-[#2F855A]/10 border border-[#2F855A]/20 p-2.5 rounded-[6px]">
                Thank you for subscribing.
              </p>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-[#161B22] border border-[#30363D] text-sm text-[#FAF8F5] placeholder-[#6E7681] px-3 py-2 rounded-[6px] focus:outline-none focus:border-[#0E6B6B]"
                />
                <button
                  type="submit"
                  className="w-full bg-[#0E6B6B] hover:bg-[#0A5555] text-white text-xs font-medium py-2 rounded-[6px] transition-colors"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="border-t border-[#2D333B] pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-[#6E7681] gap-3">
          <p>© {new Date().getFullYear()} SkillForge. All rights reserved.</p>
          <p>Handcrafted for curious engineers.</p>
        </div>
      </div>
    </footer>
  );
};
