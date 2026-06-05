'use client';
import { useEffect, useState } from 'react';
import { userApi } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { getFitScoreColor, DEPARTMENTS } from '@/lib/utils';
import { Trophy, Medal, Search, Filter, Loader2, TrendingUp, Star, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const MEDAL_COLORS = ['text-yellow-400', 'text-slate-300', 'text-amber-600'];
const MEDAL_BG     = ['bg-yellow-500/10 border-yellow-500/20', 'bg-slate-500/10 border-slate-500/20', 'bg-amber-600/10 border-amber-600/20'];

function RankBadge({ rank }) {
  if (rank <= 3) {
    return (
      <div className={cn('w-8 h-8 rounded-full flex items-center justify-center border', MEDAL_BG[rank - 1])}>
        <Medal className={cn('w-4 h-4', MEDAL_COLORS[rank - 1])} />
      </div>
    );
  }
  return (
    <div className="w-8 h-8 rounded-full bg-dark-700 border border-dark-600 flex items-center justify-center">
      <span className="text-dark-400 text-xs font-mono font-bold">#{rank}</span>
    </div>
  );
}

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [students, setStudents]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [department, setDepartment] = useState('');

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await userApi.getAllStudents({ limit: 100, search, department });
        // Sort by readinessScore desc
        const sorted = (data.students || [])
          .filter(s => s.readinessScore > 0 || s.cgpa > 0)
          .sort((a, b) => {
            const aScore = (a.readinessScore || 0) * 0.6 + (a.cgpa || 0) * 4 + (a.skills?.length || 0) * 2;
            const bScore = (b.readinessScore || 0) * 0.6 + (b.cgpa || 0) * 4 + (b.skills?.length || 0) * 2;
            return bScore - aScore;
          });
        setStudents(sorted);
      } catch { toast.error('Failed to load leaderboard'); }
      finally { setLoading(false); }
    };
    fetch();
  }, [search, department]);

  const myRank = students.findIndex(s => s._id === user?._id) + 1;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
            <Trophy className="w-8 h-8 text-brand-400" /> Readiness Leaderboard
          </h1>
          <p className="text-dark-400 mt-1">Ranked by readiness score, CGPA, and skill coverage</p>
        </div>
        {/* {myRank > 0 && (
          <div className="card px-5 py-3 text-center border-brand-500/20 shrink-0">
            <p className="text-dark-500 text-xs mb-1">Your Rank</p>
            <p className="font-display text-2xl font-bold text-brand-400">#{myRank}</p>
            <p className="text-dark-600 text-xs">of {students.length}</p>
          </div>
        )} */}
      </div>

      {/* Top 3 podium */}
      {students.length >= 3 && (
        <div className="grid grid-cols-3 gap-4 mb-2">
          {/* 2nd */}
          <div className="card p-5 text-center mt-8 border-slate-500/20">
            <div className="w-14 h-14 bg-slate-500/20 rounded-full flex items-center justify-center text-slate-300 font-display font-bold text-xl mx-auto mb-3">
              {students[1]?.name?.charAt(0)}
            </div>
            <Medal className="w-5 h-5 text-slate-300 mx-auto mb-2" />
            <p className="font-display font-bold text-white text-sm truncate">{students[1]?.name}</p>
            <p className="text-dark-500 text-xs">{students[1]?.department?.split(' ')[0]}</p>
            <p className="font-mono text-slate-300 font-bold text-lg mt-2">{students[1]?.readinessScore || 0}</p>
            <p className="text-dark-600 text-xs">readiness</p>
          </div>
          {/* 1st */}
          <div className="card p-5 text-center border-yellow-500/30 bg-yellow-500/5 glow-brand">
            <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center text-yellow-400 font-display font-bold text-2xl mx-auto mb-3 animate-float">
              {students[0]?.name?.charAt(0)}
            </div>
            <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <p className="font-display font-bold text-white truncate">{students[0]?.name}</p>
            <p className="text-dark-500 text-xs">{students[0]?.department?.split(' ')[0]}</p>
            <p className="font-mono text-yellow-400 font-bold text-2xl mt-2">{students[0]?.readinessScore || 0}</p>
            <p className="text-dark-600 text-xs">readiness</p>
          </div>
          {/* 3rd */}
          <div className="card p-5 text-center mt-8 border-amber-600/20">
            <div className="w-14 h-14 bg-amber-600/20 rounded-full flex items-center justify-center text-amber-600 font-display font-bold text-xl mx-auto mb-3">
              {students[2]?.name?.charAt(0)}
            </div>
            <Medal className="w-5 h-5 text-amber-600 mx-auto mb-2" />
            <p className="font-display font-bold text-white text-sm truncate">{students[2]?.name}</p>
            <p className="text-dark-500 text-xs">{students[2]?.department?.split(' ')[0]}</p>
            <p className="font-mono text-amber-600 font-bold text-lg mt-2">{students[2]?.readinessScore || 0}</p>
            <p className="text-dark-600 text-xs">readiness</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
          <input className="input pl-10" placeholder="Search students…"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input w-auto" value={department} onChange={e => setDepartment(e.target.value)}>
          <option value="">All Departments</option>
          {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {/* Full list */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-brand-400 animate-spin" /></div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-dark-800/50 border-b border-dark-800">
                <tr>
                  {['Rank', 'Student', 'Department', 'CGPA', 'Skills', 'Readiness', 'Profile'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-dark-400 font-medium text-xs uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-800">
                {students.map((s, idx) => {
                  const isMe = s._id === user?._id;
                  return (
                    <tr key={s._id} className={cn(
                      'hover:bg-dark-800/30 transition-colors',
                      isMe && 'bg-brand-500/5 border-l-2 border-brand-500'
                    )}>
                      <td className="px-5 py-4">
                        <RankBadge rank={idx + 1} />
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            'w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0',
                            isMe ? 'bg-brand-500 text-dark-950' : 'bg-dark-700 text-dark-300'
                          )}>
                            {s.name?.charAt(0)}
                          </div>
                          <div>
                            <p className={cn('font-medium', isMe ? 'text-brand-400' : 'text-dark-200')}>
                              {s.name} {isMe && <span className="text-xs text-brand-500">(you)</span>}
                            </p>
                            <p className="text-dark-600 text-xs">{s.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-dark-400 text-sm">
                        {s.department || '—'}
                        {s.semester && <span className="text-dark-600 text-xs block">Sem {s.semester}</span>}
                      </td>
                      <td className="px-5 py-4">
                        {s.cgpa ? (
                          <span className={cn('font-mono font-bold', s.cgpa >= 9 ? 'text-green-400' : s.cgpa >= 7.5 ? 'text-brand-400' : s.cgpa >= 6 ? 'text-yellow-400' : 'text-red-400')}>
                            {s.cgpa}
                          </span>
                        ) : <span className="text-dark-600">—</span>}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-1">
                          {s.skills?.slice(0, 3).map(sk => (
                            <span key={sk} className="badge bg-dark-700 text-dark-400 border-dark-600 text-xs">{sk}</span>
                          ))}
                          {(s.skills?.length || 0) > 3 && (
                            <span className="text-dark-600 text-xs self-center">+{s.skills.length - 3}</span>
                          )}
                          {!s.skills?.length && <span className="text-dark-700 text-xs">none</span>}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-dark-700 rounded-full h-1.5">
                            <div
                              className={cn('h-1.5 rounded-full transition-all', (s.readinessScore || 0) >= 80 ? 'bg-green-500' : (s.readinessScore || 0) >= 60 ? 'bg-brand-500' : 'bg-dark-500')}
                              style={{ width: `${s.readinessScore || 0}%` }}
                            />
                          </div>
                          <span className={cn('font-mono text-sm font-bold', getFitScoreColor(s.readinessScore || 0))}>
                            {s.readinessScore || 0}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          {s.resumeURL && <span className="badge bg-green-500/10 text-green-400 border-green-500/20 text-xs">Resume ✓</span>}
                          {!s.resumeURL && <span className="text-dark-700 text-xs">No resume</span>}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {students.length === 0 && (
              <div className="text-center py-16">
                <Trophy className="w-10 h-10 text-dark-700 mx-auto mb-3" />
                <p className="text-dark-500">No students found</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}