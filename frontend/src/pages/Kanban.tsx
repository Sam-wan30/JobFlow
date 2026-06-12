import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import {
  MapPin,
  DollarSign,
  Calendar,
  Eye,
} from 'lucide-react';

interface JobApplication {
  id: string;
  companyName: string;
  role: string;
  location?: string;
  salary?: string;
  applicationDate: string;
  status: string;
}

const COLUMNS = [
  'Applied',
  'Under Review',
  'OA Scheduled',
  'Interview Scheduled',
  'Final Round',
  'Offer Received',
  'Rejected',
];

const COLUMN_COLORS: Record<string, string> = {
  'Applied': 'border-t-slate-400 bg-slate-50/50 dark:border-slate-400 dark:bg-transparent',
  'Under Review': 'border-t-amber-400 bg-amber-50/20 dark:border-amber-400 dark:bg-transparent',
  'OA Scheduled': 'border-t-sky-400 bg-sky-50/20 dark:border-sky-400 dark:bg-transparent',
  'Interview Scheduled': 'border-t-purple-400 bg-purple-50/20 dark:border-purple-400 dark:bg-transparent',
  'Final Round': 'border-t-indigo-400 bg-indigo-50/20 dark:border-indigo-400 dark:bg-transparent',
  'Offer Received': 'border-t-emerald-400 bg-emerald-50/20 dark:border-emerald-400 dark:bg-transparent',
  'Rejected': 'border-t-rose-400 bg-rose-50/20 dark:border-rose-400 dark:bg-transparent',
};

const Kanban = () => {
  const queryClient = useQueryClient();
  const [draggedJobId, setDraggedJobId] = useState<string | null>(null);

  // Fetch Jobs
  const { data: jobs, isLoading } = useQuery<JobApplication[]>({
    queryKey: ['jobs'],
    queryFn: async () => {
      const res = await API.get('/jobs');
      return res.data;
    },
  });

  // Update Status Mutation (Move Job)
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await API.put(`/jobs/${id}`, { status });
      return res.data;
    },
    // Optimistic UI updates
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ['jobs'] });
      const previousJobs = queryClient.getQueryData<JobApplication[]>(['jobs']);

      if (previousJobs) {
        queryClient.setQueryData<JobApplication[]>(
          ['jobs'],
          previousJobs.map((job) =>
            job.id === id ? { ...job, status } : job
          )
        );
      }

      return { previousJobs };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousJobs) {
        queryClient.setQueryData(['jobs'], context.previousJobs);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedJobId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    const jobId = e.dataTransfer.getData('text/plain') || draggedJobId;
    if (jobId) {
      updateStatusMutation.mutate({ id: jobId, status });
    }
    setDraggedJobId(null);
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-900 border-t-transparent"></div>
      </div>
    );
  }

  // Group jobs by column status
  const jobsByColumn = COLUMNS.reduce<Record<string, JobApplication[]>>((acc, col) => {
    acc[col] = jobs ? jobs.filter((job) => job.status === col) : [];
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Kanban Board</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Drag and drop job cards to update their status instantly.</p>
      </div>

      {/* Kanban Board Container */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
        {COLUMNS.map((columnName) => {
          const colJobs = jobsByColumn[columnName] || [];
          return (
            <div
              key={columnName}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, columnName)}
              className={`flex w-72 shrink-0 flex-col rounded-xl border border-slate-200 dark:border-slate-700 border-t-4 ${COLUMN_COLORS[columnName]} p-3 kanban-column`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">{columnName}</span>
                <span className="rounded-full bg-slate-200/60 dark:bg-slate-700/60 px-2 py-0.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {colJobs.length}
                </span>
              </div>

              {/* Column Content */}
              <div className="flex-1 space-y-3 overflow-y-auto max-h-[calc(100vh-250px)] pr-1">
                {colJobs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl bg-white/50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500">
                    <p className="text-xs font-medium">Empty</p>
                  </div>
                ) : (
                  colJobs.map((job) => (
                    <div
                      key={job.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, job.id)}
                      className="group relative rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-xs hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing job-card-drag"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{job.companyName}</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{job.role}</p>
                        </div>
                        <Link
                          to={`/jobs/${job.id}`}
                          className="rounded p-1 text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200 transition-all"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Link>
                      </div>

                      <div className="mt-4 space-y-1.5 border-t border-slate-50 dark:border-slate-700 pt-3 text-[11px] text-slate-500 dark:text-slate-400">
                        {job.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 shrink-0" />
                            <span className="truncate">{job.location}</span>
                          </div>
                        )}
                        {job.salary && (
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3 shrink-0" />
                            <span>{job.salary}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 shrink-0" />
                          <span>
                            Applied: {new Date(job.applicationDate).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Kanban;
