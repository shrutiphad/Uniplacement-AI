'use client';
import { useEffect, useState } from 'react';
import { companyApi } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
  Plus, Search, Building2, Calendar, Users, Edit3,
  Trash2, Loader2, ExternalLink, ChevronRight
} from 'lucide-react';

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState(null);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const { data } = await companyApi.getAll({ search, limit: 50 });
      setCompanies(data.companies);
    } catch { toast.error('Failed to load companies'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCompanies(); }, [search]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete ${name}? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await companyApi.delete(id);
      toast.success(`${name} deleted`);
      fetchCompanies();
    } catch { toast.error('Failed to delete company'); }
    finally { setDeleting(null); }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Companies</h1>
          <p className="text-dark-400 mt-1">Manage placement drives and job roles</p>
        </div>
        <Link href="/admin/companies/new" className="btn-primary">
          <Plus className="w-4 h-4" /> Add Company
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
        <input type="text" placeholder="Search companies..." className="input pl-10"
          value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-brand-400 animate-spin" /></div>
      ) : companies.length === 0 ? (
        <div className="card p-16 text-center">
          <Building2 className="w-12 h-12 text-dark-600 mx-auto mb-4" />
          <p className="text-dark-400 text-lg font-medium">No companies yet</p>
          <p className="text-dark-600 text-sm mt-1">Add your first company to get started</p>
          <Link href="/admin/companies/new" className="btn-primary inline-flex mt-6">
            <Plus className="w-4 h-4" /> Add Company
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {companies.map((company) => (
            <div key={company._id} className="card-hover p-5 flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-dark-700 rounded-xl flex items-center justify-center text-lg font-bold text-brand-400 font-display flex-shrink-0">
                    {company.logo ? (
                      <img src={company.logo} alt={company.name} className="w-full h-full object-contain rounded-xl" />
                    ) : company.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-white text-lg leading-tight">{company.name}</h3>
                    <p className="text-dark-500 text-xs mt-0.5">{company.industry || 'Technology'}</p>
                  </div>
                </div>
                <div className={`badge text-xs ${company.isActive ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-dark-700 text-dark-400 border-dark-600'}`}>
                  {company.isActive ? 'Active' : 'Inactive'}
                </div>
              </div>

              <p className="text-dark-400 text-sm line-clamp-2 mb-4">{company.description}</p>

              <div className="flex items-center gap-4 text-xs text-dark-500 mb-4">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  {company.roles?.length || 0} role{company.roles?.length !== 1 ? 's' : ''}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(company.driveSchedule)}
                </span>
              </div>

              {/* Role pills */}
              {company.roles?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {company.roles.slice(0, 3).map((r) => (
                    <span key={r._id} className="badge bg-dark-700 text-dark-300 border-dark-600 text-xs">
                      {r.roleTitle}
                    </span>
                  ))}
                  {company.roles.length > 3 && (
                    <span className="badge bg-dark-700 text-dark-500 border-dark-600 text-xs">
                      +{company.roles.length - 3} more
                    </span>
                  )}
                </div>
              )}

              <div className="mt-auto flex items-center gap-2 pt-3 border-t border-dark-800">
                <Link href={`/admin/companies/${company._id}`} className="btn-secondary flex-1 justify-center text-xs py-2">
                  <Edit3 className="w-3.5 h-3.5" /> Manage
                </Link>
                <button onClick={() => handleDelete(company._id, company.name)}
                  disabled={deleting === company._id}
                  className="btn-danger py-2 px-3">
                  {deleting === company._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}