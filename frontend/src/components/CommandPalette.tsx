import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Search,
  Plus,
  LayoutDashboard,
  Briefcase,
  Kanban,
  User,
  Command,
  ArrowRight,
} from 'lucide-react';
import API from '../api/axios';

interface JobApplication {
  id: string;
  companyName: string;
  role: string;
  status: string;
}

interface Command {
  id: string;
  type: 'navigation' | 'action' | 'job';
  label: string;
  description?: string;
  icon: React.ElementType;
  action: () => void;
  shortcut?: string;
}

const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const commandPaletteRef = useRef<HTMLDivElement>(null);

  // Fetch jobs for search
  const { data: jobs } = useQuery<JobApplication[]>({
    queryKey: ['jobs'],
    queryFn: async () => {
      const res = await API.get('/jobs');
      return res.data;
    },
    enabled: isOpen,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setHighlightedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (commandPaletteRef.current && !commandPaletteRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const navigationCommands: Command[] = [
    {
      id: 'dashboard',
      type: 'navigation',
      label: 'Go to Dashboard',
      description: 'View your job application overview',
      icon: LayoutDashboard,
      action: () => navigate('/dashboard'),
      shortcut: 'G D',
    },
    {
      id: 'applications',
      type: 'navigation',
      label: 'Go to Applications',
      description: 'View and manage your job applications',
      icon: Briefcase,
      action: () => navigate('/jobs'),
      shortcut: 'G J',
    },
    {
      id: 'kanban',
      type: 'navigation',
      label: 'Go to Kanban Board',
      description: 'View your application pipeline',
      icon: Kanban,
      action: () => navigate('/kanban'),
      shortcut: 'G K',
    },
    {
      id: 'profile',
      type: 'navigation',
      label: 'Go to Profile',
      description: 'Manage your account settings',
      icon: User,
      action: () => navigate('/profile'),
      shortcut: 'G P',
    },
  ];

  const actionCommands: Command[] = [
    {
      id: 'add-application',
      type: 'action',
      label: 'Add New Application',
      description: 'Create a new job application',
      icon: Plus,
      action: () => {
        navigate('/jobs');
        setTimeout(() => {
          // Trigger the add button click (would need to implement this)
          const addButton = document.querySelector('button[class*="bg-slate-900"]') as HTMLButtonElement;
          addButton?.click();
        }, 100);
      },
      shortcut: 'A',
    },
  ];

  const jobCommands: Command[] =
    jobs?.map((job) => ({
      id: job.id,
      type: 'job' as const,
      label: `${job.companyName} - ${job.role}`,
      description: job.status,
      icon: Briefcase,
      action: () => navigate(`/jobs/${job.id}`),
    })) || [];

  const allCommands = [...navigationCommands, ...actionCommands, ...jobCommands];

  const filteredCommands = query
    ? allCommands.filter(
        (command) =>
          command.label.toLowerCase().includes(query.toLowerCase()) ||
          command.description?.toLowerCase().includes(query.toLowerCase())
      )
    : allCommands;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % filteredCommands.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === 'Enter' && filteredCommands[highlightedIndex]) {
      e.preventDefault();
      filteredCommands[highlightedIndex].action();
      setIsOpen(false);
    }
  };

  const handleCommandClick = (command: Command) => {
    command.action();
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-slate-900/20 backdrop-blur-sm">
      <div
        ref={commandPaletteRef}
        className="w-full max-w-xl mx-4 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 p-4">
          <Search className="h-5 w-5 text-slate-400 dark:text-slate-500" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setHighlightedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search applications, commands, pages..."
            className="flex-1 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none text-base"
            autoFocus
          />
          <kbd className="hidden sm:flex items-center gap-1 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-1.5 py-0.5 text-xs text-slate-400 dark:text-slate-500">
            <span className="text-[10px]">ESC</span>
          </kbd>
        </div>

        {/* Commands List */}
        <div className="max-h-[400px] overflow-y-auto">
          {!query && (
            <>
              <div className="px-4 py-2">
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Navigation</p>
              </div>
              {navigationCommands.map((command, index) => {
                const Icon = command.icon;
                const globalIndex = index;
                return (
                  <button
                    key={command.id}
                    onClick={() => handleCommandClick(command)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                      highlightedIndex === globalIndex ? 'bg-slate-50 dark:bg-slate-800' : ''
                    }`}
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{command.label}</p>
                      {command.description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{command.description}</p>
                      )}
                    </div>
                    {command.shortcut && (
                      <kbd className="flex items-center gap-1 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-1.5 py-0.5 text-xs text-slate-400 dark:text-slate-500">
                        {command.shortcut}
                      </kbd>
                    )}
                  </button>
                );
              })}

              <div className="px-4 py-2 mt-2">
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Actions</p>
              </div>
              {actionCommands.map((command, index) => {
                const Icon = command.icon;
                const globalIndex = navigationCommands.length + index;
                return (
                  <button
                    key={command.id}
                    onClick={() => handleCommandClick(command)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                      highlightedIndex === globalIndex ? 'bg-slate-50 dark:bg-slate-800' : ''
                    }`}
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{command.label}</p>
                      {command.description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{command.description}</p>
                      )}
                    </div>
                    {command.shortcut && (
                      <kbd className="flex items-center gap-1 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-1.5 py-0.5 text-xs text-slate-400 dark:text-slate-500">
                        {command.shortcut}
                      </kbd>
                    )}
                  </button>
                );
              })}
            </>
          )}

          {query && filteredCommands.length > 0 && (
            <div>
              {filteredCommands.map((command, index) => {
                const Icon = command.icon;
                return (
                  <button
                    key={command.id}
                    onClick={() => handleCommandClick(command)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                      highlightedIndex === index ? 'bg-slate-50 dark:bg-slate-800' : ''
                    }`}
                  >
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                        command.type === 'action' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{command.label}</p>
                      {command.description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{command.description}</p>
                      )}
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                  </button>
                );
              })}
            </div>
          )}

          {query && filteredCommands.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Search className="h-8 w-8 text-slate-300 dark:text-slate-600 mb-2" />
              <p className="text-sm text-slate-500 dark:text-slate-400">No results found</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 py-2 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <kbd className="flex items-center gap-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-1.5 py-0.5 text-[10px]">
                <span>↑↓</span>
              </kbd>
              <span>to navigate</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="flex items-center gap-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-1.5 py-0.5 text-[10px]">
                <span>↵</span>
              </kbd>
              <span>to select</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="flex items-center gap-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-1.5 py-0.5 text-[10px]">
                <span>ESC</span>
              </kbd>
              <span>to close</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Command className="h-3 w-3" />
            <span>+</span>
            <kbd className="rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-1.5 py-0.5 text-[10px]">K</kbd>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
