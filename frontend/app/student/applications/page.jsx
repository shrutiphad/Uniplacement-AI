'use client';
import { useEffect, useState } from 'react';
import { applicationApi } from '@/lib/api';
import { STATUS_COLORS, getFitScoreColor, formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';
import { FileText, Loader2, CheckCircle, Clock, XCircle, Star, Trash2 } from 'lucide-react';

const STATUS_ICONS = {
  Applied: Clock, 'Under Review': Clock, Shortlisted: Star,
  Selected: CheckCircle, Rejected: XCircle,
};

export default function StudentApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [withdrawing, setWithdrawing] = useState(null);

  const fetchApps = async () => {
    try {
      const { data } = await applicationApi.getMyApplications();
      setApplications(data.applications);
    } catch { toast.error('Failed to load applications'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchApps(); }, []);

  const handleWithdraw = async (id) => {
    if (!window.confirm('Withdraw this application?')) return;
    setWithdrawing(id);
    try {
      await applicationApi.withdraw(id);
      toast.success('Application withdrawn');
      fetchApps();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot withdraw at this stage');
    } finally { setWithdrawing(null); }
  };

  if (loading) return (
    <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-brand-400 animate-spin" /></div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-3xl font-bold text-white">My Applications</h1>
        <p className="text-dark-400 mt-1">{applications.length} application{applications.length !== 1 ? 's' : ''} submitted</p>
      </div>

      {applications.length === 0 ? (
        <div className="card p-16 text-center">
          <FileText className="w-12 h-12 text-dark-600 mx-auto mb-4" />
          <p className="text-dark-400 text-lg font-medium">No applications yet</p>
          <p className="text-dark-600 text-sm mt-1">Browse companies and apply to roles</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => {
            const StatusIcon = STATUS_ICONS[app.status] || Clock;
            return (
              <div key={app._id} className="card p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-dark-700 rounded-xl flex items-center justify-center text-lg font-bold text-brand-400 font-display flex-shrink-0">
                    {app.companyName?.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div>
                        <h3 className="font-display font-bold text-white">{app.companyName}</h3>
                        <p className="text-dark-500 text-sm">Applied {formatDate(app.appliedAt)}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`font-mono font-bold ${getFitScoreColor(app.fitScore)}`}>
                          {app.fitScore}% fit
                        </span>
                        <span className={`badge ${STATUS_COLORS[app.status]}`}>
                          <StatusIcon className="w-3 h-3" /> {app.status}
                        </span>
                        {['Applied', 'Under Review'].includes(app.status) && (
                          <button onClick={() => handleWithdraw(app._id)}
                            disabled={withdrawing === app._id}
                            className="btn-danger py-1.5 px-3 text-xs">
                            {withdrawing === app._id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Timeline */}
                    {app.timeline?.length > 0 && (
                      <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1">
                        {app.timeline.map((t, i) => (
                          <div key={i} className="flex items-center gap-2 flex-shrink-0">
                            <div className="flex flex-col items-center">
                              <div className={`w-2.5 h-2.5 rounded-full ${
                                t.status === 'Selected' ? 'bg-green-400' :
                                t.status === 'Rejected' ? 'bg-red-400' :
                                t.status === 'Shortlisted' ? 'bg-purple-400' :
                                'bg-brand-400'
                              }`} />
                              <p className="text-dark-500 text-xs mt-1 whitespace-nowrap">{t.status}</p>
                              <p className="text-dark-700 text-xs">{formatDate(t.timestamp)}</p>
                            </div>
                            {i < app.timeline.length - 1 && (
                              <div className="w-8 h-px bg-dark-700 flex-shrink-0 mb-4" />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}