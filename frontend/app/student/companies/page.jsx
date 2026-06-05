'use client';
import { useEffect, useState } from 'react';
import { companyApi, applicationApi } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
  Search, Building2, Calendar, Users, Briefcase,
  ChevronRight, Loader2, MapPin, Globe, Filter
} from 'lucide-react';

export default function StudentCompaniesPage() {
  const { user } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [applying, setApplying] = useState(null);
  const [eligibilityMap, setEligibilityMap] = useState({});

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        const { data } = await companyApi.getAll({ search, limit: 50 });
        setCompanies(data.companies);
      } catch { toast.error('Failed to load companies'); }
      finally { setLoading(false); }
    };
    fetchCompanies();
  }, [search]);

  const checkEligibility = async (companyId) => {
    if (eligibilityMap[companyId]) return;
    try {
      const { data } = await companyApi.checkEligibility(companyId);
      setEligibilityMap((prev) => ({ ...prev, [companyId]: data.eligibilityMap }));
    } catch {}
  };

  const handleApply = async (companyId, roleId) => {
    if (!user?.resumeURL) {
      toast.error('Please upload your resume first!');
      return;
    }
    setApplying(`${companyId}-${roleId}`);
    try {
      await applicationApi.apply({ companyId, roleId });
      toast.success('Application submitted! 🎉');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Application failed');
    } finally {
      setApplying(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-3xl font-bold text-white">Companies</h1>
        <p className="text-dark-400 mt-1">Browse and apply to active placement drives</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
        <input type="text" placeholder="Search companies..." className="input pl-10"
          value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-brand-400 animate-spin" /></div>
      ) : companies.length === 0 ? (
        <div className="card p-16 text-center">
          <Building2 className="w-12 h-12 text-dark-600 mx-auto mb-3" />
          <p className="text-dark-400">No companies found</p>
        </div>
      ) : (
        <div className="space-y-5">
          {companies.map((company) => (
            <div key={company._id} className="card-hover p-6"
              onMouseEnter={() => checkEligibility(company._id)}>
              {/* Company Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 bg-dark-700 rounded-2xl flex items-center justify-center text-2xl font-bold text-brand-400 font-display flex-shrink-0">
                  {company.logo ? (
                    <img src={company.logo} alt={company.name} className="w-full h-full object-contain rounded-2xl" />
                  ) : company.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h2 className="font-display font-bold text-white text-xl">{company.name}</h2>
                    {company.driveSchedule && (
                      <span className="badge bg-brand-500/10 text-brand-400 border-brand-500/20 text-xs">
                        <Calendar className="w-3 h-3" /> {formatDate(company.driveSchedule)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-1.5 text-sm text-dark-500">
                    {company.industry && <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" />{company.industry}</span>}
                    {company.headquarters && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{company.headquarters}</span>}
                    {company.website && (
                      <a href={company.website} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:text-brand-400 transition-colors">
                        <Globe className="w-3.5 h-3.5" /> Website
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <p className="text-dark-400 text-sm mb-5 line-clamp-2">{company.description}</p>

              {/* Roles */}
              <div className="space-y-3">
                <p className="text-dark-500 text-xs font-medium uppercase tracking-wider">Open Roles</p>
                {company.roles?.filter(r => r.isActive).map((role) => {
                  const eligibility = eligibilityMap[company._id]?.[role._id];
                  const isApplying = applying === `${company._id}-${role._id}`;

                  return (
                    <div key={role._id} className="bg-dark-800/60 border border-dark-700 rounded-xl p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-medium text-white">{role.roleTitle}</h3>
                            <span className="badge bg-green-500/10 text-green-400 border-green-500/20 text-xs">
                              {role.salaryPackage}
                            </span>
                            {role.openings && (
                              <span className="badge bg-dark-700 text-dark-400 border-dark-600 text-xs">
                                {role.openings} opening{role.openings !== 1 ? 's' : ''}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {role.requiredSkills?.slice(0, 5).map((s) => (
                              <span key={s} className="badge bg-dark-700 text-dark-300 border-dark-600 text-xs">{s}</span>
                            ))}
                            {role.requiredSkills?.length > 5 && (
                              <span className="badge bg-dark-700 text-dark-500 border-dark-600 text-xs">
                                +{role.requiredSkills.length - 5}
                              </span>
                            )}
                          </div>
                          {eligibility && !eligibility.eligible && (
                            <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                              Not eligible: {eligibility.reasons[0]}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Link href={`/student/companies/${company._id}?role=${role._id}`}
                            className="btn-secondary text-xs py-1.5 px-3">
                            Details
                          </Link>
                          <button
                            onClick={() => handleApply(company._id, role._id)}
                            disabled={isApplying || (eligibility && !eligibility.eligible)}
                            className={`text-xs py-1.5 px-4 rounded-lg font-medium transition-all ${
                              eligibility && !eligibility.eligible
                                ? 'bg-dark-700 text-dark-500 cursor-not-allowed'
                                : 'btn-primary'
                            }`}>
                            {isApplying ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Apply'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Company Updates */}
              {company.updates?.length > 0 && (
                <div className="mt-4 pt-4 border-t border-dark-800">
                  <p className="text-dark-500 text-xs">
                    Latest: <span className="text-dark-300">{company.updates[company.updates.length - 1]?.title}</span>
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}