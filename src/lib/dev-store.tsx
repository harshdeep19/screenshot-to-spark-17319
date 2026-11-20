import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { toggleItem } from "./dev-data";
type Note = { id: string; title: string; body: string };
type State = {
  bookmarks: string[];
  completed: string[];
  checklist: string[];
  notes: Note[];
  experience: string;
  theme: string;
  goal: number;
  target: string;
};
const initial: State = {
  bookmarks: [],
  completed: [],
  checklist: ["daily-0"],
  notes: [],
  experience: "3–5 years",
  theme: "dark",
  goal: 8,
  target: "Senior Frontend Engineer",
};
type Store = State & {
  toggleBookmark: (id: string) => void;
  toggleComplete: (id: string) => void;
  toggleCheck: (id: string) => void;
  setExperience: (value: string) => void;
  setTheme: (value: string) => void;
  setGoal: (value: number) => void;
  setTarget: (value: string) => void;
  saveNote: (note: Note) => void;
  deleteNote: (id: string) => void;
};
const Context = createContext<Store | null>(null);
export function DevProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(initial);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("devready-workspace");
      if (raw) {
        const data = JSON.parse(raw) as Partial<State>;
        setState({
          ...initial,
          ...data,
          bookmarks: Array.isArray(data.bookmarks) ? data.bookmarks : [],
          completed: Array.isArray(data.completed) ? data.completed : [],
          checklist: Array.isArray(data.checklist) ? data.checklist : initial.checklist,
          notes: Array.isArray(data.notes) ? data.notes : [],
        });
      }
    } catch {
      /* Use an intact workspace if saved data is unreadable. */
    }
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (loaded) {
      try {
        localStorage.setItem("devready-workspace", JSON.stringify(state));
      } catch {
        /* Browser storage can be unavailable. */
      }
    }
    document.documentElement.classList.toggle("light", state.theme === "light");
  }, [state, loaded]);
  const patch = (values: Partial<State>) => setState((s) => ({ ...s, ...values }));
  const toggle = (key: "bookmarks" | "completed" | "checklist", id: string) =>
    setState((s) => ({ ...s, [key]: toggleItem(s[key], id) }));
  return (
    <Context.Provider
      value={{
        ...state,
        toggleBookmark: (id) => toggle("bookmarks", id),
        toggleComplete: (id) => toggle("completed", id),
        toggleCheck: (id) => toggle("checklist", id),
        setExperience: (experience) => patch({ experience }),
        setTheme: (theme) => patch({ theme }),
        setGoal: (goal) => patch({ goal }),
        setTarget: (target) => patch({ target }),
        saveNote: (note) =>
          setState((s) => ({
            ...s,
            notes: s.notes.some((n) => n.id === note.id)
              ? s.notes.map((n) => (n.id === note.id ? note : n))
              : [note, ...s.notes],
          })),
        deleteNote: (id) => setState((s) => ({ ...s, notes: s.notes.filter((n) => n.id !== id) })),
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
