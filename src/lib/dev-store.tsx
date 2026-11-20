import { useContext, useEffect, useState, type ReactNode } from "react";
import { refreshContext, type RefreshContextCache } from "./devready/refresh-context";
import { toggleItem } from "./dev-data";
import {
  defaultProfile,
  dayKey,
  recordActivity,
  type Profile,
  type Activity,
  type AssessmentResult,
} from "./devready/progress";
type Note = { id: string; title: string; body: string; linked?: string };
type State = {
  bookmarks: string[];
  completed: string[];
  checklist: string[];
  notes: Note[];
  experience: string;
  theme: string;
  goal: number;
  target: string;
  profile: Profile;
  activity: Activity[];
  results: AssessmentResult[];
  lastLesson: string;
  recent: string[];
  difficult: string[];
  reminders: Record<string, string>;
  drafts: Record<string, string>;
  solved: string[];
};
const initial: State = {
  bookmarks: [],
  completed: [],
  checklist: [],
  notes: [],
  experience: "3–5 years",
  theme: "dark",
  goal: 8,
  target: "Senior Frontend Engineer",
  profile: defaultProfile,
  activity: [],
  results: [],
  lastLesson: "",
  recent: [],
  difficult: [],
  reminders: {},
  drafts: {},
  solved: [],
};
type Store = State & {
  loaded: boolean;
  toggleBookmark: (id: string) => void;
  toggleComplete: (id: string) => void;
  toggleCheck: (id: string) => void;
  setExperience: (value: string) => void;
  setTheme: (value: string) => void;
  setGoal: (value: number) => void;
  setTarget: (value: string) => void;
  saveNote: (note: Note) => void;
  deleteNote: (id: string) => void;
  updateProfile: (profile: Partial<Profile>) => void;
  visit: (id: string, lesson?: boolean) => void;
  saveResult: (result: AssessmentResult) => void;
  toggleDifficult: (id: string) => void;
  remind: (id: string, date: string) => void;
  saveDraft: (id: string, code: string) => void;
  markSolved: (id: string) => void;
};
const Context = refreshContext<Store>(
  import.meta.hot ? (import.meta.hot.data as RefreshContextCache<Store>) : undefined,
);
export function DevProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(initial),
    [loaded, setLoaded] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("devready-workspace");
      if (raw) {
        const data = JSON.parse(raw) as Partial<State>;
        const strings = (value: unknown) =>
          Array.isArray(value) ? value.filter((x): x is string => typeof x === "string") : [];
        setState({
          ...initial,
          ...data,
          bookmarks: strings(data.bookmarks),
          completed: strings(data.completed),
          checklist: strings(data.checklist).filter((x) => x !== "daily-0"),
          notes: Array.isArray(data.notes)
            ? data.notes.filter(
                (n) =>
                  n &&
                  typeof n.id === "string" &&
                  typeof n.title === "string" &&
                  typeof n.body === "string",
              )
            : [],
          profile: { ...defaultProfile, ...data.profile },
          activity: Array.isArray(data.activity) ? data.activity : [],
          results: Array.isArray(data.results) ? data.results : [],
          recent: strings(data.recent),
          difficult: strings(data.difficult),
          solved: strings(data.solved),
          drafts: data.drafts && typeof data.drafts === "object" ? data.drafts : {},
          reminders: data.reminders && typeof data.reminders === "object" ? data.reminders : {},
        });
      }
    } catch {
      /* Keep usable defaults if browser storage is unavailable. */
    }
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (loaded) {
      try {
        localStorage.setItem("devready-workspace", JSON.stringify(state));
      } catch {
        /* Storage may be full or disabled. */
      }
    }
    document.documentElement.classList.toggle("light", state.theme === "light");
  }, [state, loaded]);
  const patch = (values: Partial<State>) => setState((s) => ({ ...s, ...values }));
  const toggle = (key: "bookmarks" | "completed" | "checklist" | "difficult", id: string) =>
    setState((s) => ({
      ...s,
      [key]: toggleItem(s[key], id),
      activity:
        key === "completed" && !s.completed.includes(id)
          ? recordActivity(s.activity, `complete/${id}`)
          : s.activity,
    }));
  return (
    <Context.Provider
      value={{
        ...state,
        loaded,
        toggleBookmark: (id) => toggle("bookmarks", id),
        toggleComplete: (id) => toggle("completed", id),
        toggleCheck: (id) => toggle("checklist", id),
        toggleDifficult: (id) => toggle("difficult", id),
        setExperience: (experience) => patch({ experience }),
        setTheme: (theme) => patch({ theme }),
        setGoal: (goal) => patch({ goal }),
        setTarget: (target) => patch({ target }),
        updateProfile: (profile) =>
          setState((s) => ({ ...s, profile: { ...s.profile, ...profile } })),
        saveNote: (note) =>
          setState((s) => ({
            ...s,
            notes: s.notes.some((n) => n.id === note.id)
              ? s.notes.map((n) => (n.id === note.id ? note : n))
              : [note, ...s.notes],
          })),
        deleteNote: (id) => setState((s) => ({ ...s, notes: s.notes.filter((n) => n.id !== id) })),
        visit: (id, lesson = false) =>
          setState((s) => ({
            ...s,
            recent: [id, ...s.recent.filter((x) => x !== id)].slice(0, 30),
            lastLesson: lesson ? id : s.lastLesson,
            activity: recordActivity(s.activity, `visit/${id}`),
          })),
        saveResult: (result) =>
          setState((s) => ({
            ...s,
            results: [...s.results, result],
            activity: recordActivity(s.activity, `assessment/${result.id}/${dayKey()}`),
          })),
        remind: (id, date) =>
          setState((s) => ({ ...s, reminders: { ...s.reminders, [id]: date } })),
        saveDraft: (id, code) => setState((s) => ({ ...s, drafts: { ...s.drafts, [id]: code } })),
        markSolved: (id) =>
          setState((s) => ({
            ...s,
            solved: s.solved.includes(id) ? s.solved : [...s.solved, id],
            activity: recordActivity(s.activity, `solved/${id}`),
          })),
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useDev() {
  const value = useContext(Context);
  if (!value) throw new Error("DevReady workspace is unavailable");
  return value;
}
