'use client';
import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { userApi } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { DEPARTMENTS, SEMESTERS } from '@/lib/utils';
import toast from 'react-hot-toast';
import {
  User, Upload, Save, Loader2, CheckCircle2, X,
  FileText, Plus, ExternalLink, Github, Linkedin
} from 'lucide-react';

export default function StudentProfilePage() {
  const { user, updateLocalUser, refreshUser } = useAuth();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState(user?.skills || []);
  const fileRef = useRef(null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || '',
      department: user?.department || '',
      semester: user?.semester || '',
      cgpa: user?.cgpa || '',
      bio: user?.bio || '',
      linkedIn: user?.linkedIn || '',
      github: user?.github || '',
      phone: user?.phone || '',
    }
  });

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !skills.includes(s)) {
      setSkills([...skills, s]);
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => setSkills(skills.filter((s) => s !== skill));

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const { data: res } = await userApi.updateProfile({ ...data, skills });
      updateLocalUser(res.user);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally { setSaving(false); }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') { toast.error('Only PDF files allowed'); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error('File too large. Max 5MB'); return; }

    setUploading(true);
    const formData = new FormData();
    formData.append('resume', file);
    try {
      const { data } = await userApi.uploadResume(formData);
      updateLocalUser({ resumeURL: data.resumeURL });
      toast.success('Resume uploaded successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally { setUploading(false); }
  };

  return (
    <div className="max-w-3xl space-y-8 animate-fade-in">
      <div>
        <h1 className="font-display text-3xl font-bold text-white">Profile</h1>
        <p className="text-dark-400 mt-1">Keep your profile complete to maximize eligibility</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Avatar + Resume */}
        <div className="card p-6 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-20 h-20 bg-brand-500/20 rounded-2xl flex items-center justify-center text-brand-400 font-display font-bold text-3xl flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <p className="font-medium text-white text-lg">{user?.name}</p>
            <p className="text-dark-500 text-sm">{user?.email}</p>
            <p className="text-dark-600 text-xs mt-1">
              {user?.department ? `${user.department} · Sem ${user.semester}` : 'Complete your profile'}
            </p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <input type="file" ref={fileRef} accept=".pdf" className="hidden" onChange={handleResumeUpload} />
            <button type="button" onClick={() => fileRef.current?.click()}
              disabled={uploading} className="btn-secondary text-sm">
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {user?.resumeURL ? 'Replace Resume' : 'Upload Resume'}
            </button>
            {user?.resumeURL && (
              <a href={user.resumeURL} target="_blank" rel="noopener noreferrer"
                className="text-brand-400 text-xs hover:text-brand-300 flex items-center gap-1">
                <FileText className="w-3 h-3" /> View Current Resume
              </a>
            )}
          </div>
        </div>

        {/* Basic Info */}
        <div className="card p-6 space-y-4">
          <h2 className="font-display font-bold text-white">Basic Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Full Name</label>
              <input className={errors.name ? 'input-error' : 'input'} {...register('name', { required: 'Required' })} />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="label">Phone</label>
              <input type="tel" placeholder="+91 98765 43210" className="input" {...register('phone')} />
            </div>
            <div>
              <label className="label">Department</label>
              <select className="input" {...register('department', { required: 'Required' })}>
                <option value="">Select</option>
                {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              {errors.department && <p className="text-red-400 text-xs mt-1">{errors.department.message}</p>}
            </div>
            <div>
              <label className="label">Semester</label>
              <select className="input" {...register('semester', { required: 'Required' })}>
                <option value="">Select</option>
                {SEMESTERS.map((s) => <option key={s} value={s}>Semester {s}</option>)}
              </select>
            </div>
            <div>
              <label className="label">CGPA (out of 10)</label>
              <input type="number" step="0.01" min="0" max="10" placeholder="8.50" className="input"
                {...register('cgpa', { min: { value: 0, message: 'Min 0' }, max: { value: 10, message: 'Max 10' } })} />
              {errors.cgpa && <p className="text-red-400 text-xs mt-1">{errors.cgpa.message}</p>}
            </div>
            <div className="sm:col-span-2">
              <label className="label">Bio (optional)</label>
              <textarea rows={3} className="input resize-none" placeholder="Tell recruiters about yourself..."
                {...register('bio', { maxLength: { value: 500, message: 'Max 500 chars' } })} />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="card p-6 space-y-4">
          <h2 className="font-display font-bold text-white">Social Links</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label flex items-center gap-1.5"><Linkedin className="w-3.5 h-3.5" /> LinkedIn</label>
              <input placeholder="https://linkedin.com/in/yourname" className="input" {...register('linkedIn')} />
            </div>
            <div>
              <label className="label flex items-center gap-1.5"><Github className="w-3.5 h-3.5" /> GitHub</label>
              <input placeholder="https://github.com/yourname" className="input" {...register('github')} />
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="card p-6 space-y-4">
          <h2 className="font-display font-bold text-white">Skills</h2>
          <div className="flex gap-2">
            <input className="input" placeholder="Add a skill (e.g. React, Python...)"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }} />
            <button type="button" onClick={addSkill} className="btn-secondary px-4 flex-shrink-0">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span key={skill} className="badge bg-brand-500/10 text-brand-400 border-brand-500/20 text-sm gap-2 py-1">
                {skill}
                <button type="button" onClick={() => removeSkill(skill)} className="hover:text-red-400 transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {skills.length === 0 && <p className="text-dark-500 text-sm">No skills added yet</p>}
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn-primary w-full justify-center py-3">
          {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save Profile</>}
        </button>
      </form>
    </div>
  );
}