import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  ChevronDown,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const isActive = (path: string) => {
    if (path === '/courses' && location.pathname.startsWith('/courses')) return true;
    return location.pathname === path;
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-[#E7E2DA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Main Nav */}
          <div className="flex items-center space-x-8 lg:space-x-10">
            <Link to="/" className="flex items-center space-x-2.5">
              <span className="w-8 h-8 rounded-[6px] bg-[#0E6B6B] flex items-center justify-center text-white font-serif font-bold text-base shadow-sm">
                S
              </span>
              <span className="font-serif font-semibold text-xl tracking-tight text-[#1F2328]">
                SkillForge
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-6 text-sm">
              <Link
                to="/courses"
                className={`py-5 transition-colors font-medium border-b-2 -mb-[1px] ${
                  isActive('/courses')
                    ? 'border-[#0E6B6B] text-[#1F2328]'
                    : 'border-transparent text-[#5F6368] hover:text-[#1F2328]'
                }`}
              >
                Courses
              </Link>
              <Link
                to="/about"
                className={`py-5 transition-colors font-medium border-b-2 -mb-[1px] ${
                  isActive('/about')
                    ? 'border-[#0E6B6B] text-[#1F2328]'
                    : 'border-transparent text-[#5F6368] hover:text-[#1F2328]'
                }`}
              >
                About
              </Link>
              <Link
                to="/contact"
                className={`py-5 transition-colors font-medium border-b-2 -mb-[1px] ${
                  isActive('/contact')
                    ? 'border-[#0E6B6B] text-[#1F2328]'
                    : 'border-transparent text-[#5F6368] hover:text-[#1F2328]'
                }`}
              >
                Contact
              </Link>
              <Link
                to="/verify-certificate"
                className={`py-5 transition-colors font-medium border-b-2 -mb-[1px] ${
                  isActive('/verify-certificate')
                    ? 'border-[#0E6B6B] text-[#1F2328]'
                    : 'border-transparent text-[#5F6368] hover:text-[#1F2328]'
                }`}
              >
                Verify certificate
              </Link>
            </div>
          </div>

          {/* User Auth Section */}
          <div className="hidden md:flex items-center space-x-5">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 text-[#1F2328] hover:text-[#0E6B6B] text-sm font-medium transition-colors"
                >
                  <div className="w-7 h-7 rounded-[6px] bg-[#E6F2F1] text-[#0E6B6B] flex items-center justify-center font-semibold text-xs border border-[#E7E2DA]">
                    {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="max-w-[140px] truncate">{user.fullName || user.email}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-[#5F6368] transition-transform duration-150 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-[8px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-[#E7E2DA] py-1.5 z-50">
                    <div className="px-3.5 py-2 border-b border-[#E7E2DA]">
                      <p className="text-xs text-[#5F6368]">Signed in as</p>
                      <p className="text-sm font-medium text-[#1F2328] truncate">{user.email}</p>
                    </div>

                    <div className="py-1">
                      {user.role === 'ADMIN' ? (
                        <Link
                          to="/admin"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center px-3.5 py-2 text-sm text-[#1F2328] hover:bg-[#FAF8F5] space-x-2"
                        >
                          <LayoutDashboard className="w-4 h-4 text-[#0E6B6B]" />
                          <span>Admin dashboard</span>
                        </Link>
                      ) : (
                        <Link
                          to="/dashboard"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center px-3.5 py-2 text-sm text-[#1F2328] hover:bg-[#FAF8F5] space-x-2"
                        >
                          <LayoutDashboard className="w-4 h-4 text-[#0E6B6B]" />
                          <span>My learning</span>
                        </Link>
                      )}

                      <Link
                        to="/courses"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center px-3.5 py-2 text-sm text-[#1F2328] hover:bg-[#FAF8F5] space-x-2"
                      >
                        <BookOpen className="w-4 h-4 text-[#5F6368]" />
                        <span>All courses</span>
                      </Link>
                    </div>

                    <div className="border-t border-[#E7E2DA] pt-1 mt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center px-3.5 py-2 text-sm text-[#C0392B] hover:bg-[#FAF8F5] space-x-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-sm font-medium text-[#1F2328] hover:text-[#0E6B6B] transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium bg-[#0E6B6B] hover:bg-[#0A5555] text-white px-4 py-2 rounded-[6px] transition-colors shadow-sm focus-ring"
                >
                  Get started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-[#1F2328] hover:text-[#0E6B6B] p-2 rounded-[6px] hover:bg-[#FAF8F5] transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E7E2DA] bg-white px-4 pt-3 pb-6 space-y-1">
          <Link
            to="/courses"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-[#1F2328] hover:bg-[#FAF8F5] rounded-[6px]"
          >
            Courses
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-[#1F2328] hover:bg-[#FAF8F5] rounded-[6px]"
          >
            About
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-[#1F2328] hover:bg-[#FAF8F5] rounded-[6px]"
          >
            Contact
          </Link>
          <Link
            to="/verify-certificate"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-[#1F2328] hover:bg-[#FAF8F5] rounded-[6px]"
          >
            Verify certificate
          </Link>

          <div className="border-t border-[#E7E2DA] pt-3 mt-3">
            {user ? (
              <div className="space-y-1">
                <Link
                  to={user.role === 'ADMIN' ? '/admin' : '/dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-medium text-[#0E6B6B]"
                >
                  {user.role === 'ADMIN' ? 'Admin dashboard' : 'My learning'}
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-sm font-medium text-[#C0392B]"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 text-sm font-medium text-[#1F2328] hover:text-[#0E6B6B]"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 text-sm font-medium bg-[#0E6B6B] hover:bg-[#0A5555] text-white rounded-[6px]"
                >
                  Get started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
