import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { StatusBadge } from '../components/StatusBadge';
import Autocomplete from '../components/Autocomplete';
import {
  Search,
  Filter,
  Plus,
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  Trash2,
  Eye,
  X,
  Check,
} from 'lucide-react';

interface JobApplication {
  id: string;
  companyName: string;
  role: string;
  location?: string;
  salary?: string;
  jobUrl?: string;
  applicationDate: string;
  status: string;
}

const STATUS_OPTIONS = [
  'Applied',
  'Under Review',
  'OA Scheduled',
  'Interview Scheduled',
  'Final Round',
  'Offer Received',
  'Rejected',
];

const Jobs = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  // Add Job Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [applicationDate, setApplicationDate] = useState(
    new Date().toISOString().substring(0, 10)
  );
  const [status, setStatus] = useState('Applied');
  const [formError, setFormError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const companyNameRef = useRef<HTMLInputElement | null>(null);
  const roleRef = useRef<HTMLInputElement | null>(null);
  const locationRef = useRef<HTMLInputElement | null>(null);
  const salaryRef = useRef<HTMLInputElement | null>(null);
  const jobUrlRef = useRef<HTMLInputElement | null>(null);
  const applicationDateRef = useRef<HTMLInputElement | null>(null);
  const statusRef = useRef<HTMLSelectElement | null>(null);

  // Auto-focus first input when modal opens
  useEffect(() => {
    if (isModalOpen) {
      setTimeout(() => companyNameRef.current?.focus(), 100);
    }
  }, [isModalOpen]);

  // Fetch Jobs
  const { data: jobs, isLoading } = useQuery<JobApplication[]>({
    queryKey: ['jobs', search, statusFilter, locationFilter],
    queryFn: async () => {
      const params: any = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (locationFilter) params.location = locationFilter;

      const res = await API.get('/jobs', { params });
      return res.data;
    },
  });

  // Create Job Mutation
  const createJobMutation = useMutation({
    mutationFn: async (newJob: any) => {
      const res = await API.post('/jobs', newJob);
      return res.data;
    },
    onSuccess: () => {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        queryClient.invalidateQueries({ queryKey: ['jobs'] });
        queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
        setIsModalOpen(false);
        resetForm();
      }, 1500);
    },
    onError: (err: any) => {
      setFormError(err.response?.data?.message || 'Failed to create job application.');
    },
  });

  // Delete Job Mutation
  const deleteJobMutation = useMutation({
    mutationFn: async (id: string) => {
      await API.delete(`/jobs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });

  const resetForm = () => {
    setCompanyName('');
    setRole('');
    setLocation('');
    setSalary('');
    setJobUrl('');
    setApplicationDate(new Date().toISOString().substring(0, 10));
    setStatus('Applied');
    setFormError(null);
  };

  const handleCreateJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Enhanced validation
    if (!companyName.trim()) {
      setFormError('Company Name is required.');
      companyNameRef.current?.focus();
      return;
    }

    if (!role.trim()) {
      setFormError('Role is required.');
      roleRef.current?.focus();
      return;
    }

    if (!status) {
      setFormError('Status is required.');
      statusRef.current?.focus();
      return;
    }

    if (jobUrl && !isValidUrl(jobUrl)) {
      setFormError('Please enter a valid URL for the job post.');
      jobUrlRef.current?.focus();
      return;
    }

    createJobMutation.mutate({
      companyName: companyName.trim(),
      role: role.trim(),
      location: location.trim(),
      salary: salary.trim(),
      jobUrl: jobUrl.trim(),
      applicationDate,
      status,
    });
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, nextRef?: React.RefObject<HTMLInputElement | HTMLSelectElement | null>) => {
    if (e.key === 'Enter' && nextRef?.current) {
      e.preventDefault();
      nextRef.current.focus();
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this job application? This will delete all linked interviews and notes.')) {
      deleteJobMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Applications</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Track and update your applications list.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-all cursor-pointer dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
        >
          <Plus className="h-4 w-4" />
          Add Application
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 dark:text-slate-500">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Search by company or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 pl-9 pr-3 py-2 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-slate-900 dark:focus:border-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-slate-600 sm:text-sm"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <Filter className="h-3 w-3" /> Status:
            </span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1.5 text-xs text-slate-700 dark:text-slate-300 focus:border-slate-900 dark:focus:border-slate-600 focus:outline-none sm:text-sm"
            >
              <option value="">All Statuses</option>
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Filter by location..."
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 focus:border-slate-900 dark:focus:border-slate-600 focus:outline-none sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Table/List View */}
      {isLoading ? (
        <div className="flex h-[30vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-900 border-t-transparent dark:border-white dark:border-t-transparent"></div>
        </div>
      ) : !jobs || jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <Briefcase className="h-12 w-12 text-slate-300 dark:text-slate-600 stroke-[1.5] mb-2" />
          <p className="text-base font-semibold text-slate-800 dark:text-slate-200">No applications found</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Try tweaking your search filters or add a new job application.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs border-t-slate-900 dark:border-t-slate-100">
          <table className="w-full border-collapse text-left text-sm text-slate-500 dark:text-slate-400">
            <thead className="bg-slate-50 dark:bg-slate-800 text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 border-t-slate-900 dark:border-t-slate-100">
              <tr>
                <th scope="col" className="px-6 py-4">Company & Role</th>
                <th scope="col" className="px-6 py-4">Status</th>
                <th scope="col" className="px-6 py-4">Location</th>
                <th scope="col" className="px-6 py-4">Salary</th>
                <th scope="col" className="px-6 py-4">Applied Date</th>
                <th scope="col" className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-950 dark:text-slate-100">
                    <div className="font-semibold text-slate-900 dark:text-slate-100">{job.companyName}</div>
                    <div className="text-xs text-slate-400 dark:text-slate-500">{job.role}</div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={job.status} />
                  </td>
                  <td className="px-6 py-4">
                    {job.location ? (
                      <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                        <MapPin className="h-3 w-3 shrink-0" />
                        {job.location}
                      </span>
                    ) : (
                      <span className="text-slate-400 dark:text-slate-600 italic">N/A</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {job.salary ? (
                      <span className="flex items-center gap-0.5 text-slate-600 dark:text-slate-300">
                        <DollarSign className="h-3.5 w-3.5 shrink-0" />
                        {job.salary}
                      </span>
                    ) : (
                      <span className="text-slate-400 dark:text-slate-600 italic">N/A</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                      <Calendar className="h-3.5 w-3.5 shrink-0" />
                      {new Date(job.applicationDate).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/jobs/${job.id}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-slate-100 transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(job.id)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Job Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-xl bg-white dark:bg-slate-900 p-6 shadow-xl border border-slate-200 dark:border-slate-800 animate-in fade-in-50 zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-lg">Add Job Application</h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className="rounded-lg p-1 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {showSuccess ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-emerald-100 dark:bg-emerald-900/30 p-3 mb-4 animate-in zoom-in-50 duration-300">
                  <Check className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Application Added!</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">Your job application has been successfully created.</p>
              </div>
            ) : (
              <form onSubmit={handleCreateJobSubmit} className="space-y-4">
                {formError && (
                  <div className="rounded-lg bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800 p-3 text-xs text-rose-800 dark:text-rose-300 animate-in fade-in-50 duration-200" role="alert">
                    {formError}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="companyName" className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Company Name *
                    </label>
                    <Autocomplete
                      type="company"
                      value={companyName}
                      onChange={setCompanyName}
                      placeholder="e.g. Stripe"
                      inputRef={companyNameRef}
                      onKeyDown={(e) => handleKeyDown(e, roleRef)}
                    />
                  </div>
                  <div>
                    <label htmlFor="role" className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Role *
                    </label>
                    <input
                      id="role"
                      ref={roleRef}
                      type="text"
                      required
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="e.g. Frontend Engineer"
                      onKeyDown={(e) => handleKeyDown(e, locationRef)}
                      className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-slate-900 dark:text-slate-100 focus:border-slate-900 dark:focus:border-slate-600 focus:outline-none sm:text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="location" className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Location
                    </label>
                    <Autocomplete
                      type="location"
                      value={location}
                      onChange={setLocation}
                      placeholder="e.g. San Francisco, CA"
                      inputRef={locationRef}
                      onKeyDown={(e) => handleKeyDown(e, salaryRef)}
                    />
                  </div>
                  <div>
                    <label htmlFor="salary" className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Salary Range / OTE
                    </label>
                    <input
                      id="salary"
                      ref={salaryRef}
                      type="text"
                      value={salary}
                      onChange={(e) => setSalary(e.target.value)}
                      placeholder="e.g. $130k - $160k"
                      onKeyDown={(e) => handleKeyDown(e, jobUrlRef)}
                      className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-slate-900 dark:text-slate-100 focus:border-slate-900 dark:focus:border-slate-600 focus:outline-none sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="jobUrl" className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Job Post URL
                  </label>
                  <input
                    id="jobUrl"
                    ref={jobUrlRef}
                    type="url"
                    value={jobUrl}
                    onChange={(e) => setJobUrl(e.target.value)}
                    placeholder="https://company.com/careers/role"
                    onKeyDown={(e) => handleKeyDown(e, applicationDateRef)}
                    className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-slate-900 dark:text-slate-100 focus:border-slate-900 dark:focus:border-slate-600 focus:outline-none sm:text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="applicationDate" className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Applied Date
                    </label>
                    <input
                      id="applicationDate"
                      ref={applicationDateRef}
                      type="date"
                      value={applicationDate}
                      onChange={(e) => setApplicationDate(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, statusRef)}
                      className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-slate-900 dark:text-slate-100 focus:border-slate-900 dark:focus:border-slate-600 focus:outline-none sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="status" className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Status *
                    </label>
                    <select
                      id="status"
                      ref={statusRef}
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-slate-900 dark:text-slate-100 focus:border-slate-900 dark:focus:border-slate-600 focus:outline-none sm:text-sm"
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800 pt-4 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      resetForm();
                    }}
                    className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createJobMutation.isPending}
                    className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
                  >
                    {createJobMutation.isPending ? 'Saving...' : 'Save Application'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Jobs;
