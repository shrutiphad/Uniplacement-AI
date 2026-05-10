'use client';
import { Loader2 } from 'lucide-react';
import { cn, getFitScoreBg } from '@/lib/utils';


export function PageLoader({ message = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
      <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
      <p className="text-dark-500 text-sm">{message}</p>
    </div>
  );
}


export function Spinner({ className }) {
  return <Loader2 className={cn('w-4 h-4 animate-spin', className)} />;
}


export function EmptyState({ icon: Icon, title, subtitle, action }) {
  return (
    <div className="card p-16 text-center">
      {Icon && <Icon className="w-12 h-12 text-dark-700 mx-auto mb-4" />}
      <p className="text-dark-300 font-medium text-lg">{title}</p>
      {subtitle && <p className="text-dark-600 text-sm mt-1">{subtitle}</p>}
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </div>
  );
}

export function StatCard({ icon: Icon, label, value, sub, colorClass = 'text-brand-400 bg-brand-500/10' }) {
  return (
    <div className="stat-card">
      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3', colorClass)}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-dark-400 text-sm">{label}</p>
      <p className="font-display text-3xl font-bold text-white mt-0.5">{value ?? '—'}</p>
      {sub && <p className="text-dark-600 text-xs mt-1">{sub}</p>}
    </div>
  );
}


export function SkillBadge({ skill, matched }) {
  return (
    <span className={cn(
      'badge text-xs',
      matched
        ? 'bg-green-500/10 text-green-400 border-green-500/20'
        : 'bg-red-500/10 text-red-400 border-red-500/20'
    )}>
      {matched ? '✓' : '+'} {skill}
    </span>
  );
}


export function FitScoreBar({ score, label, showLabel = true }) {
  return (
    <div>
      {showLabel && (
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-dark-400">{label}</span>
          <span className={cn('font-mono font-bold', score >= 80 ? 'text-green-400' : score >= 60 ? 'text-yellow-400' : 'text-red-400')}>
            {score}%
          </span>
        </div>
      )}
      <div className="progress-bar">
        <div
          className={cn('progress-fill', getFitScoreBg(score))}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}


export function TimelineDot({ status }) {
  const colors = {
    Applied:       'bg-blue-400',
    'Under Review':'bg-yellow-400',
    Shortlisted:   'bg-purple-400',
    Selected:      'bg-green-400',
    Rejected:      'bg-red-400',
  };
  return <span className={cn('w-2.5 h-2.5 rounded-full shrink-0', colors[status] || 'bg-dark-500')} />;
}


export function ScoreRing({ score = 0, size = 100, strokeWidth = 10, color = '#f59e0b', label }) {
  const r    = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const fill = circ * (Math.min(100, Math.max(0, score)) / 100);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size/2} cy={size/2} r={r} stroke="#1e1e1e" strokeWidth={strokeWidth} fill="none" />
          <circle cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth={strokeWidth} fill="none"
            strokeDasharray={`${fill} ${circ}`} strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 0.8s ease' }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display font-bold text-white" style={{ fontSize: size * 0.2 }}>{score}</span>
        </div>
      </div>
      {label && <span className="text-dark-500 text-xs text-center leading-tight">{label}</span>}
    </div>
  );
}


export function Tooltip({ text, children }) {
  return (
    <div className="relative group inline-flex">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-dark-700 text-dark-200 text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 border border-dark-600">
        {text}
      </div>
    </div>
  );
}