import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import API from '../api/axios';
import {
  MapPin,
  DollarSign,
  Calendar,
  ExternalLink,
  Plus,
  Trash2,
  Edit2,
  FileText,
  UserCheck,
  Video,
  Clock,
  ChevronLeft,
  X,
  CheckCircle,
  Send,
  CalendarClock,
  Trophy,
  XCircle,
} from 'lucide-react';

interface Note {
  id: string;
  type: 'personal' | 'research' | 'preparation';
  content: string;
  createdAt: string;
}

interface Interview {
  id: string;
  interviewDate: string;
  interviewTime?: string;
  interviewerName?: string;
  meetingLink?: string;
  interviewNotes?: string;
  createdAt: string;
}

interface Activity {
  id: string;
  type: string;
  description?: string;
  createdAt: string;
}

interface JobDetailsData {
  id: string;
  companyName: string;
  role: string;
  location?: string;
  salary?: string;
  jobUrl?: string;
  applicationDate: string;
  status: string;
  notes: Note[];
  interviews: Interview[];
  activities?: Activity[];
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

const JobDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'Application_Created':
        return { icon: Plus, color: 'text-blue-600 bg-blue-50' };
      case 'Resume_Submitted':
        return { icon: Send, color: 'text-indigo-600 bg-indigo-50' };
      case 'OA_Received':
        return { icon: FileText, color: 'text-purple-600 bg-purple-50' };
      case 'Interview_Scheduled':
        return { icon: CalendarClock, color: 'text-amber-600 bg-amber-50' };
      case 'Interview_Completed':
        return { icon: UserCheck, color: 'text-teal-600 bg-teal-50' };
      case 'Offer_Received':
        return { icon: Trophy, color: 'text-emerald-600 bg-emerald-50' };
      case 'Rejected':
        return { icon: XCircle, color: 'text-rose-600 bg-rose-50' };
      default:
        return { icon: CheckCircle, color: 'text-slate-600 bg-slate-50' };
    }
  };

  const formatActivityType = (type: string) => {
    return type.replace(/_/g, ' ');
  };

  // Tab State for Notes
  const [activeNoteTab, setActiveNoteTab] = useState<'personal' | 'research' | 'preparation'>('personal');

  // Modal States
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [noteContent, setNoteContent] = useState('');

  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewTime, setInterviewTime] = useState('');
  const [interviewerName, setInterviewerName] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [interviewNotes, setInterviewNotes] = useState('');

  const [isEditJobModalOpen, setIsEditJobModalOpen] = useState(false);
  const [editCompanyName, setEditCompanyName] = useState('');
  const [editRole, setEditRole] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editSalary, setEditSalary] = useState('');
  const [editJobUrl, setEditJobUrl] = useState('');
  const [editApplicationDate, setEditApplicationDate] = useState('');
  const [editStatus, setEditStatus] = useState('');

  // Fetch Job details
  const { data: job, isLoading, error } = useQuery<JobDetailsData>({
    queryKey: ['job', id],
    queryFn: async () => {
      const res = await API.get(`/jobs/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  // Fetch Activities
  const { data: activities } = useQuery<Activity[]>({
    queryKey: ['activities', id],
    queryFn: async () => {
      const res = await API.get(`/activities/job/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  // Mutate Job Status (Quick Update)
  const updateJobMutation = useMutation({
    mutationFn: async (updatedFields: any) => {
      const res = await API.put(`/jobs/${id}`, updatedFields);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['job', id], data);
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      setIsEditJobModalOpen(false);
    },
  });

  // Note Mutation
  const createNoteMutation = useMutation({
    mutationFn: async (newNote: any) => {
      const res = await API.post('/notes', { ...newNote, jobApplicationId: id });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job', id] });
      setIsNoteModalOpen(false);
      setNoteContent('');
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: async (noteId: string) => {
      await API.delete(`/notes/${noteId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job', id] });
    },
  });

  // Interview Mutation
  const scheduleInterviewMutation = useMutation({
    mutationFn: async (newInterview: any) => {
      const res = await API.post('/interviews', { ...newInterview, jobApplicationId: id });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job', id] });
      queryClient.invalidateQueries({ queryKey: ['interviews'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      setIsInterviewModalOpen(false);
      resetInterviewForm();
    },
  });

  const deleteInterviewMutation = useMutation({
    mutationFn: async (interviewId: string) => {
      await API.delete(`/interviews/${interviewId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job', id] });
      queryClient.invalidateQueries({ queryKey: ['interviews'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });

  const handleEditJobClick = () => {
    if (job) {
      setEditCompanyName(job.companyName);
      setEditRole(job.role);
      setEditLocation(job.location || '');
      setEditSalary(job.salary || '');
      setEditJobUrl(job.jobUrl || '');
      setEditApplicationDate(new Date(job.applicationDate).toISOString().substring(0, 10));
      setEditStatus(job.status);
      setIsEditJobModalOpen(true);
    }
  };

  const handleEditJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateJobMutation.mutate({
      companyName: editCompanyName,
      role: editRole,
      location: editLocation,
      salary: editSalary,
      jobUrl: editJobUrl,
      applicationDate: editApplicationDate,
      status: editStatus,
    });
  };

  const handleNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;
    createNoteMutation.mutate({
      type: activeNoteTab,
      content: noteContent,
    });
  };

  const resetInterviewForm = () => {
    setInterviewDate('');
    setInterviewTime('');
    setInterviewerName('');
    setMeetingLink('');
    setInterviewNotes('');
  };

  const handleInterviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!interviewDate) return;
    scheduleInterviewMutation.mutate({
      interviewDate,
      interviewTime,
      interviewerName,
      meetingLink,
      interviewNotes,
    });
  };

  const handleDeleteJob = async () => {
    if (confirm('Are you sure you want to delete this job application? All interviews and notes will be deleted.')) {
      try {
        await API.delete(`/jobs/${id}`);
        queryClient.invalidateQueries({ queryKey: ['jobs'] });
        queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
        navigate('/jobs');
      } catch (err) {
        console.error('Delete job application error:', err);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-900 border-t-transparent dark:border-white dark:border-t-transparent"></div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">Job application not found</p>
        <Link to="/jobs" className="mt-2 text-sm text-slate-600 dark:text-slate-400 hover:underline">
          Back to applications
        </Link>
      </div>
    );
  }

  // Filter Notes based on tab
  const filteredNotes = job.notes.filter((note) => note.type === activeNoteTab);

  return (
    <div className="space-y-6">
      {/* Back to Jobs Link */}
      <div className="flex items-center justify-between">
        <Link
          to="/jobs"
          className="inline-flex items-center gap-1 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-100 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to applications
        </Link>
        <div className="flex gap-2">
          <button
            onClick={handleEditJobClick}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <Edit2 className="h-3.5 w-3.5" />
            Edit
          </button>
          <button
            onClick={handleDeleteJob}
            className="inline-flex items-center gap-1 rounded-lg border border-red-200 dark:border-red-900/30 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </button>
        </div>
      </div>

      {/* Main Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs border-t-slate-900 dark:border-t-slate-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 leading-tight">{job.companyName}</h1>
            <p className="text-base text-slate-500 dark:text-slate-400 font-medium">{job.role}</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase">Status:</span>
            <select
              value={job.status}
              onChange={(e) => updateJobMutation.mutate({ status: e.target.value })}
              className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 font-semibold focus:border-slate-900 dark:focus:border-slate-600 focus:outline-none sm:text-sm bg-slate-50 dark:bg-slate-800"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Metadata Details Grid */}
        <div className="grid gap-4 mt-6 sm:grid-cols-2 md:grid-cols-4 border-t border-slate-100 dark:border-slate-800 pt-6">
          <div className="flex items-center gap-3">
            <span className="rounded-lg border border-slate-100 dark:border-slate-700 p-2 text-slate-400 dark:text-slate-500">
              <MapPin className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase">Location</p>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{job.location || 'Not Specified'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-lg border border-slate-100 dark:border-slate-700 p-2 text-slate-400 dark:text-slate-500">
              <DollarSign className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase">Salary Range</p>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{job.salary || 'Not Specified'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-lg border border-slate-100 dark:border-slate-700 p-2 text-slate-400 dark:text-slate-500">
              <Calendar className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase">Date Applied</p>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {new Date(job.applicationDate).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-lg border border-slate-100 dark:border-slate-700 p-2 text-slate-400 dark:text-slate-500">
              <ExternalLink className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase">Job Listing</p>
              {job.jobUrl ? (
                <a
                  href={job.jobUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-semibold text-slate-800 dark:text-slate-200 hover:underline flex items-center gap-1"
                >
                  Link
                  <ExternalLink className="h-3 w-3" />
                </a>
              ) : (
                <p className="text-sm font-semibold text-slate-400 dark:text-slate-600 italic">No URL Provided</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Two-Column Section */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column: Notes & Prep System */}
        <div className="md:col-span-2 space-y-6">
          {/* Activity Timeline */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs border-t-slate-900 dark:border-t-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">Activity Timeline</h3>
            </div>

            {activities && activities.length > 0 ? (
              <div className="space-y-4">
                {activities.map((activity) => {
                  const { icon: Icon, color } = getActivityIcon(activity.type);
                  return (
                    <div key={activity.id} className="flex gap-3">
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {formatActivityType(activity.type)}
                          </p>
                          <span className="text-xs text-slate-400 dark:text-slate-500">
                            {new Date(activity.createdAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        {activity.description && (
                          <p className="text-xs text-slate-600 dark:text-slate-400">{activity.description}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Clock className="h-8 w-8 text-slate-300 dark:text-slate-600 stroke-[1.5] mb-2" />
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">No activities recorded yet</p>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs border-t-slate-900 dark:border-t-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">Notes & Research</h3>
              <button
                onClick={() => setIsNoteModalOpen(true)}
                className="inline-flex items-center gap-1 rounded-lg bg-slate-950 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 transition-colors cursor-pointer dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Note
              </button>
            </div>

            {/* Note Tabs */}
            <div className="flex border-b border-slate-100 dark:border-slate-800 gap-2 mb-4">
              {(['personal', 'research', 'preparation'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveNoteTab(tab)}
                  className={`border-b-2 px-3 pb-2 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                    activeNoteTab === tab
                      ? 'border-slate-950 text-slate-950 dark:border-slate-100 dark:text-slate-100'
                      : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  {tab === 'personal' ? 'Personal' : tab === 'research' ? 'Research' : 'Prep Notes'}
                </button>
              ))}
            </div>

            {/* Notes List */}
            {filteredNotes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center text-slate-400 bg-slate-50/50 dark:bg-slate-800/50 rounded-lg">
                <FileText className="h-8 w-8 text-slate-300 dark:text-slate-600 mb-2 stroke-[1.5]" />
                <p className="text-xs font-medium">No {activeNoteTab} notes recorded yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredNotes.map((note) => (
                  <div key={note.id} className="group relative rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 p-4">
                    <button
                      onClick={() => deleteNoteMutation.mutate(note.id)}
                      className="absolute right-3 top-3 rounded p-1 text-slate-300 dark:text-slate-500 opacity-0 group-hover:opacity-100 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-red-600 dark:hover:text-red-400 transition-all cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mb-1">
                      {new Date(note.createdAt).toLocaleString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </p>
                    <p className="text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">{note.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Scheduled Interviews */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs border-t-slate-900 dark:border-t-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">Interviews</h3>
              <button
                onClick={() => setIsInterviewModalOpen(true)}
                className="inline-flex items-center gap-1 rounded-lg bg-slate-950 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 transition-colors cursor-pointer dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
              >
                <Plus className="h-3.5 w-3.5" />
                Schedule
              </button>
            </div>

            {job.interviews.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center text-slate-400 bg-slate-50/50 dark:bg-slate-800/50 rounded-lg">
                <Calendar className="h-8 w-8 text-slate-300 dark:text-slate-600 mb-2 stroke-[1.5]" />
                <p className="text-xs font-medium">No interviews scheduled yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {job.interviews.map((interview) => (
                  <div key={interview.id} className="group relative rounded-xl border border-slate-100 dark:border-slate-700 p-4 space-y-3">
                    <button
                      onClick={() => deleteInterviewMutation.mutate(interview.id)}
                      className="absolute right-3 top-3 rounded p-1 text-slate-300 dark:text-slate-500 opacity-0 group-hover:opacity-100 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-red-600 dark:hover:text-red-400 transition-all cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>

                    <div className="flex items-start gap-3">
                      <span className="rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1.5 text-slate-600 dark:text-slate-300 mt-0.5">
                        <Clock className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                          {new Date(interview.interviewDate).toLocaleDateString(undefined, {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                        {interview.interviewTime && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Time: {interview.interviewTime}</p>
                        )}
                      </div>
                    </div>

                    {interview.interviewerName && (
                      <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                        <UserCheck className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                        <span>Interviewer: {interview.interviewerName}</span>
                      </div>
                    )}

                    {interview.meetingLink && (
                      <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                        <Video className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                        <a
                          href={interview.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="font-medium text-slate-800 dark:text-slate-200 hover:underline flex items-center gap-1"
                        >
                          Join Meeting
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    )}

                    {interview.interviewNotes && (
                      <div className="border-t border-slate-50 dark:border-slate-700 pt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic">
                        {interview.interviewNotes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Note Modal Dialog */}
      {isNoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl bg-white dark:bg-slate-900 p-6 shadow-xl border border-slate-200 dark:border-slate-800 animate-in fade-in-50 zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-lg">Add Note</h3>
              <button
                onClick={() => setIsNoteModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleNoteSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Note Type</label>
                <div className="flex gap-2">
                  {(['personal', 'research', 'preparation'] as const).map((tab) => (
                    <span
                      key={tab}
                      className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium cursor-pointer ${
                        activeNoteTab === tab
                          ? 'border-slate-950 bg-slate-950 text-white dark:border-slate-100 dark:bg-white dark:text-slate-950'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                      }`}
                      onClick={() => setActiveNoteTab(tab)}
                    >
                      {tab === 'personal' ? 'Personal' : tab === 'research' ? 'Research' : 'Preparation'}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Content</label>
                <textarea
                  required
                  rows={4}
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Type notes contents here..."
                  className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-slate-900 dark:focus:border-slate-600 focus:outline-none sm:text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800 pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsNoteModalOpen(false)}
                  className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createNoteMutation.isPending}
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors cursor-pointer dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
                >
                  {createNoteMutation.isPending ? 'Saving...' : 'Add Note'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Interview Modal Dialog */}
      {isInterviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl bg-white dark:bg-slate-900 p-6 shadow-xl border border-slate-200 dark:border-slate-800 animate-in fade-in-50 zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-lg">Schedule Interview</h3>
              <button
                onClick={() => setIsInterviewModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleInterviewSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Interview Date *</label>
                  <input
                    type="date"
                    required
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-slate-900 dark:text-slate-100 focus:border-slate-900 dark:focus:border-slate-600 focus:outline-none sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Time (e.g. 2:00 PM)</label>
                  <input
                    type="text"
                    value={interviewTime}
                    onChange={(e) => setInterviewTime(e.target.value)}
                    placeholder="e.g. 10:30 AM"
                    className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-slate-900 dark:text-slate-100 focus:border-slate-900 dark:focus:border-slate-600 focus:outline-none sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Interviewer Name</label>
                <input
                  type="text"
                  value={interviewerName}
                  onChange={(e) => setInterviewerName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-slate-900 dark:text-slate-100 focus:border-slate-900 dark:focus:border-slate-600 focus:outline-none sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Meeting Link (Zoom / Meet)</label>
                <input
                  type="url"
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  placeholder="https://zoom.us/j/..."
                  className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-slate-900 dark:text-slate-100 focus:border-slate-900 dark:focus:border-slate-600 focus:outline-none sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Quick notes / agenda</label>
                <textarea
                  rows={3}
                  value={interviewNotes}
                  onChange={(e) => setInterviewNotes(e.target.value)}
                  placeholder="e.g. Technical coding test. Cover arrays & graphs."
                  className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-slate-900 dark:focus:border-slate-600 focus:outline-none sm:text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800 pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsInterviewModalOpen(false)}
                  className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={scheduleInterviewMutation.isPending}
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors cursor-pointer dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
                >
                  {scheduleInterviewMutation.isPending ? 'Scheduling...' : 'Schedule Interview'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Job Details Modal */}
      {isEditJobModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-xl bg-white dark:bg-slate-900 p-6 shadow-xl border border-slate-200 dark:border-slate-800 animate-in fade-in-50 zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-lg">Edit Application Details</h3>
              <button
                onClick={() => setIsEditJobModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleEditJobSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Company Name</label>
                  <input
                    type="text"
                    required
                    value={editCompanyName}
                    onChange={(e) => setEditCompanyName(e.target.value)}
                    className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-slate-900 dark:text-slate-100 focus:border-slate-900 dark:focus:border-slate-600 focus:outline-none sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Role</label>
                  <input
                    type="text"
                    required
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-slate-900 dark:text-slate-100 focus:border-slate-900 dark:focus:border-slate-600 focus:outline-none sm:text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Location</label>
                  <input
                    type="text"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-slate-900 dark:text-slate-100 focus:border-slate-900 dark:focus:border-slate-600 focus:outline-none sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Salary Range</label>
                  <input
                    type="text"
                    value={editSalary}
                    onChange={(e) => setEditSalary(e.target.value)}
                    className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-slate-900 dark:text-slate-100 focus:border-slate-900 dark:focus:border-slate-600 focus:outline-none sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Job Post URL</label>
                <input
                  type="url"
                  value={editJobUrl}
                  onChange={(e) => setEditJobUrl(e.target.value)}
                  className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-slate-900 dark:text-slate-100 focus:border-slate-900 dark:focus:border-slate-600 focus:outline-none sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Applied Date</label>
                  <input
                    type="date"
                    required
                    value={editApplicationDate}
                    onChange={(e) => setEditApplicationDate(e.target.value)}
                    className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-slate-900 dark:text-slate-100 focus:border-slate-900 dark:focus:border-slate-600 focus:outline-none sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
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
                  onClick={() => setIsEditJobModalOpen(false)}
                  className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateJobMutation.isPending}
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors cursor-pointer dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
                >
                  {updateJobMutation.isPending ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
