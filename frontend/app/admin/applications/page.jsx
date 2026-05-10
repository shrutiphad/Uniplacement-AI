'use client';
import { useEffect, useState } from 'react';
import { applicationApi, companyApi } from '@/lib/api';
import { STATUS_COLORS, formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';
import { Loader2, Filter, ChevronDown } from 'lucide-react';

const STATUSES = ['Applied', 'Under Review', 'Shortlisted', 'Rejected', 'Selected'];

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', companyId: '' });
  const [updating, setUpdating] = useState(null);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const [appsRes, companiesRes] = await Promise.all([
        applicationApi.getAll({ ...filters, limit: 100 }),
        companyApi.getAll({ limit: 50 }),
      ]);
      setApplications(appsRes.data.applications);
      setCompanies(companiesRes.data.companies);
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchApplications(); }, [filters]);

  const handleStatusUpdate = async (appId, status) => {
    setUpdating(appId);
    try {
      await applicationApi.updateStatus(appId, { status });
      toast.success(`Status updated to ${status}`);
      fetchApplications();
    } catch { toast.error('Update failed'); }
    finally { setUpdating(null); }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Applications</h1>
          <p className="text-dark-400 mt-1">{applications.length} total applications</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <select className="input w-auto" value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
          <option value="">All Statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select className="input w-auto" value={filters.companyId}
          onChange={(e) => setFilters({ ...filters, companyId: e.target.value })}>
          <option value="">All Companies</option>
          {companies.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-brand-400 animate-spin" /></div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-dark-800/50 border-b border-dark-800">
                <tr>
                  {['Student', 'Company', 'Fit Score', 'Applied', 'Status', 'Action'].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-dark-400 font-medium text-xs uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-800">
                {applications.map((app) => (
                  <tr key={app._id} className="hover:bg-dark-800/30 transition-colors">
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-medium text-dark-200">{app.studentId?.name}</p>
                        <p className="text-dark-500 text-xs">{app.studentId?.email}</p>
                        <p className="text-dark-600 text-xs">{app.studentId?.department} · CGPA {app.studentId?.cgpa}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-dark-200">{app.companyId?.name}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`font-mono font-bold ${
                        app.fitScore >= 80 ? 'text-green-400' :
                        app.fitScore >= 60 ? 'text-yellow-400' : 'text-red-400'
                      }`}>{app.fitScore}%</span>
                    </td>
                    <td className="px-5 py-4 text-dark-400 text-xs">{formatDate(app.appliedAt)}</td>
                    <td className="px-5 py-4">
                      <span className={`badge ${STATUS_COLORS[app.status]}`}>{app.status}</span>
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={app.status}
                        disabled={updating === app._id}
                        onChange={(e) => handleStatusUpdate(app._id, e.target.value)}
                        className="input py-1.5 text-xs w-36">
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {applications.length === 0 && (
              <div className="text-center py-16 text-dark-500">No applications found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}