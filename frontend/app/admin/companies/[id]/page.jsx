'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { companyApi, aiApi } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
  ArrowLeft, Save, Loader2, Plus, Trash2, Edit3, Bell,
  Users, Sparkles, ChevronDown, ChevronUp, Calendar,
  Briefcase, ExternalLink, RefreshCw, Search
} from 'lucide-react';

function RoleCard({ role, companyId, onUpdated, onDeleted }) {
  const [open, setOpen]       = useState(false);
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [jdAnalysis, setJdAnalysis] = useState(null);
  const [similarResumes, setSimilarResumes] = useState(null);
  const [loadingSimilar, setLoadingSimilar] = useState(false);

  const { register, handleSubmit, reset } = useForm({ defaultValues: {
    roleTitle: role.roleTitle, salaryPackage: role.salaryPackage,
    jobDescription: role.jobDescription, openings: role.openings,
    requiredSkills: role.requiredSkills?.join(', '),
  }});

  const handleSave = async (data) => {
    setEditing(false);
    try {
      const payload = { ...data, requiredSkills: data.requiredSkills.split(',').map(s=>s.trim()).filter(Boolean) };
      await companyApi.updateRole(companyId, role._id, payload);
      toast.success('Role updated');
      onUpdated();
    } catch { toast.error('Update failed'); }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete role "${role.roleTitle}"?`)) return;
    setDeleting(true);
    try {
      await companyApi.deleteRole(companyId, role._id);
      toast.success('Role deleted');
      onDeleted();
    } catch { toast.error('Delete failed'); setDeleting(false); }
  };

  const analyzeJD = async () => {
    setAnalyzing(true);
    try {
      const { data } = await aiApi.analyzeJD({ companyId, roleId: role._id });
      setJdAnalysis(data.jdAnalysis);
      toast.success(data.cached ? 'JD analysis loaded (cached)' : 'JD analyzed!');
    } catch { toast.error('JD analysis failed'); }
    finally { setAnalyzing(false); }
  };

  const findSimilar = async () => {
    setLoadingSimilar(true);
    try {
      const { data } = await aiApi.findSimilarResumes({ companyId, roleId: role._id, topK: 8 });
      setSimilarResumes(data.results);
    } catch { toast.error('Semantic search failed'); }
    finally { setLoadingSimilar(false); }
  };

  return (
    <div className="card overflow-hidden">
      <div className="p-5 flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-display font-bold text-white">{role.roleTitle}</h3>
            <span className="badge bg-green-500/10 text-green-400 border-green-500/20 text-xs">{role.salaryPackage}</span>
            <span className="badge bg-dark-700 text-dark-400 border-dark-600 text-xs">{role.openings||1} opening{role.openings!==1?'s':''}</span>
            {!role.isActive && <span className="badge bg-red-500/10 text-red-400 border-red-500/20 text-xs">Inactive</span>}
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {role.requiredSkills?.slice(0,6).map(s=><span key={s} className="badge bg-dark-700 text-dark-300 border-dark-600 text-xs">{s}</span>)}
            {role.requiredSkills?.length>6 && <span className="text-dark-600 text-xs">+{role.requiredSkills.length-6}</span>}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={() => setOpen(p=>!p)} className="btn-ghost p-2">
            {open ? <ChevronUp className="w-4 h-4"/> : <ChevronDown className="w-4 h-4"/>}
          </button>
          <button onClick={() => { setEditing(true); setOpen(true); }} className="btn-secondary py-1.5 px-3 text-xs">
            <Edit3 className="w-3.5 h-3.5"/> Edit
          </button>
          <button onClick={handleDelete} disabled={deleting} className="btn-danger py-1.5 px-3">
            {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin"/> : <Trash2 className="w-3.5 h-3.5"/>}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-dark-800 p-5 space-y-5">
          {editing ? (
            <form onSubmit={handleSubmit(handleSave)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div><label className="label">Role Title</label><input className="input" {...register('roleTitle',{required:true})}/></div>
                <div><label className="label">Salary</label><input className="input" {...register('salaryPackage',{required:true})}/></div>
                <div><label className="label">Openings</label><input type="number" min="1" className="input" {...register('openings')}/></div>
                <div><label className="label">Required Skills (comma-separated)</label><input className="input" {...register('requiredSkills')}/></div>
                <div className="sm:col-span-2"><label className="label">Job Description</label><textarea rows={4} className="input resize-none" {...register('jobDescription',{required:true})}/></div>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="btn-primary text-sm"><Save className="w-4 h-4"/> Save</button>
                <button type="button" onClick={() => setEditing(false)} className="btn-secondary text-sm">Cancel</button>
              </div>
            </form>
          ) : (
            <>
              <div>
                <p className="text-xs text-dark-500 uppercase tracking-wider mb-2">Job Description</p>
                <p className="text-dark-400 text-sm leading-relaxed">{role.jobDescription}</p>
              </div>
              {role.responsibilities?.length>0 && (
                <div>
                  <p className="text-xs text-dark-500 uppercase tracking-wider mb-2">Responsibilities</p>
                  <ul className="space-y-1">{role.responsibilities.map((r,i)=><li key={i} className="text-dark-400 text-sm flex gap-2"><span className="text-brand-500 shrink-0">›</span>{r}</li>)}</ul>
                </div>
              )}
              {role.interviewRounds?.length>0 && (
                <div>
                  <p className="text-xs text-dark-500 uppercase tracking-wider mb-2">Interview Rounds</p>
                  <div className="flex flex-wrap gap-2">{role.interviewRounds.map((r,i)=><span key={i} className="badge bg-dark-700 text-dark-300 border-dark-600 text-xs">{i+1}. {r}</span>)}</div>
                </div>
              )}
            </>
          )}

          {/* AI Actions */}
          <div className="pt-3 border-t border-dark-800 flex flex-wrap gap-2">
            <button onClick={analyzeJD} disabled={analyzing} className="btn-secondary text-xs py-1.5 px-3">
              {analyzing ? <Loader2 className="w-3.5 h-3.5 animate-spin"/> : <Sparkles className="w-3.5 h-3.5"/>}
              {jdAnalysis ? 'Re-analyze JD' : 'AI Analyze JD'}
            </button>
            <button onClick={findSimilar} disabled={loadingSimilar} className="btn-secondary text-xs py-1.5 px-3">
              {loadingSimilar ? <Loader2 className="w-3.5 h-3.5 animate-spin"/> : <Search className="w-3.5 h-3.5"/>}
              Find Matching Resumes
            </button>
          </div>

          {/* JD Analysis result */}
          {jdAnalysis && (
            <div className="bg-dark-800/50 rounded-xl p-4 space-y-3">
              <p className="text-white font-medium text-sm">JD Intelligence</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[{l:'Level',v:jdAnalysis.roleLevel},{l:'Difficulty',v:jdAnalysis.estimatedDifficulty},{l:'Prep',v:`${jdAnalysis.preparationWeeks||2}w`},{l:'Salary',v:jdAnalysis.salaryInsight}].map(i=>(
                  <div key={i.l} className="bg-dark-700 rounded-lg p-2 text-center">
                    <p className="text-dark-500 text-xs">{i.l}</p>
                    <p className="text-dark-200 text-sm font-medium mt-0.5">{i.v||'—'}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {jdAnalysis.mustHaveSkills?.map(s=><span key={s} className="badge bg-red-500/10 text-red-400 border-red-500/20 text-xs">must: {s}</span>)}
                {jdAnalysis.niceToHaveSkills?.map(s=><span key={s} className="badge bg-dark-700 text-dark-400 border-dark-600 text-xs">nice: {s}</span>)}
              </div>
            </div>
          )}

          {/* Similar resumes */}
          {similarResumes && (
            <div className="bg-dark-800/50 rounded-xl p-4">
              <p className="text-white font-medium text-sm mb-3">Semantically Similar Resumes (RAG)</p>
              <div className="space-y-2">
                {similarResumes.slice(0,6).map((r,i)=>(
                  <div key={i} className="flex items-center gap-3 bg-dark-700 rounded-lg px-3 py-2">
                    <div className="w-7 h-7 bg-brand-500/20 rounded-full flex items-center justify-center text-brand-400 font-bold text-xs shrink-0">
                      {r.user?.name?.charAt(0)||'?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-dark-200 text-sm font-medium truncate">{r.user?.name||'Unknown'}</p>
                      <p className="text-dark-500 text-xs truncate">{r.user?.department} · CGPA {r.user?.cgpa}</p>
                    </div>
                    <span className={`font-mono text-sm font-bold shrink-0 ${r.similarityPercent>=75?'text-green-400':r.similarityPercent>=50?'text-brand-400':'text-dark-400'}`}>
                      {r.similarityPercent}%
                    </span>
                  </div>
                ))}
                {similarResumes.length===0 && <p className="text-dark-500 text-sm">No matching resumes found. Students need to upload resumes first.</p>}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminCompanyDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [addingRole, setAddingRole] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updateData, setUpdateData] = useState({ title:'', content:'' });

  const { register, handleSubmit, reset, formState:{errors} } = useForm();
  const { register: rr, handleSubmit: rhs, reset: rreset } = useForm();

  const fetch = async () => {
    try { const { data } = await companyApi.getById(id); setCompany(data.company); }
    catch { toast.error('Failed to load company'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [id]);

  const onSaveCompany = async (data) => {
    setSaving(true);
    try {
      await companyApi.update(id, data);
      toast.success('Company updated!');
      fetch();
    } catch { toast.error('Update failed'); }
    finally { setSaving(false); }
  };

  const onAddRole = async (data) => {
    try {
      const payload = {
        ...data,
        requiredSkills: data.requiredSkills.split(',').map(s=>s.trim()).filter(Boolean),
        responsibilities: data.responsibilities?.split('\n').filter(Boolean)||[],
        interviewRounds: data.interviewRounds?.split(',').map(s=>s.trim()).filter(Boolean)||[],
        openings: Number(data.openings)||1,
        eligibilityCriteria: {
          minCGPA: data.minCGPA ? Number(data.minCGPA) : undefined,
        }
      };
      await companyApi.addRole(id, payload);
      toast.success('Role added!');
      setAddingRole(false); rreset(); fetch();
    } catch (err) { toast.error(err.response?.data?.message||'Failed'); }
  };

  const postUpdate = async () => {
    if (!updateData.title || !updateData.content) return;
    try {
      await companyApi.postUpdate(id, updateData);
      toast.success('Update posted!');
      setShowUpdateForm(false);
      setUpdateData({ title:'', content:'' });
      fetch();
    } catch { toast.error('Failed to post update'); }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-brand-400 animate-spin"/></div>;
  if (!company) return <div className="text-dark-400 text-center py-20">Company not found</div>;

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/companies" className="btn-ghost p-2"><ArrowLeft className="w-5 h-5"/></Link>
        <div className="flex-1">
          <h1 className="font-display text-3xl font-bold text-white">{company.name}</h1>
          <p className="text-dark-400 mt-0.5">{company.industry} · {company.headquarters}</p>
        </div>
        <span className={`badge ${company.isActive?'bg-green-500/10 text-green-400 border-green-500/20':'bg-dark-700 text-dark-400 border-dark-600'}`}>
          {company.isActive?'Active':'Inactive'}
        </span>
      </div>

      {/* Company form */}
      <form onSubmit={handleSubmit(onSaveCompany)} className="card p-6 space-y-4">
        <h2 className="font-display font-bold text-white">Company Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2"><label className="label">Name</label>
            <input className="input" defaultValue={company.name} {...register('name',{required:true})}/></div>
          <div className="sm:col-span-2"><label className="label">Description</label>
            <textarea rows={3} className="input resize-none" defaultValue={company.description} {...register('description',{required:true})}/></div>
          <div><label className="label">Industry</label><input className="input" defaultValue={company.industry} {...register('industry')}/></div>
          <div><label className="label">Headquarters</label><input className="input" defaultValue={company.headquarters} {...register('headquarters')}/></div>
          <div><label className="label">Website</label><input type="url" className="input" defaultValue={company.website} {...register('website')}/></div>
          <div><label className="label">Drive Date</label><input type="date" className="input" defaultValue={company.driveSchedule?.split('T')[0]} {...register('driveSchedule')}/></div>
          <div className="sm:col-span-2"><label className="label">Venue</label><input className="input" defaultValue={company.driveVenue} {...register('driveVenue')}/></div>
        </div>
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? <><Loader2 className="w-4 h-4 animate-spin"/>Saving...</> : <><Save className="w-4 h-4"/>Save Changes</>}
        </button>
      </form>

      {/* Roles */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-white">Job Roles ({company.roles?.length||0})</h2>
          <button onClick={() => setAddingRole(p=>!p)} className="btn-secondary text-sm">
            <Plus className="w-4 h-4"/> Add Role
          </button>
        </div>

        {addingRole && (
          <form onSubmit={rhs(onAddRole)} className="card p-5 space-y-4 border-brand-500/30">
            <p className="font-medium text-white">New Role</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div><label className="label">Title</label><input className="input" {...rr('roleTitle',{required:true})}/></div>
              <div><label className="label">Salary</label><input className="input" {...rr('salaryPackage',{required:true})}/></div>
              <div><label className="label">Openings</label><input type="number" min="1" className="input" defaultValue={1} {...rr('openings')}/></div>
              <div><label className="label">Min CGPA</label><input type="number" step="0.1" className="input" {...rr('minCGPA')}/></div>
              <div className="sm:col-span-2"><label className="label">Job Description</label><textarea rows={3} className="input resize-none" {...rr('jobDescription',{required:true})}/></div>
              <div className="sm:col-span-2"><label className="label">Required Skills (comma-separated)</label><input className="input" {...rr('requiredSkills',{required:true})}/></div>
              <div><label className="label">Interview Rounds (comma-separated)</label><input className="input" {...rr('interviewRounds')}/></div>
              <div><label className="label">Responsibilities (one per line)</label><textarea rows={2} className="input resize-none" {...rr('responsibilities')}/></div>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn-primary text-sm"><Plus className="w-4 h-4"/>Add Role</button>
              <button type="button" onClick={() => setAddingRole(false)} className="btn-secondary text-sm">Cancel</button>
            </div>
          </form>
        )}

        {company.roles?.map(role=>(
          <RoleCard key={role._id} role={role} companyId={id} onUpdated={fetch} onDeleted={fetch}/>
        ))}
        {company.roles?.length===0 && <div className="card p-8 text-center text-dark-500"><Briefcase className="w-8 h-8 mx-auto mb-2 text-dark-700"/>No roles yet. Add one above.</div>}
      </div>

      {/* Updates */}
      <div className="card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-white">Company Updates ({company.updates?.length||0})</h2>
          <button onClick={() => setShowUpdateForm(p=>!p)} className="btn-secondary text-sm">
            <Bell className="w-4 h-4"/> Post Update
          </button>
        </div>

        {showUpdateForm && (
          <div className="card p-4 space-y-3 border-brand-500/30">
            <input className="input" placeholder="Update title..." value={updateData.title} onChange={e=>setUpdateData(p=>({...p,title:e.target.value}))}/>
            <textarea rows={3} className="input resize-none" placeholder="Update content..." value={updateData.content} onChange={e=>setUpdateData(p=>({...p,content:e.target.value}))}/>
            <div className="flex gap-2">
              <button onClick={postUpdate} className="btn-primary text-sm"><Bell className="w-4 h-4"/>Post</button>
              <button onClick={()=>setShowUpdateForm(false)} className="btn-secondary text-sm">Cancel</button>
            </div>
          </div>
        )}

        <div className="space-y-3 max-h-72 overflow-y-auto">
          {company.updates?.slice().reverse().map((u,i)=>(
            <div key={i} className="bg-dark-800/50 rounded-xl p-3">
              <p className="font-medium text-white text-sm">{u.title}</p>
              <p className="text-dark-400 text-xs mt-1">{u.content}</p>
              <p className="text-dark-600 text-xs mt-2">{formatDate(u.createdAt)}</p>
            </div>
          ))}
          {!company.updates?.length && <p className="text-dark-600 text-sm">No updates posted yet.</p>}
        </div>
      </div>
    </div>
  );
}