import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import API from '../api/axios';
import {
  Briefcase,
  Layers,
  Calendar,
  ExternalLink,
  ChevronRight,
  Plus,
  Clock,
  TrendingUp,
} from 'lucide-react';

interface DashboardStats {
  totalApplications: number;
  activeApplications: number;
  interviewsScheduled: number;
  offersReceived: number;
  rejections: number;
  applicationsThisWeek: number;
  pendingTasks: number;
}

interface Interview {
  id: string;
  interviewDate: string;
  interviewTime?: string;
  interviewerName?: string;
  meetingLink?: string;
  jobApplication: {
    companyName: string;
    role: string;
    status: string;
  };
}

const Dashboard = () => {
  const user = useAuthStore((state) => state.user);

  // Get greeting based on time of day
  const getGreeting = () => {
    return 'Hello';
  };

  // Fetch Stats
  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const res = await API.get('/jobs/stats');
      return res.data;
    },
  });

  // Fetch Interviews
  const { data: interviews, isLoading: interviewsLoading } = useQuery<Interview[]>({
    queryKey: ['interviews'],
    queryFn: async () => {
      const res = await API.get('/interviews');
      return res.data;
    },
  });

  const upcomingInterviews = interviews
    ? interviews.filter((i) => new Date(i.interviewDate) >= new Date())
    : [];

  const statCards = [
    {
      title: 'Total Applications',
      value: stats?.totalApplications ?? 0,
      icon: Briefcase,
      color: 'text-blue-600 bg-blue-50 border-blue-100',
      borderTColor: 'border-t-blue-400',
    },
    {
      title: 'Active Applications',
      value: stats?.activeApplications ?? 0,
      icon: Layers,
      color: 'text-amber-600 bg-amber-50 border-amber-100',
      borderTColor: 'border-t-amber-400',
    },
    {
      title: 'This Week',
      value: stats?.applicationsThisWeek ?? 0,
      icon: TrendingUp,
      color: 'text-teal-600 bg-teal-50 border-teal-100',
      borderTColor: 'border-t-teal-400',
    },
    {
      title: 'Interviews Scheduled',
      value: stats?.interviewsScheduled ?? 0,
      icon: Calendar,
      color: 'text-purple-600 bg-purple-50 border-purple-100',
      borderTColor: 'border-t-purple-400',
    },
    {
      title: 'Pending Tasks',
      value: stats?.pendingTasks ?? 0,
      icon: Clock,
      color: 'text-orange-600 bg-orange-50 border-orange-100',
      borderTColor: 'border-t-orange-400',
    },
  ];

  if (statsLoading || interviewsLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-900 border-t-transparent dark:border-white dark:border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner/Welcome */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight dark:text-white">
            {getGreeting()}, {user?.name || 'there'} 👋
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Here's how your job hunting journey is going.</p>
        </div>
        <Link
          to="/jobs"
          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-all cursor-pointer dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
        >
          <Plus className="h-4 w-4" />
          Add Application
        </Link>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className={`group relative rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 ${card.borderTColor}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{card.title}</span>
                <span className={`rounded-lg border p-1.5 ${card.color}`}>
                  <Icon className="h-4 w-4" />
                </span>
              </div>
              <div className="mt-3">
                <span className="text-3xl font-bold text-slate-900 tracking-tight dark:text-white">{card.value}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Info Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Upcoming Interviews */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-6 shadow-xs border-t-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:border-t-slate-100">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4 dark:border-slate-800">
            <h3 className="font-semibold text-slate-900 dark:text-white">Upcoming Interviews</h3>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {upcomingInterviews.length} Scheduled
            </span>
          </div>

          {upcomingInterviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Calendar className="h-10 w-10 text-slate-300 stroke-[1.5] mb-2 dark:text-slate-700" />
              <p className="text-sm text-slate-500 font-medium dark:text-slate-400">No upcoming interviews scheduled</p>
              <p className="text-xs text-slate-400 mt-1 dark:text-slate-500">Keep applying to land your next big conversation!</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {upcomingInterviews.map((interview) => (
                <div
                  key={interview.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between py-4 first:pt-0 last:pb-0 gap-4"
                >
                  <div className="space-y-1">
                    <h4 className="font-semibold text-slate-900 text-sm dark:text-white">
                      {interview.jobApplication.role} @ {interview.jobApplication.companyName}
                    </h4>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                      <span>
                        Date: {new Date(interview.interviewDate).toLocaleDateString(undefined, {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      {interview.interviewTime && <span>Time: {interview.interviewTime}</span>}
                      {interview.interviewerName && <span>Interviewer: {interview.interviewerName}</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {interview.meetingLink && (
                      <a
                        href={interview.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white hover:bg-slate-50 transition-colors dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-800"
                      >
                        Join Call
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                    <Link
                      to={`/jobs/${interview.id}`}
                      className="inline-flex items-center gap-0.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white hover:bg-slate-50 transition-colors dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      Details
                      <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Tips or Info Panel */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between border-t-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:border-t-slate-100">
          <div>
            <h3 className="font-semibold text-slate-900 border-b border-slate-100 pb-4 mb-4 dark:border-slate-800 dark:text-white">
              Career Pipeline Guide
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-800 dark:bg-slate-800 dark:text-slate-100">
                  1
                </span>
                <div>
                  <p className="font-medium text-slate-800 dark:text-slate-200">Organize your pipeline</p>
                  <p className="text-xs text-slate-400 mt-0.5 dark:text-slate-500">
                    Drag card between statuses in the Kanban Board to keep your pipeline clean.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-800 dark:bg-slate-800 dark:text-slate-100">
                  2
                </span>
                <div>
                  <p className="font-medium text-slate-800 dark:text-slate-200">Schedule mock interviews</p>
                  <p className="text-xs text-slate-400 mt-0.5 dark:text-slate-500">
                    Add notes or schedule preparation tasks under each job details view.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-800 dark:bg-slate-800 dark:text-slate-100">
                  3
                </span>
                <div>
                  <p className="font-medium text-slate-800 dark:text-slate-200">Collect resources</p>
                  <p className="text-xs text-slate-400 mt-0.5 dark:text-slate-500">
                    Use our notes tab to save job description highlights and company research.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <div className="border-t border-slate-100 pt-4 mt-6 dark:border-slate-800">
            <Link
              to="/kanban"
              className="flex items-center justify-between rounded-lg bg-slate-50 p-3 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <span>Go to Kanban Board</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
