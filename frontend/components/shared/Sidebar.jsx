'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/utils';
import NotificationBell from './NotificationBell';
import {
  BrainCircuit, LayoutDashboard, Building2, FileText,
  BarChart3, Users, LogOut, Settings, Sparkles,
  ClipboardList, BookOpen, Zap, ChevronRight, Trophy, Search,
} from 'lucide-react';

const ADMIN_LINKS = [
  { href: '/admin/dashboard',       icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/companies',       icon: Building2,        label: 'Companies' },
  { href: '/admin/applications',    icon: ClipboardList,    label: 'Applications' },
  { href: '/admin/students',        icon: Users,            label: 'Students' },
  { href: '/admin/analytics',       icon: BarChart3,        label: 'Analytics' },
  // { href: '/admin/semantic-search', icon: Search,           label: 'AI Resume Search', badge: 'AI' },
];

const STUDENT_LINKS = [
  { href: '/student/dashboard',      icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/student/companies',      icon: Building2,        label: 'Companies' },
  { href: '/student/applications',   icon: FileText,         label: 'My Applications' },
  { href: '/student/ai-resume',      icon: Sparkles,         label: 'AI Resume', badge: 'AI' },
  // { href: '/student/interview-prep', icon: BookOpen,         label: 'Interview Prep', badge: 'AI' },
  // { href: '/student/leaderboard',    icon: Trophy,           label: 'Leaderboard' },
  { href: '/student/profile',        icon: Settings,         label: 'Profile' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout, isAdmin } = useAuth();
  const links = isAdmin ? ADMIN_LINKS : STUDENT_LINKS;

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-dark-900 border-r border-dark-800 flex flex-col z-40">
      {/* Logo + bell */}
      <div className="px-5 py-4 border-b border-dark-800 flex items-center justify-between">
        <Link href={isAdmin ? '/admin/dashboard' : '/student/dashboard'} className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center shrink-0">
            <BrainCircuit className="w-5 h-5 text-dark-950" />
          </div>
          <div>
            <span className="font-display font-bold text-white text-sm block leading-none">UniPlacement</span>
            <span className="text-brand-400 font-display font-bold text-sm">AI</span>
          </div>
        </Link>
        <NotificationBell />
      </div>

      {/* Role badge */}
      <div className="px-4 py-3 border-b border-dark-800">
        <div className={cn(
          'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border',
          isAdmin
            ? 'bg-brand-500/10 text-brand-400 border-brand-500/20'
            : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
        )}>
          <Zap className="w-3 h-3" />
          {isAdmin ? 'Admin Portal' : 'Student Portal'}
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">
        {links.map(link => {
          const active = pathname === link.href || pathname.startsWith(link.href + '/');
          return (
            <Link key={link.href} href={link.href}
              className={active ? 'sidebar-link-active' : 'sidebar-link'}>
              <link.icon className="w-4 h-4 shrink-0" />
              <span className="flex-1">{link.label}</span>
              {link.badge && (
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded-md bg-brand-500/20 text-brand-400 border border-brand-500/20">
                  {link.badge}
                </span>
              )}
              {active && <ChevronRight className="w-3.5 h-3.5 shrink-0" />}
            </Link>
          );
        })}
      </nav>

      {/* User info + logout */}
      <div className="px-4 py-4 border-t border-dark-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 bg-brand-500/20 rounded-full flex items-center justify-center text-brand-400 font-bold text-sm shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-dark-200 text-sm font-medium truncate">{user?.name}</p>
            <p className="text-dark-500 text-xs truncate">{user?.email}</p>
          </div>
        </div>
        <button onClick={logout} className="sidebar-link w-full text-red-400 hover:text-red-300 hover:bg-red-500/10">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </aside>
  );
}