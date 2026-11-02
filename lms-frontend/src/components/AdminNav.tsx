import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  PlusCircle,
  FolderTree,
  Users,
  CreditCard,
  FileQuestion,
  Award,
  BellRing,
  Settings,
} from 'lucide-react';

export const AdminNav: React.FC = () => {
  const links = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/courses', label: 'Courses', icon: BookOpen, end: true },
    { to: '/admin/courses/create', label: 'Create Course', icon: PlusCircle },
    { to: '/admin/categories', label: 'Categories', icon: FolderTree },
    { to: '/admin/students', label: 'Students', icon: Users },
    { to: '/admin/orders', label: 'Orders & Payments', icon: CreditCard },
    { to: '/admin/quizzes', label: 'Quizzes', icon: FileQuestion },
    { to: '/admin/certificates', label: 'Certificates', icon: Award },
    { to: '/admin/logs', label: 'Notifications & Audits', icon: BellRing },
    { to: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm sticky top-16 sm:top-20 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-1 overflow-x-auto py-2.5 scrollbar-none">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
};
