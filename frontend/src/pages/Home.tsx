import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  CalendarCheck,
  CheckCircle2,
  CircleDotDashed,
  ListChecks,
  SearchCheck,
  Sparkles,
} from 'lucide-react';
import logo from '../assets/jobflow-logo.png';
import ThemeToggle from '../components/ThemeToggle';

const features = [
  {
    title: 'Application Tracking',
    description: 'Keep every opportunity, contact, deadline, and note organized in one reliable workspace.',
    icon: BriefcaseBusiness,
  },
  {
    title: 'Status Management',
    description: 'Move roles through a clear pipeline so you always know what needs attention next.',
    icon: ListChecks,
  },
  {
    title: 'Interview Scheduling',
    description: 'Track interview stages, preparation notes, and follow-ups without losing momentum.',
    icon: CalendarCheck,
  },
  {
    title: 'Job Search Analytics',
    description: 'Understand where your search stands with focused metrics that help you improve.',
    icon: BarChart3,
  },
];

const steps = [
  {
    title: 'Add Jobs',
    description: 'Capture new roles with company, position, location, status, and job details.',
    icon: SearchCheck,
  },
  {
    title: 'Track Progress',
    description: 'Use your dashboard and pipeline to keep every application moving forward.',
    icon: CircleDotDashed,
  },
  {
    title: 'Get Hired',
    description: 'Stay prepared, follow up on time, and focus your energy on the right opportunities.',
    icon: CheckCircle2,
  },
];

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/85">
        <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3" aria-label="JobFlow home">
            <img src={logo} alt="JobFlow logo" className="h-10 w-10 rounded-lg object-cover shadow-sm" />
            <span className="text-base font-bold tracking-tight text-slate-950 dark:text-white">JobFlow</span>
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              to="/login"
              className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-950 dark:text-slate-200 dark:hover:bg-slate-900 dark:hover:text-white"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-md dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.12),_transparent_34%),linear-gradient(180deg,_rgba(255,255,255,0.92),_rgba(248,250,252,1))] dark:bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.16),_transparent_34%),linear-gradient(180deg,_rgba(2,6,23,0.96),_rgba(2,6,23,1))]" />
          <img
            src={logo}
            alt=""
            aria-hidden="true"
            className="absolute inset-y-8 right-6 hidden h-[calc(100%-4rem)] w-[52rem] max-w-[48vw] object-contain object-center opacity-25 lg:block dark:opacity-18"
          />
          <div className="relative mx-auto flex min-h-[calc(100svh-8rem)] w-full max-w-7xl items-center px-4 py-14 sm:px-6 lg:px-8">
            <div className="landing-fade-up max-w-3xl">
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-3 py-1 text-sm font-medium text-slate-600 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-300">
                <Sparkles className="h-4 w-4 text-sky-500" aria-hidden="true" />
                Modern Job Application Tracker
              </div>
              <img
                src={logo}
                alt="JobFlow logo"
                className="mb-7 h-20 w-20 rounded-2xl object-cover shadow-md ring-1 ring-slate-200 dark:ring-slate-800"
              />
              <h1 className="max-w-4xl text-5xl font-bold leading-[1.02] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl dark:text-white">
                Track Every Job Application in One Place
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
                JobFlow gives your job search a calm command center: applications, statuses, interviews, notes, and
                progress insights stay organized from first save to final offer.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-md dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
                >
                  Get Started
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white py-20 dark:border-slate-800 dark:bg-slate-950">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">Features</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl dark:text-white">
                Everything your search needs, without the clutter.
              </h2>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <article
                    key={feature.title}
                    className="landing-fade-up rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-slate-300 hover:bg-white hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 dark:hover:bg-slate-900"
                    style={{ animationDelay: `${index * 80}ms` }}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-sky-600 ring-1 ring-slate-200 dark:bg-slate-950 dark:text-sky-400 dark:ring-slate-800">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <h3 className="mt-5 text-base font-semibold text-slate-950 dark:text-white">{feature.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{feature.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-20 dark:bg-slate-950">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                  How It Works
                </p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl dark:text-white">
                  A simple system for a high-stakes process.
                </h2>
              </div>
              <div className="grid gap-4">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <article
                      key={step.title}
                      className="landing-fade-up flex gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                      style={{ animationDelay: `${index * 90}ms` }}
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-950">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                          Step {index + 1}
                        </div>
                        <h3 className="mt-1 text-lg font-semibold text-slate-950 dark:text-white">{step.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{step.description}</p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-20 dark:bg-slate-950 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-slate-950 px-6 py-12 text-center shadow-xl dark:border-slate-800 dark:bg-white sm:px-10">
            <img src={logo} alt="JobFlow logo" className="mx-auto h-14 w-14 rounded-xl object-cover shadow-sm" />
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl dark:text-slate-950">
              Build a job search you can trust.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-300 dark:text-slate-600">
              Create your account and turn scattered applications into a focused, measurable workflow.
            </p>
            <div className="mt-8">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-slate-950 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-slate-100 hover:shadow-md dark:bg-slate-950 dark:text-white dark:hover:bg-slate-900"
              >
                Create an Account
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white py-8 dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <Link to="/" className="flex items-center gap-3" aria-label="JobFlow home">
            <img src={logo} alt="JobFlow logo" className="h-9 w-9 rounded-lg object-cover" />
            <span className="text-sm font-semibold text-slate-950 dark:text-white">JobFlow</span>
          </Link>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Copyright {new Date().getFullYear()} JobFlow. All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-sm text-slate-500 dark:text-slate-400">
            <a href="#privacy" className="transition-colors hover:text-slate-950 dark:hover:text-white">
              Privacy Policy
            </a>
            <a href="#terms" className="transition-colors hover:text-slate-950 dark:hover:text-white">
              Terms
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
