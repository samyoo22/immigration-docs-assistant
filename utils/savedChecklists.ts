import { SavedChecklist } from '../types';

const SAVED_CHECKLISTS_STORAGE_KEY = 'visatodo.savedChecklists';

const isBrowserStorageAvailable = () => typeof window !== 'undefined' && Boolean(window.localStorage);

const normalizeChecklist = (checklist: SavedChecklist): SavedChecklist => ({
  ...checklist,
  updatedAt: checklist.updatedAt || checklist.createdAt,
  items: checklist.items.map((item) => ({
    ...item,
    completed: Boolean(item.completed),
  })),
});

export const getSavedChecklists = (): SavedChecklist[] => {
  if (!isBrowserStorageAvailable()) return [];

  try {
    const saved = window.localStorage.getItem(SAVED_CHECKLISTS_STORAGE_KEY);
    if (!saved) return [];

    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((checklist): checklist is SavedChecklist => {
        return (
          checklist &&
          typeof checklist.id === 'string' &&
          typeof checklist.title === 'string' &&
          Array.isArray(checklist.items)
        );
      })
      .map(normalizeChecklist);
  } catch {
    return [];
  }
};

const writeSavedChecklists = (checklists: SavedChecklist[]) => {
  if (!isBrowserStorageAvailable()) return;
  window.localStorage.setItem(SAVED_CHECKLISTS_STORAGE_KEY, JSON.stringify(checklists));
};

const mergeChecklistItems = (existing: SavedChecklist, incoming: SavedChecklist): SavedChecklist => {
  const completedByTitle = new Map(existing.items.map((item) => [item.title, item.completed]));

  return {
    ...incoming,
    createdAt: existing.createdAt,
    updatedAt: new Date().toISOString(),
    items: incoming.items.map((item) => ({
      ...item,
      completed: completedByTitle.get(item.title) ?? item.completed,
    })),
  };
};

export const saveChecklist = (checklist: SavedChecklist): { checklist: SavedChecklist; status: 'created' | 'updated' } => {
  const savedChecklists = getSavedChecklists();
  const existingIndex = savedChecklists.findIndex((saved) => {
    if (saved.id === checklist.id) return true;
    return Boolean(saved.sourceKey && checklist.sourceKey && saved.sourceKey === checklist.sourceKey);
  });

  if (existingIndex >= 0) {
    const updatedChecklist = mergeChecklistItems(savedChecklists[existingIndex], normalizeChecklist(checklist));
    const nextChecklists = [...savedChecklists];
    nextChecklists[existingIndex] = updatedChecklist;
    writeSavedChecklists(nextChecklists);
    return { checklist: updatedChecklist, status: 'updated' };
  }

  const normalizedChecklist = normalizeChecklist(checklist);
  const now = new Date().toISOString();
  const checklistWithTimestamps = {
    ...normalizedChecklist,
    createdAt: normalizedChecklist.createdAt || now,
    updatedAt: now,
  };
  writeSavedChecklists([checklistWithTimestamps, ...savedChecklists]);
  return { checklist: checklistWithTimestamps, status: 'created' };
};

export const updateSavedChecklist = (checklistId: string, updatedChecklist: SavedChecklist): SavedChecklist[] => {
  const nextChecklists = getSavedChecklists().map((checklist) =>
    checklist.id === checklistId ? normalizeChecklist({ ...updatedChecklist, updatedAt: new Date().toISOString() }) : checklist,
  );
  writeSavedChecklists(nextChecklists);
  return nextChecklists;
};

export const toggleSavedChecklistItem = (checklistId: string, itemId: string): SavedChecklist[] => {
  const nextChecklists = getSavedChecklists().map((checklist) => {
    if (checklist.id !== checklistId) return checklist;

    return {
      ...checklist,
      updatedAt: new Date().toISOString(),
      items: checklist.items.map((item) =>
        item.id === itemId ? { ...item, completed: !item.completed } : item,
      ),
    };
  });

  writeSavedChecklists(nextChecklists);
  return nextChecklists;
};

export const deleteSavedChecklist = (checklistId: string): SavedChecklist[] => {
  const nextChecklists = getSavedChecklists().filter((checklist) => checklist.id !== checklistId);
  writeSavedChecklists(nextChecklists);
  return nextChecklists;
};

export const getSavedChecklistsStorageKey = () => SAVED_CHECKLISTS_STORAGE_KEY;
