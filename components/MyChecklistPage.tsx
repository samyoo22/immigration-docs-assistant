import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  ClipboardList,
  FileText,
  ListChecks,
  MessageSquareText,
  ShieldCheck,
  Trash2,
  UploadCloud,
} from 'lucide-react';
import { SavedChecklist } from '../types';
import {
  deleteSavedChecklist,
  getSavedChecklists,
  toggleSavedChecklistItem,
} from '../utils/savedChecklists';

const sourceLabels: Record<SavedChecklist['source'], string> = {
  'document-review': 'From document review',
  template: 'From checklist template',
};

const getChecklistStats = (checklist: SavedChecklist) => {
  const completedCount = checklist.items.filter((item) => item.completed).length;
  const totalCount = checklist.items.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const nextIncompleteTask = checklist.items.find((item) => !item.completed);

  return { completedCount, totalCount, progressPercent, nextIncompleteTask };
};

const getChecklistAnchorId = (checklist: SavedChecklist) => `checklist-${checklist.id.replace(/[^a-zA-Z0-9_-]/g, '-')}`;

interface MyChecklistPageProps {
  onNavigateHome: (event?: React.MouseEvent<HTMLElement>) => void;
  onNavigateUpload: (event?: React.MouseEvent<HTMLElement>) => void;
  onNavigateChecklists: (event?: React.MouseEvent<HTMLElement>) => void;
  onNavigateTemplates: (event?: React.MouseEvent<HTMLElement>) => void;
}

const MyChecklistPage: React.FC<MyChecklistPageProps> = ({
  onNavigateHome,
  onNavigateUpload,
  onNavigateChecklists,
  onNavigateTemplates,
}) => {
  const [savedChecklists, setSavedChecklists] = useState<SavedChecklist[]>([]);

  useEffect(() => {
    setSavedChecklists(getSavedChecklists());
  }, []);

  const totals = useMemo(() => {
    const totalTasks = savedChecklists.reduce((sum, checklist) => sum + checklist.items.length, 0);
    const completedTasks = savedChecklists.reduce(
      (sum, checklist) => sum + checklist.items.filter((item) => item.completed).length,
      0,
    );
    const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return { completedTasks, totalTasks, progressPercent };
  }, [savedChecklists]);

  const continueChecklist = useMemo(() => {
    if (savedChecklists.length === 0) return null;

    return [...savedChecklists].sort((a, b) => {
      const aTime = new Date(a.updatedAt || a.createdAt).getTime();
      const bTime = new Date(b.updatedAt || b.createdAt).getTime();
      return bTime - aTime;
    })[0];
  }, [savedChecklists]);

  const handleToggleItem = (checklistId: string, itemId: string) => {
    setSavedChecklists(toggleSavedChecklistItem(checklistId, itemId));
  };

  const handleDeleteChecklist = (checklistId: string) => {
    setSavedChecklists(deleteSavedChecklist(checklistId));
  };

  return (
    <div className="animate-fade-in py-8">
      <a
        href="/"
        onClick={onNavigateHome}
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-sky-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </a>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr),320px] lg:items-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Saved tasks</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">My Visa Checklist</h1>
          <p className="mt-3 text-base leading-7 text-slate-600">
            Track saved visa tasks from your document reviews and checklist templates.
          </p>
        </div>

        <OverallProgress
          completedTasks={totals.completedTasks}
          totalTasks={totals.totalTasks}
          progressPercent={totals.progressPercent}
        />
      </div>

      {savedChecklists.length === 0 ? (
        <EmptyState
          onNavigateUpload={onNavigateUpload}
          onNavigateChecklists={onNavigateChecklists}
          onNavigateTemplates={onNavigateTemplates}
        />
      ) : (
        <div className="mt-6 space-y-5">
          {continueChecklist && <ContinueWhereLeftOff checklist={continueChecklist} />}
          {savedChecklists.map((checklist) => (
            <SavedChecklistCard
              key={checklist.id}
              checklist={checklist}
              onToggleItem={handleToggleItem}
              onDeleteChecklist={handleDeleteChecklist}
            />
          ))}
        </div>
      )}

      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-sky-700" />
          <p className="text-sm leading-6 text-slate-600">
            VIsatodo is not a law firm and does not provide legal advice. Saved checklists are general planning tools to help you organize tasks.
            Always confirm requirements with USCIS, your DSO, employer, or a qualified immigration attorney.
          </p>
        </div>
      </div>
    </div>
  );
};

const OverallProgress = ({
  completedTasks,
  totalTasks,
  progressPercent,
}: {
  completedTasks: number;
  totalTasks: number;
  progressPercent: number;
}) => (
  <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex items-center gap-2">
      <ClipboardList className="h-4 w-4 text-sky-700" />
      <h2 className="text-sm font-semibold text-slate-950">Overall progress</h2>
    </div>
    <p className="mt-4 text-2xl font-semibold text-slate-950">
      {completedTasks} of {totalTasks} tasks completed
    </p>
    <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-100">
      <div className="h-full rounded-full bg-sky-700 transition-all" style={{ width: `${progressPercent}%` }} />
    </div>
    <p className="mt-2 text-xs font-medium text-slate-500">{progressPercent}% complete</p>
  </aside>
);

