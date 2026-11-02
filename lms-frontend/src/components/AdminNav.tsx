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
    { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
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
    <div className="bg-white border-b border-[#E5E7EB] sticky top-16 sm:top-18 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-1 overflow-x-auto py-2 scrollbar-none">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-[#172B4D] text-white shadow-sm'
                      : 'text-[#697386] hover:text-[#20252B] hover:bg-slate-100'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
};
