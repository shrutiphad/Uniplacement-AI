  'use client';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { companyApi, applicationApi, aiApi } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
  ArrowLeft, Loader2, MapPin, Globe, Calendar, Briefcase,
  CheckCircle, XCircle, Sparkles, Send, Bell, ExternalLink
} from 'lucide-react';

export default function StudentCompanyDetailPage() {
  const { id }        = useParams();
  const searchParams  = useSearchParams();
  const preRole       = searchParams.get('role');
  const { user }      = useAuth();

  const [company, setCompany]         = useState(null);
  const [loading, setLoading]         = useState(true);
  const [applying, setApplying]       = useState(null);
  const [eligibility, setEligibility] = useState({});
  const [activeRole, setActiveRole]   = useState(preRole || null);
  const [analyzingJD, setAnalyzingJD] = useState(null);
  const [jdMap, setJdMap]             = useState({});

  useEffect(() => {
    Promise.all([
      companyApi.getById(id),
      companyApi.checkEligibility(id),
    ]).then(([co, el]) => {
      setCompany(co.data.company);
      setEligibility(el.data.eligibilityMap || {});
      if (preRole) setActiveRole(preRole);
    }).catch(() => toast.error('Failed to load company'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleApply = async (roleId) => {
    if (!user?.resumeURL) { toast.error('Upload your resume in Profile before applying!'); return; }
    setApplying(roleId);
    try {
      await applicationApi.apply({ companyId: id, roleId });
      toast.success('Application submitted! 🎉');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Application failed');
    } finally { setApplying(null); }
  };

  const analyzeJD = async (roleId) => {
    setAnalyzingJD(roleId);
    try {
      const { data } = await aiApi.analyzeJD({ companyId: id, roleId });
      setJdMap(p => ({ ...p, [roleId]: data.jdAnalysis }));
      toast.success('JD analyzed!');
    } catch { toast.error('JD analysis failed'); }
    finally { setAnalyzingJD(null); }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-brand-400 animate-spin"/></div>;
  if (!company) return <div className="text-dark-400 text-center py-20">Company not found</div>;

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      {/* Back */}
      <div className="flex items-center gap-4">
        <Link href="/student/companies" className="btn-ghost p-2"><ArrowLeft className="w-5 h-5"/></Link>
        <div className="flex-1">
          <h1 className="font-display text-3xl font-bold text-white">{company.name}</h1>
          <div className="flex flex-wrap items-center gap-4 mt-1 text-sm text-dark-500">
            {company.industry && <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5"/>{company.industry}</span>}
            {company.headquarters && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5"/>{company.headquarters}</span>}
            {company.driveSchedule && <span className="flex items-center gap-1.5 text-brand-400"><Calendar className="w-3.5 h-3.5"/>Drive: {formatDate(company.driveSchedule)}</span>}
            {company.website && <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-brand-400 transition-colors"><Globe className="w-3.5 h-3.5"/>Website <ExternalLink className="w-3 h-3"/></a>}
          </div>
        </div>
      </div>

      {/* About */}
      <div className="card p-6">
        <h2 className="font-display font-bold text-white mb-3">About {company.name}</h2>
        <p className="text-dark-400 text-sm leading-relaxed">{company.description}</p>
      </div>

      {/* Updates */}
      {company.updates?.length > 0 && (
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Bell className="w-4 h-4 text-brand-400"/>
            <h2 className="font-medium text-white">Latest Updates</h2>
          </div>
          <div className="space-y-3">
            {company.updates.slice().reverse().slice(0,3).map((u,i)=>(
              <div key={i} className="border-l-2 border-brand-500/30 pl-3">
                <p className="font-medium text-dark-200 text-sm">{u.title}</p>
                <p className="text-dark-500 text-xs mt-0.5">{u.content}</p>
                <p className="text-dark-700 text-xs mt-1">{formatDate(u.createdAt)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Roles */}
      <div className="space-y-4">
        <h2 className="font-display font-bold text-white">Open Roles ({company.roles?.filter(r=>r.isActive).length||0})</h2>

        {company.roles?.filter(r=>r.isActive).map(role => {
          const el  = eligibility[role._id];
          const jda = jdMap[role._id];
          const isOpen = activeRole === role._id;

          return (
            <div key={role._id} className={`card overflow-hidden transition-all duration-200 ${isOpen ? 'border-brand-500/30' : ''}`}>
              <div className="p-5 flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-display font-bold text-white text-lg">{role.roleTitle}</h3>
                    <span className="badge bg-green-500/10 text-green-400 border-green-500/20">{role.salaryPackage}</span>
                    {role.openings && <span className="badge bg-dark-700 text-dark-400 border-dark-600 text-xs">{role.openings} opening{role.openings!==1?'s':''}</span>}
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {role.requiredSkills?.slice(0,6).map(s=><span key={s} className="badge bg-dark-700 text-dark-300 border-dark-600 text-xs">{s}</span>)}
                    {role.requiredSkills?.length>6&&<span className="text-dark-600 text-xs">+{role.requiredSkills.length-6}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 flex-col sm:flex-row">
                  {el && (
                    <div className={`flex items-center gap-1.5 text-xs font-medium ${el.eligible?'text-green-400':'text-red-400'}`}>
                      {el.eligible ? <CheckCircle className="w-4 h-4"/> : <XCircle className="w-4 h-4"/>}
                      {el.eligible ? 'Eligible' : 'Not Eligible'}
                    </div>
                  )}
                  <button onClick={() => setActiveRole(isOpen ? null : role._id)} className="btn-secondary text-xs py-1.5 px-3">
                    {isOpen ? 'Collapse' : 'View Details'}
                  </button>
                  <button
                    onClick={() => handleApply(role._id)}
                    disabled={applying===role._id || (el && !el.eligible)}
                    className={`text-xs py-1.5 px-4 rounded-lg font-medium transition-all inline-flex items-center gap-1.5 ${
                      el && !el.eligible ? 'bg-dark-700 text-dark-500 cursor-not-allowed' : 'btn-primary'
                    }`}>
                    {applying===role._id ? <Loader2 className="w-3.5 h-3.5 animate-spin"/> : <Send className="w-3.5 h-3.5"/>}
                    Apply
                  </button>
                </div>
              </div>

              {isOpen && (
                <div className="border-t border-dark-800 p-5 space-y-5">
                  {el && (
                    <div className={`flex items-start gap-2.5 p-3 rounded-xl border text-sm ${el.eligible ? 'bg-green-500/5 border-green-500/20 text-green-400' : 'bg-red-500/5 border-red-500/20 text-red-400'}`}>
                      {el.eligible ? <CheckCircle className="w-4 h-4 shrink-0 mt-0.5"/> : <XCircle className="w-4 h-4 shrink-0 mt-0.5"/>}
                      <div>
                        {el.eligible ? 'You meet all eligibility criteria for this role.' : (
                          <div>
                            <p className="font-medium">You are not eligible for this role:</p>
                            <ul className="mt-1 space-y-0.5">{el.reasons?.map((r,i)=><li key={i} className="text-xs opacity-80">• {r}</li>)}</ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="text-xs text-dark-400 uppercase tracking-wider mb-2">Job Description</p>
                    <p className="text-dark-400 text-sm leading-relaxed whitespace-pre-line">{role.jobDescription}</p>
                  </div>

                  {role.responsibilities?.length>0 && (
                    <div>
                      <p className="text-xs text-dark-400 uppercase tracking-wider mb-2">Responsibilities</p>
                      <ul className="space-y-1.5">{role.responsibilities.map((r,i)=><li key={i} className="text-dark-400 text-sm flex gap-2"><span className="text-brand-500 shrink-0">›</span>{r}</li>)}</ul>
                    </div>
                  )}

                  <div>
                    <p className="text-xs text-dark-400 uppercase tracking-wider mb-2">All Required Skills</p>
                    <div className="flex flex-wrap gap-2">{role.requiredSkills?.map(s=>{
                      const has = user?.skills?.some(us=>us.toLowerCase()===s.toLowerCase());
                      return <span key={s} className={`badge text-xs ${has?'bg-green-500/10 text-green-400 border-green-500/20':'bg-red-500/10 text-red-400 border-red-500/20'}`}>{has?'✓':'+set'} {s}</span>;
                    })}</div>
                    <p className="text-dark-600 text-xs mt-2">Green = you have it · Red = missing from your profile</p>
                  </div>

                  {role.interviewRounds?.length>0 && (
                    <div>
                      <p className="text-xs text-dark-400 uppercase tracking-wider mb-2">Interview Process</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        {role.interviewRounds.map((r,i)=>(
                          <div key={i} className="flex items-center gap-2">
                            <span className="badge bg-dark-700 text-dark-300 border-dark-600 text-xs">{i+1}. {r}</span>
                            {i<role.interviewRounds.length-1 && <span className="text-dark-700">→</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-2 border-t border-dark-800 flex flex-wrap gap-2">
                    <button onClick={() => analyzeJD(role._id)} disabled={analyzingJD===role._id} className="btn-secondary text-xs py-1.5 px-3">
                      {analyzingJD===role._id ? <Loader2 className="w-3.5 h-3.5 animate-spin"/> : <Sparkles className="w-3.5 h-3.5"/>}
                      {jda ? 'Refresh JD Analysis' : 'AI Analyze This JD'}
                    </button>
                    <Link href={`/student/interview-prep?company=${id}&role=${role._id}`} className="btn-secondary text-xs py-1.5 px-3">
                      <Sparkles className="w-3.5 h-3.5"/>Generate Interview Prep
                    </Link>
                    <Link href={`/student/ai-resume?company=${id}&role=${role._id}`} className="btn-secondary text-xs py-1.5 px-3">
                      Analyze My Resume for This Role
                    </Link>
                  </div>

                  {jda && (
                    <div className="bg-dark-800/50 rounded-xl p-4 space-y-3">
                      <p className="text-white font-medium text-sm">AI JD Intelligence</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[{l:'Level',v:jda.roleLevel},{l:'Difficulty',v:jda.estimatedDifficulty},{l:'Prep',v:`${jda.preparationWeeks||2}w`},{l:'Salary',v:jda.salaryInsight}].map(item=>(
                          <div key={item.l} className="bg-dark-700/50 rounded-lg p-2 text-center">
                            <p className="text-dark-500 text-xs">{item.l}</p>
                            <p className="text-dark-200 text-sm font-medium mt-0.5">{item.v||'—'}</p>
                          </div>
                        ))}
                      </div>
                      {jda.mustHaveSkills?.length>0 && (
                        <div>
                          <p className="text-dark-500 text-xs mb-1.5">Must-have skills</p>
                          <div className="flex flex-wrap gap-1.5">{jda.mustHaveSkills.map(s=><span key={s} className="badge bg-red-500/10 text-red-400 border-red-500/20 text-xs">{s}</span>)}</div>
                        </div>
                      )}
                      {jda.companyCultureHints?.length>0 && (
                        <div>
                          <p className="text-dark-500 text-xs mb-1.5">Culture signals</p>
                          <div className="flex flex-wrap gap-1.5">{jda.companyCultureHints.map((h,i)=><span key={i} className="badge bg-dark-700 text-dark-400 border-dark-600 text-xs">{h}</span>)}</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
