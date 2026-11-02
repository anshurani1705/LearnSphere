import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen,
  GraduationCap,
  ShieldCheck,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  CheckCircle,
  Sparkles,
  ChevronDown,
  Compass,
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

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 glass-navbar transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo & Main Nav */}
          <div className="flex items-center space-x-8 lg:space-x-10">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-lg bg-[#0F2942] flex items-center justify-center text-white shadow-sm border border-slate-800 group-hover:bg-[#1E3A8A] transition-colors duration-200">
                <GraduationCap className="w-5 h-5 text-blue-300" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg tracking-tight text-slate-900">
                  Skill<span className="text-blue-700">Forge</span>
                </span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest -mt-1">
                  Enterprise LMS
                </span>
              </div>
            </Link>

            <div className="hidden md:flex items-center space-x-1 text-sm font-medium text-slate-600">
              <Link
                to="/courses"
                className={`px-3 py-2 rounded-md transition-colors duration-150 flex items-center space-x-1.5 ${
                  isActive('/courses')
                    ? 'text-blue-700 bg-blue-50 font-semibold'
                    : 'hover:text-blue-700 hover:bg-slate-100'
                }`}
              >
                <Compass className="w-4 h-4 text-blue-600" />
                <span>Explore Courses</span>
              </Link>
              <Link
                to="/about"
                className={`px-3 py-2 rounded-md transition-colors duration-150 ${
                  isActive('/about')
                    ? 'text-blue-700 bg-blue-50 font-semibold'
                    : 'hover:text-blue-700 hover:bg-slate-100'
                }`}
              >
                About Us
              </Link>
              <Link
                to="/contact"
                className={`px-3 py-2 rounded-md transition-colors duration-150 ${
                  isActive('/contact')
                    ? 'text-blue-700 bg-blue-50 font-semibold'
                    : 'hover:text-blue-700 hover:bg-slate-100'
                }`}
              >
                Contact
              </Link>
              <Link
                to="/verify-certificate"
                className={`px-3 py-2 rounded-md transition-colors duration-150 flex items-center space-x-1.5 ${
                  isActive('/verify-certificate')
                    ? 'text-emerald-700 bg-emerald-50 font-semibold'
                    : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/50'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verify Credential</span>
              </Link>
            </div>
          </div>

          {/* User Auth Section */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2.5 bg-white hover:bg-slate-50 text-slate-800 pl-2 pr-3 py-1.5 rounded-md text-sm font-medium border border-slate-200 shadow-sm transition-colors"
                >
                  <div className="w-7 h-7 rounded bg-slate-800 text-white flex items-center justify-center font-semibold text-xs">
                    {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="max-w-[120px] truncate">{user.fullName || user.email}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-150 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in duration-100">
                    <div className="px-3.5 py-2.5 border-b border-slate-100">
                      <p className="text-xs font-medium text-slate-400">Signed in as</p>
                      <p className="text-sm font-semibold text-slate-900 truncate mt-0.5">{user.email}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className={`inline-flex items-center px-2 py-0.5 text-[11px] font-semibold rounded ${
                          user.role === 'ADMIN'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}>
                          {user.role}
                        </span>
                        <span className="flex items-center text-[10px] text-emerald-600 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1"></span>
                          Active
                        </span>
                      </div>
                    </div>

                    <div className="py-1">
                      {user.role === 'ADMIN' ? (
                        <Link
                          to="/admin"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-blue-700 space-x-2 transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-blue-600" />
                          <span>Admin Console</span>
                        </Link>
                      ) : (
                        <Link
                          to="/dashboard"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-blue-700 space-x-2 transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-blue-600" />
                          <span>My Learning Center</span>
                        </Link>
                      )}

                      <Link
                        to="/courses"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-blue-700 space-x-2 transition-colors"
                      >
                        <BookOpen className="w-4 h-4 text-slate-500" />
                        <span>Explore Courses</span>
                      </Link>
                    </div>

                    <div className="border-t border-slate-100 pt-1 mt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center px-3.5 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 space-x-2 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2.5">
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-700 hover:text-blue-700 px-3.5 py-2 rounded-md hover:bg-slate-100 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm transition-colors focus-ring"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-700 hover:text-slate-900 p-2 rounded-xl hover:bg-slate-100 transition"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200/80 bg-white/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-2 shadow-2xl animate-in slide-in-from-top duration-200">
          <Link
            to="/courses"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-2.5 px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-blue-700 hover:bg-slate-100"
          >
            <Compass className="w-5 h-5 text-blue-600" />
            <span>Explore Courses</span>
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-blue-700 hover:bg-slate-100"
          >
            About Us
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-blue-700 hover:bg-slate-100"
          >
            Contact
          </Link>
          <Link
            to="/verify-certificate"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-2.5 px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/50"
          >
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>Verify Credential</span>
          </Link>

          <div className="border-t border-slate-200 pt-3">
            {user ? (
              <div className="space-y-1.5">
                <div className="px-3 py-2 bg-slate-100 rounded-md">
                  <p className="text-xs text-slate-500">Signed in as</p>
                  <p className="text-sm font-semibold text-slate-800">{user.fullName || user.email}</p>
                </div>
                <Link
                  to={user.role === 'ADMIN' ? '/admin' : '/dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md font-semibold text-blue-700 bg-blue-50"
                >
                  {user.role === 'ADMIN' ? 'Admin Dashboard' : 'My Learning Dashboard'}
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-rose-600 font-medium hover:bg-rose-50"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="space-y-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center py-2 text-sm font-medium border border-slate-300 rounded-md text-slate-700 hover:bg-slate-100"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center py-2 text-sm font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-sm"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
