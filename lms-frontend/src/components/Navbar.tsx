import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  ShieldCheck,
  Compass,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  ChevronDown,
  BookOpen,
} from 'lucide-react';
import { Badge } from './ui/Badge';

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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#E5E7EB] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-18">
          {/* Logo & Primary Nav Links */}
          <div className="flex items-center space-x-8 lg:space-x-10">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-9 h-9 rounded-md bg-[#172B4D] flex items-center justify-center text-white shadow-sm group-hover:bg-[#0F1E36] transition-colors">
                <GraduationCap className="w-5 h-5 text-teal-300" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg tracking-tight text-[#172B4D]">
                  Skill<span className="text-[#287C78]">Forge</span>
                </span>
                <span className="text-[10px] font-medium text-[#697386] tracking-wider uppercase -mt-1">
                  Learning Platform
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center space-x-1 text-sm font-medium text-[#697386]">
              <Link
                to="/"
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  isActive('/')
                    ? 'text-[#172B4D] bg-slate-100 font-semibold'
                    : 'hover:text-[#172B4D] hover:bg-slate-50'
                }`}
              >
                Home
              </Link>
              <Link
                to="/courses"
                className={`px-3 py-1.5 rounded-md transition-colors flex items-center space-x-1.5 ${
                  isActive('/courses')
                    ? 'text-[#172B4D] bg-slate-100 font-semibold'
                    : 'hover:text-[#172B4D] hover:bg-slate-50'
                }`}
              >
                <Compass className="w-4 h-4 text-[#287C78]" />
                <span>Explore Courses</span>
              </Link>
              <Link
                to="/about"
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  isActive('/about')
                    ? 'text-[#172B4D] bg-slate-100 font-semibold'
                    : 'hover:text-[#172B4D] hover:bg-slate-50'
                }`}
              >
                About Us
              </Link>
              <Link
                to="/contact"
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  isActive('/contact')
                    ? 'text-[#172B4D] bg-slate-100 font-semibold'
                    : 'hover:text-[#172B4D] hover:bg-slate-50'
                }`}
              >
                Contact
              </Link>
              <Link
                to="/verify-certificate"
                className={`px-3 py-1.5 rounded-md transition-colors flex items-center space-x-1.5 ${
                  isActive('/verify-certificate')
                    ? 'text-[#287C78] bg-teal-50 font-semibold'
                    : 'hover:text-[#287C78] hover:bg-slate-50'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-[#287C78]" />
                <span>Verify Credential</span>
              </Link>
            </nav>
          </div>

          {/* User Auth Controls */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2.5 bg-white hover:bg-slate-50 text-[#20252B] pl-2 pr-3 py-1.5 rounded-lg text-sm font-medium border border-[#E5E7EB] shadow-subtle transition-colors focus-ring"
                  aria-expanded={dropdownOpen}
                >
                  <div className="w-7 h-7 rounded-md bg-[#172B4D] text-white flex items-center justify-center font-semibold text-xs">
                    {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="max-w-[140px] truncate text-xs sm:text-sm font-medium">
                    {user.fullName || user.email}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-150 ${
                      dropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-lg shadow-dropdown border border-[#E5E7EB] py-1.5 z-50 animate-in fade-in duration-100">
                    <div className="px-4 py-3 border-b border-[#E5E7EB]">
                      <p className="text-xs text-[#697386]">Signed in as</p>
                      <p className="text-sm font-semibold text-[#20252B] truncate mt-0.5">
                        {user.email}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <Badge variant={user.role === 'ADMIN' ? 'error' : 'teal'} size="sm">
                          {user.role}
                        </Badge>
                        <span className="flex items-center text-[11px] text-emerald-600 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
                          Connected
                        </span>
                      </div>
                    </div>

                    <div className="py-1">
                      {user.role === 'ADMIN' ? (
                        <Link
                          to="/admin"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-[#20252B] hover:bg-slate-50 space-x-2.5 transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-[#172B4D]" />
                          <span>Admin Console</span>
                        </Link>
                      ) : (
                        <Link
                          to="/dashboard"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-[#20252B] hover:bg-slate-50 space-x-2.5 transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-[#172B4D]" />
                          <span>Learning Workspace</span>
                        </Link>
                      )}

                      <Link
                        to="/courses"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-[#20252B] hover:bg-slate-50 space-x-2.5 transition-colors"
                      >
                        <BookOpen className="w-4 h-4 text-slate-500" />
                        <span>Course Catalog</span>
                      </Link>
                    </div>

                    <div className="border-t border-[#E5E7EB] pt-1 mt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 space-x-2.5 transition-colors"
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
                  className="text-sm font-medium text-[#20252B] hover:text-[#172B4D] px-3.5 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium bg-[#172B4D] hover:bg-[#0F1E36] text-white px-4 py-2 rounded-lg shadow-sm transition-colors focus-ring"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-700 hover:text-slate-900 p-2 rounded-lg hover:bg-slate-100 transition focus-ring"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E5E7EB] bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top duration-150">
          <Link
            to="/"
            className="block px-3 py-2 rounded-lg text-base font-medium text-[#20252B] hover:bg-slate-100"
          >
            Home
          </Link>
          <Link
            to="/courses"
            className="flex items-center space-x-2.5 px-3 py-2 rounded-lg text-base font-medium text-[#20252B] hover:bg-slate-100"
          >
            <Compass className="w-5 h-5 text-[#287C78]" />
            <span>Explore Courses</span>
          </Link>
          <Link
            to="/about"
            className="block px-3 py-2 rounded-lg text-base font-medium text-[#20252B] hover:bg-slate-100"
          >
            About Us
          </Link>
          <Link
            to="/contact"
            className="block px-3 py-2 rounded-lg text-base font-medium text-[#20252B] hover:bg-slate-100"
          >
            Contact
          </Link>
          <Link
            to="/verify-certificate"
            className="flex items-center space-x-2.5 px-3 py-2 rounded-lg text-base font-medium text-[#20252B] hover:bg-slate-100"
          >
            <ShieldCheck className="w-5 h-5 text-[#287C78]" />
            <span>Verify Credential</span>
          </Link>

          <div className="pt-4 border-t border-[#E5E7EB] space-y-2">
            {user ? (
              <>
                <div className="px-3 py-2 bg-slate-50 rounded-lg">
                  <p className="text-xs text-[#697386]">Signed in as</p>
                  <p className="text-sm font-semibold text-[#20252B] truncate">{user.fullName || user.email}</p>
                </div>
                {user.role === 'ADMIN' ? (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg text-base font-medium text-[#172B4D] hover:bg-slate-100"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    <span>Admin Console</span>
                  </Link>
                ) : (
                  <Link
                    to="/dashboard"
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg text-base font-medium text-[#172B4D] hover:bg-slate-100"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    <span>Learning Workspace</span>
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center space-x-2 px-3 py-2 rounded-lg text-base font-medium text-rose-600 hover:bg-rose-50"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/login"
                  className="text-center font-medium py-2.5 px-4 rounded-lg border border-[#E5E7EB] text-[#20252B] hover:bg-slate-50 text-sm"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-center font-medium py-2.5 px-4 rounded-lg bg-[#172B4D] text-white hover:bg-[#0F1E36] text-sm"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
