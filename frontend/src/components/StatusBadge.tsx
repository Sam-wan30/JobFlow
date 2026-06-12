export const STATUS_STYLES: Record<string, { bg: string; text: string; border: string; label: string }> = {
  'Applied': { bg: 'bg-slate-50 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-300', border: 'border-slate-200 dark:border-slate-700', label: 'Applied' },
  'Under Review': { bg: 'bg-amber-50/70 dark:bg-amber-900/30', text: 'text-amber-800 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-700', label: 'Under Review' },
  'OA Scheduled': { bg: 'bg-sky-50/70 dark:bg-sky-900/30', text: 'text-sky-800 dark:text-sky-300', border: 'border-sky-200 dark:border-sky-700', label: 'OA Scheduled' },
  'Interview Scheduled': { bg: 'bg-purple-50/70 dark:bg-purple-900/30', text: 'text-purple-800 dark:text-purple-300', border: 'border-purple-200 dark:border-purple-700', label: 'Interview Scheduled' },
  'Final Round': { bg: 'bg-indigo-50/70 dark:bg-indigo-900/30', text: 'text-indigo-800 dark:text-indigo-300', border: 'border-indigo-200 dark:border-indigo-700', label: 'Final Round' },
  'Offer Received': { bg: 'bg-emerald-50/70 dark:bg-emerald-900/30', text: 'text-emerald-800 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-700', label: 'Offer Received' },
  'Rejected': { bg: 'bg-rose-50/70 dark:bg-rose-900/30', text: 'text-rose-800 dark:text-rose-300', border: 'border-rose-200 dark:border-rose-700', label: 'Rejected' },
};

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const style = STATUS_STYLES[status] || {
    bg: 'bg-slate-50',
    text: 'text-slate-700',
    border: 'border-slate-200',
    label: status,
  };
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium transition-colors ${style.bg} ${style.text} ${style.border}`}
    >
      {style.label}
    </span>
  );
};
