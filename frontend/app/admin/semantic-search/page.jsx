'use client';
import { useEffect, useState } from 'react';
import { aiApi, companyApi } from '@/lib/api';
import toast from 'react-hot-toast';
import {
  Search, Sparkles, Loader2, Building2, Users,
  TrendingUp, ExternalLink, FileText, ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

function SimilarityBar({ score }) {
  const color = score >= 75 ? 'bg-green-500' : score >= 55 ? 'bg-brand-500' : score >= 35 ? 'bg-yellow-500' : 'bg-dark-500';
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 bg-dark-700 rounded-full h-2">
        <div className={cn('h-2 rounded-full transition-all duration-500', color)} style={{ width: `${score}%` }} />
      </div>
      <span className={cn('font-mono text-sm font-bold w-10 text-right shrink-0',
        score >= 75 ? 'text-green-400' : score >= 55 ? 'text-brand-400' : score >= 35 ? 'text-yellow-400' : 'text-dark-500')}>
        {score}%
      </span>
    </div>
  );
}

export default function AdminSemanticSearchPage() {
  const [companies, setCompanies]       = useState([]);
  const [selCo, setSelCo]               = useState('');
  const [selRole, setSelRole]           = useState('');
  const [topK, setTopK]                 = useState(10);
  const [loading, setLoading]           = useState(false);
  const [results, setResults]           = useState(null);

  useEffect(() => {
    companyApi.getAll({ limit: 50 }).then(({ data }) => setCompanies(data.companies));
  }, []);

  const selCoData = companies.find(c => c._id === selCo);

  const handleSearch = async () => {
    if (!selCo || !selRole) { toast.error('Select a company and role first'); return; }
    setLoading(true); setResults(null);
    try {
      const { data } = await aiApi.findSimilarResumes({ companyId: selCo, roleId: selRole, topK });
      setResults(data.results || []);
      toast.success(`Found ${data.results?.length || 0} semantically matched resumes`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Search failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
          <Sparkles className="w-7 h-7 text-brand-400" /> AI Semantic Resume Search
        </h1>
        <p className="text-dark-400 mt-1">
          Uses RAG vector embeddings to find the most semantically compatible student resumes for any job role
        </p>
      </div>

      {/* How it works */}
      <div className="card p-5 border-brand-500/20 bg-brand-500/5">
        <p className="text-brand-400 text-sm font-medium mb-2">How it works</p>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs text-dark-400">
          {[
            '① JD is embedded using text-embedding-3-small → 1536-dim vector',
            '② All student resumes are embedded & stored in vector store',
            '③ Cosine similarity computed between JD vector and each resume',
            '④ Top-K most compatible resumes returned, ranked by similarity',
          ].map((s, i) => (
            <div key={i} className="bg-dark-800/50 rounded-xl p-3">
              <p className="leading-relaxed">{s}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="card p-6 space-y-4">
        <h2 className="font-medium text-white">Search Configuration</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="label">Company *</label>
            <select className="input" value={selCo} onChange={e => { setSelCo(e.target.value); setSelRole(''); }}>
              <option value="">Select Company</option>
              {companies.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Role *</label>
            <select className="input" value={selRole} onChange={e => setSelRole(e.target.value)} disabled={!selCo}>
              <option value="">Select Role</option>
              {selCoData?.roles?.map(r => <option key={r._id} value={r._id}>{r.roleTitle}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Top K Results</label>
            <select className="input" value={topK} onChange={e => setTopK(Number(e.target.value))}>
              {[5, 10, 15, 20].map(n => <option key={n} value={n}>Top {n} students</option>)}
            </select>
          </div>
        </div>

        {selRole && selCoData && (
          <div className="bg-dark-800/50 rounded-xl p-4">
            <p className="text-dark-400 text-xs uppercase tracking-wider mb-2">Selected Role — Required Skills</p>
            <div className="flex flex-wrap gap-1.5">
              {selCoData.roles?.find(r => r._id === selRole)?.requiredSkills?.map(s => (
                <span key={s} className="badge bg-brand-500/10 text-brand-400 border-brand-500/20 text-xs">{s}</span>
              ))}
            </div>
          </div>
        )}

        <button onClick={handleSearch} disabled={loading || !selCo || !selRole} className="btn-primary w-full justify-center py-3">
          {loading
            ? <><Loader2 className="w-4 h-4 animate-spin" /> Running semantic search…</>
            : <><Search className="w-4 h-4" /> Find Best Matching Resumes</>}
        </button>
      </div>

      {/* Results */}
      {loading && (
        <div className="card p-10 text-center">
          <div className="w-16 h-16 bg-brand-500/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-glow-pulse">
            <Sparkles className="w-8 h-8 text-brand-400" />
          </div>
          <p className="font-display font-bold text-white text-lg">Computing semantic similarities…</p>
          <p className="text-dark-500 text-sm mt-1">Comparing JD vector against {topK * 5}+ resume embeddings</p>
        </div>
      )}

      {results && !loading && (
        <div className="space-y-4 animate-slide-up">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-white">
              {results.length} Matching Resumes Found
              {results.length > 0 && (
                <span className="text-dark-500 text-sm font-normal ml-2">
                  — avg similarity: {Math.round(results.reduce((s, r) => s + (r.similarityPercent || 0), 0) / results.length)}%
                </span>
              )}
            </h2>
            <div className="flex gap-2 text-xs">
              <span className="badge bg-green-500/10 text-green-400 border-green-500/20">75%+ Strong</span>
              <span className="badge bg-brand-500/10 text-brand-400 border-brand-500/20">55-74% Good</span>
              <span className="badge bg-yellow-500/10 text-yellow-400 border-yellow-500/20">35-54% Fair</span>
            </div>
          </div>

          {results.length === 0 ? (
            <div className="card p-12 text-center">
              <Users className="w-12 h-12 text-dark-700 mx-auto mb-4" />
              <p className="text-dark-400 font-medium">No matching resumes found</p>
              <p className="text-dark-600 text-sm mt-1">Students need to upload their resumes and run AI analysis first to populate the vector store.</p>
            </div>
          ) : (
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-dark-800/50 border-b border-dark-800">
                    <tr>
                      {['Rank', 'Student', 'Department', 'CGPA', 'Skills', 'Semantic Match', 'Resume'].map(h => (
                        <th key={h} className="text-left px-5 py-3 text-dark-400 font-medium text-xs uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-800">
                    {results.map((r, idx) => (
                      <tr key={idx} className="hover:bg-dark-800/30 transition-colors">
                        <td className="px-5 py-4">
                          <span className={cn(
                            'font-mono font-bold text-sm',
                            idx === 0 ? 'text-yellow-400' : idx === 1 ? 'text-slate-300' : idx === 2 ? 'text-amber-600' : 'text-dark-500'
                          )}>#{idx + 1}</span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-dark-700 rounded-full flex items-center justify-center text-dark-300 font-bold text-sm shrink-0">
                              {r.user?.name?.charAt(0) || '?'}
                            </div>
                            <div>
                              <p className="font-medium text-dark-200">{r.user?.name || 'Unknown'}</p>
                              <p className="text-dark-600 text-xs">{r.user?.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-dark-400">
                          {r.user?.department || '—'}
                        </td>
                        <td className="px-5 py-4">
                          <span className={cn('font-mono font-bold',
                            (r.user?.cgpa || 0) >= 8.5 ? 'text-green-400' : (r.user?.cgpa || 0) >= 7 ? 'text-brand-400' : 'text-dark-400')}>
                            {r.user?.cgpa || '—'}
                          </span>
                        </td>
                        <td className="px-5 py-4 max-w-xs">
                          <div className="flex flex-wrap gap-1">
                            {r.user?.skills?.slice(0, 4).map(sk => (
                              <span key={sk} className="badge bg-dark-700 text-dark-400 border-dark-600 text-xs">{sk}</span>
                            ))}
                            {(r.user?.skills?.length || 0) > 4 && (
                              <span className="text-dark-600 text-xs">+{r.user.skills.length - 4}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-4 w-48">
                          <SimilarityBar score={r.similarityPercent || 0} />
                        </td>
                        <td className="px-5 py-4">
                          {r.metadata?.resumeURL || r.user?.resumeURL ? (
                            <a href={r.metadata?.resumeURL || r.user?.resumeURL}
                              target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-1 text-brand-400 hover:text-brand-300 text-xs transition-colors">
                              <FileText className="w-3.5 h-3.5" /> View <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-dark-700 text-xs">No resume</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}