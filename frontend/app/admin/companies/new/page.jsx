'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { companyApi } from '@/lib/api';
import { DEPARTMENTS, SEMESTERS } from '@/lib/utils';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { ArrowLeft, Plus, Trash2, Loader2, Building2, Save } from 'lucide-react';

export default function NewCompanyPage() {
  const router = useRouter();
  const [saving, setSaving]  = useState(false);
  const [skillInput, setSkillInput] = useState('');

  const { register, handleSubmit, control, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      name: '', description: '', website: '', industry: '', headquarters: '', driveVenue: '',
      roles: [{
        roleTitle: '', salaryPackage: '', jobDescription: '', openings: 1,
        requiredSkills: [], responsibilities: [], interviewRounds: [],
        eligibilityCriteria: { minCGPA: '', allowedDepartments: [], allowedSemesters: [] }
      }]
    }
  });

  const { fields: roleFields, append: appendRole, remove: removeRole } = useFieldArray({ control, name: 'roles' });

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      // Clean up roles
      const roles = data.roles.map((r) => ({
        ...r,
        requiredSkills: typeof r.requiredSkills === 'string'
          ? r.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean)
          : r.requiredSkills || [],
        responsibilities: typeof r.responsibilities === 'string'
          ? r.responsibilities.split('\n').filter(Boolean)
          : r.responsibilities || [],
        interviewRounds: typeof r.interviewRounds === 'string'
          ? r.interviewRounds.split(',').map((s) => s.trim()).filter(Boolean)
          : r.interviewRounds || [],
        eligibilityCriteria: {
          minCGPA: r.eligibilityCriteria?.minCGPA ? Number(r.eligibilityCriteria.minCGPA) : undefined,
          allowedDepartments: r.eligibilityCriteria?.allowedDepartments || [],
          allowedSemesters: r.eligibilityCriteria?.allowedSemesters?.map(Number) || [],
        }
      }));
      const payload = { ...data, roles };
      const { data: res } = await companyApi.create(payload);
      toast.success(`${data.name} created!`);
      router.push(`/admin/companies`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create company');
    } finally { setSaving(false); }
  };

  return (
    <div className="max-w-4xl space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Link href="/admin/companies" className="btn-ghost p-2"><ArrowLeft className="w-5 h-5" /></Link>
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Add Company</h1>
          <p className="text-dark-400 mt-0.5">Create a new placement drive</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Company Info */}
        <div className="card p-6 space-y-4">
          <h2 className="font-display font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-brand-400" /> Company Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="label">Company Name *</label>
              <input className={errors.name ? 'input-error' : 'input'} placeholder="Google, Microsoft..."
                {...register('name', { required: 'Company name is required' })} />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div className="sm:col-span-2">
              <label className="label">Description *</label>
              <textarea rows={3} className="input resize-none" placeholder="Brief company description..."
                {...register('description', { required: 'Description required', minLength: { value: 10, message: 'Too short' } })} />
              {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>}
            </div>
            <div>
              <label className="label">Industry</label>
              <input className="input" placeholder="Technology, Finance..." {...register('industry')} />
            </div>
            <div>
              <label className="label">Headquarters</label>
              <input className="input" placeholder="Bangalore, India" {...register('headquarters')} />
            </div>
            <div>
              <label className="label">Website</label>
              <input type="url" className="input" placeholder="https://careers.company.com" {...register('website')} />
            </div>
            <div>
              <label className="label">Drive Date</label>
              <input type="date" className="input" {...register('driveSchedule')} />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Venue</label>
              <input className="input" placeholder="Main Auditorium, Block A" {...register('driveVenue')} />
            </div>
          </div>
        </div>

        {/* Roles */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-white">Job Roles</h2>
            <button type="button" onClick={() => appendRole({
              roleTitle: '', salaryPackage: '', jobDescription: '', openings: 1,
              requiredSkills: [], responsibilities: [], interviewRounds: [],
              eligibilityCriteria: { minCGPA: '', allowedDepartments: [], allowedSemesters: [] }
            })} className="btn-secondary text-sm">
              <Plus className="w-4 h-4" /> Add Role
            </button>
          </div>

          {roleFields.map((field, idx) => (
            <div key={field.id} className="card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-white">Role {idx + 1}</h3>
                {roleFields.length > 1 && (
                  <button type="button" onClick={() => removeRole(idx)} className="btn-danger py-1.5 px-3 text-xs">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Role Title *</label>
                  <input className="input" placeholder="Software Engineer, Data Analyst..."
                    {...register(`roles.${idx}.roleTitle`, { required: 'Required' })} />
                </div>
                <div>
                  <label className="label">Salary Package *</label>
                  <input className="input" placeholder="12 LPA, $80,000..."
                    {...register(`roles.${idx}.salaryPackage`, { required: 'Required' })} />
                </div>
                <div>
                  <label className="label">Openings</label>
                  <input type="number" min="1" className="input" {...register(`roles.${idx}.openings`)} />
                </div>
              </div>

              <div>
                <label className="label">Job Description *</label>
                <textarea rows={4} className="input resize-none"
                  placeholder="Describe the role, responsibilities, tech stack expectations..."
                  {...register(`roles.${idx}.jobDescription`, { required: 'JD is required', minLength: { value: 20, message: 'Min 20 chars' } })} />
              </div>

              <div>
                <label className="label">Required Skills * (comma-separated)</label>
                <input className="input" placeholder="React, Node.js, MongoDB, System Design..."
                  {...register(`roles.${idx}.requiredSkills`, { required: 'Required skills needed' })} />
              </div>

              <div>
                <label className="label">Responsibilities (one per line)</label>
                <textarea rows={3} className="input resize-none"
                  placeholder="Design scalable APIs&#10;Lead code reviews&#10;Collaborate with product team"
                  {...register(`roles.${idx}.responsibilities`)} />
              </div>

              <div>
                <label className="label">Interview Rounds (comma-separated)</label>
                <input className="input" placeholder="Online Test, Technical Round 1, HR Round..."
                  {...register(`roles.${idx}.interviewRounds`)} />
              </div>

              <div className="bg-dark-800/50 rounded-xl p-4 space-y-3">
                <p className="text-dark-400 text-sm font-medium">Eligibility Criteria</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="label text-xs">Min CGPA</label>
                    <input type="number" step="0.1" min="0" max="10" className="input text-sm"
                      placeholder="7.0" {...register(`roles.${idx}.eligibilityCriteria.minCGPA`)} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label text-xs">Allowed Departments</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {DEPARTMENTS.slice(0, 6).map((dept) => (
                        <label key={dept} className="flex items-center gap-1.5 text-xs text-dark-300 cursor-pointer">
                          <input type="checkbox" value={dept}
                            {...register(`roles.${idx}.eligibilityCriteria.allowedDepartments`)}
                            className="rounded border-dark-600 bg-dark-700" />
                          {dept.split(' ')[0]}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="label text-xs">Allowed Semesters</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {[5, 6, 7, 8].map((sem) => (
                        <label key={sem} className="flex items-center gap-1.5 text-xs text-dark-300 cursor-pointer">
                          <input type="checkbox" value={sem}
                            {...register(`roles.${idx}.eligibilityCriteria.allowedSemesters`)}
                            className="rounded border-dark-600 bg-dark-700" />
                          Sem {sem}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <Link href="/admin/companies" className="btn-secondary">Cancel</Link>
          <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center py-3">
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</> : <><Save className="w-4 h-4" /> Create Company</>}
          </button>
        </div>
      </form>
    </div>
  );
}