const ContinueWhereLeftOff = ({ checklist }: { checklist: SavedChecklist }) => {
  const { completedCount, totalCount, progressPercent, nextIncompleteTask } = getChecklistStats(checklist);
  const allComplete = totalCount > 0 && completedCount === totalCount;

  return (
    <section className="rounded-2xl border border-sky-200 bg-sky-50 p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">Continue where you left off</p>
          <h2 className="mt-2 text-xl font-semibold text-slate-950">{checklist.title}</h2>
          <p className="mt-2 text-sm font-medium text-slate-700">
            {completedCount} of {totalCount} completed
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            {allComplete ? 'All tasks completed' : `Next task: ${nextIncompleteTask?.title || 'Review remaining tasks'}`}
          </p>
          <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white">
            <div className="h-full rounded-full bg-sky-700 transition-all" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
        <a
          href={`#${getChecklistAnchorId(checklist)}`}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-800"
        >
          {allComplete ? 'Review checklist' : 'Continue checklist'}
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
};

const EmptyState = ({
  onNavigateUpload,
  onNavigateChecklists,
  onNavigateTemplates,
}: {
  onNavigateUpload: (event?: React.MouseEvent<HTMLElement>) => void;
  onNavigateChecklists: (event?: React.MouseEvent<HTMLElement>) => void;
  onNavigateTemplates: (event?: React.MouseEvent<HTMLElement>) => void;
}) => (
  <section className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
      <ListChecks className="h-7 w-7" />
    </div>
    <h2 className="mt-5 text-lg font-semibold text-slate-950">No saved checklist yet</h2>
    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
      Analyze a document or open a visa checklist to save tasks here.
    </p>
    <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
      <a
        href="/upload"
        onClick={onNavigateUpload}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-800"
      >
        <UploadCloud className="h-4 w-4" />
        Analyze a document
      </a>
      <a
        href="/checklists"
        onClick={onNavigateChecklists}
        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:bg-sky-50"
      >
        <ListChecks className="h-4 w-4" />
        Browse checklists
      </a>
      <a
        href="/templates"
        onClick={onNavigateTemplates}
        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:bg-sky-50"
      >
        <MessageSquareText className="h-4 w-4" />
        Browse templates
      </a>
    </div>
  </section>
);

const SavedChecklistCard = ({
  checklist,
  onToggleItem,
  onDeleteChecklist,
}: {
  checklist: SavedChecklist;
  onToggleItem: (checklistId: string, itemId: string) => void;
  onDeleteChecklist: (checklistId: string) => void;
}) => {
  const { completedCount, totalCount, progressPercent, nextIncompleteTask } = getChecklistStats(checklist);
  const createdDate = new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(
    new Date(checklist.createdAt),
  );
  const allComplete = totalCount > 0 && completedCount === totalCount;

  return (
    <section id={getChecklistAnchorId(checklist)} className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700 ring-1 ring-sky-100">
              {checklist.source === 'document-review' ? <FileText className="h-3.5 w-3.5" /> : <ListChecks className="h-3.5 w-3.5" />}
              {sourceLabels[checklist.source]}
            </span>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
              Saved {createdDate}
            </span>
          </div>
          <h2 className="mt-3 text-lg font-semibold text-slate-950">{checklist.title}</h2>
          <p className="mt-2 text-sm font-medium text-slate-600">
            {completedCount} of {totalCount} tasks completed
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            {allComplete ? 'All tasks completed' : `Next: ${nextIncompleteTask?.title || 'Review remaining tasks'}`}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onDeleteChecklist(checklist.id)}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-50"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Remove
        </button>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-sky-700 transition-all" style={{ width: `${progressPercent}%` }} />
      </div>

      <div className="mt-5 grid gap-3">
        {checklist.items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onToggleItem(checklist.id, item.id)}
            className={`w-full rounded-xl border p-4 text-left transition ${
              item.completed
                ? 'border-emerald-200 bg-emerald-50'
                : 'border-slate-200 bg-slate-50 hover:border-sky-200 hover:bg-sky-50/50'
            }`}
          >
            <div className="flex gap-3">
              <div className="mt-0.5 shrink-0">
                {item.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                ) : (
                  <Circle className="h-5 w-5 text-slate-400" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  {item.priority && (
                    <span className="rounded-full border border-sky-100 bg-white px-2 py-0.5 text-xs font-semibold text-sky-700">
                      {item.priority} priority
                    </span>
                  )}
                  {item.dueDate && (
                    <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-slate-500 ring-1 ring-slate-200">
                      {item.dueDate}
                    </span>
                  )}
                </div>
                <h3 className={`mt-2 text-sm font-semibold ${item.completed ? 'text-emerald-900 line-through' : 'text-slate-950'}`}>
                  {item.title}
                </h3>
                {item.description && (
                  <p className={`mt-1 text-sm leading-6 ${item.completed ? 'text-emerald-800/80' : 'text-slate-600'}`}>
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};

export default MyChecklistPage;
