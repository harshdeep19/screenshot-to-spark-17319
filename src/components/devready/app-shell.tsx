import { useState, useEffect, type ReactNode } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  BookOpen,
  MessagesSquare,
  Code2,
  Network,
  Mic,
  Route,
  Folder,
  Search,
  Bell,
  ChevronsUpDown,
  ArrowUpRight,
  Sparkles,
  Settings,
  CircleHelp,
  Sun,
  Moon,
  Menu,
  PanelLeftClose,
  X,
  ChevronRight,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { PreparationProfile } from "./preparation-profile";
import { useDev } from "@/lib/dev-store";
import { paths, questions, challenges, designProblems, companies, slugify } from "@/lib/dev-data";
const navigation = [
  { to: "/" as const, label: "Overview", icon: LayoutDashboard },
  { to: "/learning-paths" as const, label: "Learning Paths", icon: BookOpen },
  { to: "/interview-questions" as const, label: "Interview Questions", icon: MessagesSquare },
  { to: "/coding-arena" as const, label: "Coding Arena", icon: Code2 },
  { to: "/system-design" as const, label: "Frontend System Design", icon: Network },
  { to: "/interview-studio" as const, label: "Interview Studio", icon: Mic },
  { to: "/career-roadmap" as const, label: "Career Roadmap", icon: Route },
  { to: "/assessments" as const, label: "Skill Assessments", icon: Check },
  { to: "/workspace" as const, label: "My Workspace", icon: Folder },
];
export function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const store = useDev();
  const [collapsed, setCollapsed] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [search, setSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState("");
  const [notificationsRead, setNotificationsRead] = useState(false);
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "k") {
        event.preventDefault();
        setSearch((value) => !value);
      }
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);
  useEffect(() => {
    setMobile(false);
    setSearch(false);
  }, [location.pathname]);
  const searchItems: {
    label: string;
    category: string;
    kind: string;
    id: string;
    topic?: string;
  }[] = [
    ...paths.map((p) => ({ label: p.title, category: "Learning path", kind: "path", id: p.id })),
    ...paths.flatMap((p) =>
      p.modules.map((module) => ({
        label: module,
        category: p.title,
        kind: "lesson",
        id: p.id,
        topic: slugify(module),
      })),
    ),
    ...questions.map((q) => ({ label: q.title, category: q.category, kind: "question", id: q.id })),
    ...challenges.map((c) => ({
      label: c.title,
      category: "Coding challenge",
      kind: "challenge",
      id: c.id,
    })),
    ...designProblems.map((p) => ({
      label: p,
      category: "System design",
      kind: "design",
      id: slugify(p),
    })),
    ...companies.map((p) => ({
      label: `${p} preparation`,
      category: "Interview Studio",
      kind: "company",
      id: p,
    })),
  ]
    .filter((item) => item.label.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 12);
  if (location.pathname === "/welcome") return <>{children}</>;
  return (
    <div className={`app-shell ${collapsed ? "collapsed" : ""} ${mobile ? "mobile-open" : ""}`}>
      <aside className="sidebar">
        <Link to="/" className="brand">
          <span className="brand-mark">
            <Code2 size={21} />
          </span>
          <span className="brand-name">
            DevReady<span className="brand-dot">.</span>
          </span>
        </Link>
        <div className="nav-label">Your learning space</div>
        <nav aria-label="Main navigation">
          {navigation.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              title={item.label}
              className={`nav-item ${location.pathname === item.to || (item.to !== "/" && location.pathname.startsWith(item.to)) ? "active" : ""}`}
            >
              <item.icon />
              <span>{item.label}</span>
              {item.to === "/coding-arena" && <span className="badge violet">NEW</span>}
            </Link>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="upgrade-box">
            <div className="flex gap-2 items-center text-xs font-semibold">
              <Sparkles size={15} />
              Go deeper with Pro
            </div>
            <p>
              More challenges. Deeper learning.
              <br />
              Your next level starts here.
            </p>
            <Button
              variant="secondary"
              size="sm"
              className="w-full justify-between"
              onClick={() => setModal("plans")}
            >
              Explore Pro
              <ArrowUpRight size={12} />
            </Button>
          </div>
          <Button
            variant="ghost"
            className="nav-item w-[calc(100%-26px)] justify-start"
            onClick={() => setModal("settings")}
          >
            <Settings />
            <span>Settings</span>
          </Button>
          <Button
            variant="ghost"
            className="nav-item w-[calc(100%-26px)] justify-start"
            onClick={() => setModal("help")}
          >
            <CircleHelp />
            <span>Help & feedback</span>
          </Button>
          <div className="flex items-center justify-between px-6 text-muted-foreground">
            <Button
              variant="ghost"
              size="icon"
              title="Collapse sidebar"
              aria-label="Collapse sidebar"
              onClick={() => {
                setCollapsed((value) => !value);
                setMobile(false);
              }}
            >
              <PanelLeftClose />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              title="Switch color theme"
              aria-label="Switch color theme"
              onClick={() => store.setTheme(store.theme === "dark" ? "light" : "dark")}
            >
              {store.theme === "dark" ? <Sun /> : <Moon />}
            </Button>
          </div>
          <Button
            variant="ghost"
            className="sidebar-profile h-auto text-left px-0 w-[calc(100%-40px)] justify-start"
            onClick={() => setModal("profile")}
          >
            <span className="avatar">
              {store.profile.name
                ? store.profile.name
                    .split(" ")
                    .map((s) => s[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()
                : "DR"}
            </span>
            <span className="flex-1">
              <strong className="block text-xs">{store.profile.name || "Your workspace"}</strong>
              <span className="block text-[10px] text-muted-foreground mt-1">
                Personal workspace
              </span>
            </span>
            <ChevronsUpDown size={13} />
          </Button>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <Button
            variant="ghost"
            size="icon"
            className="mobile-menu"
            aria-label="Open navigation"
            onClick={() => setMobile((value) => !value)}
          >
            <Menu />
          </Button>
          <Button
            variant="ghost"
            className="search-trigger"
            onClick={() => {
              setQuery("");
              setSearch(true);
            }}
          >
            <Search size={15} />
            <span>Search anything...</span>
            <kbd>⌘ K</kbd>
          </Button>
          <div className="topbar-actions">
            <select
              className="experience"
              aria-label="Experience level"
              value={store.experience}
              onChange={(e) => store.setExperience(e.target.value)}
            >
              {["Fresher", "1–3 years", "3–5 years", "5–8 years", "8+ years"].map((level) => (
                <option key={level}>{level}</option>
              ))}
            </select>
            <div className="divider" />
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              title="Notifications"
              aria-label="Notifications"
              onClick={() => {
                setModal("notifications");
                setNotificationsRead(true);
              }}
            >
              <Bell />
              {!notificationsRead && <span className="notification-dot" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="profile-button"
              title="Your profile"
              aria-label="Your profile"
              onClick={() => setModal("profile")}
            >
              <span className="avatar">
                {store.profile.name
                  ? store.profile.name
                      .split(" ")
                      .map((s) => s[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()
                  : "DR"}
              </span>
            </Button>
          </div>
        </header>
        <main className="page">
          {location.pathname !== "/" && (
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground mb-6">
              <Link to="/">Workspace</Link>
              <ChevronRight size={11} />
              <span>
                {navigation.find((n) => n.to !== "/" && location.pathname.startsWith(n.to))
                  ?.label ?? "Learning"}
              </span>
            </div>
          )}
          {children}
          <footer className="page-footer">
            <span>Built for the engineer you’re becoming.</span>
            <span>DevReady · Learn Deep. Build Smart. Get Interview Ready.</span>
          </footer>
        </main>
      </div>
      <Dialog open={search} onOpenChange={setSearch}>
        <DialogContent className="p-0 gap-0 max-w-xl">
          <DialogTitle className="sr-only">Search DevReady</DialogTitle>
          <DialogDescription className="sr-only">
            Find paths, lessons, interview questions and coding challenges.
          </DialogDescription>
          <div className="search-input">
            <Search size={19} />
            <input
              aria-label="Search DevReady"
              autoFocus
              placeholder="What do you want to learn?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="max-h-[55vh] overflow-y-auto">
            {!query && <div className="eyebrow px-5 pt-5 pb-2">Explore your learning</div>}
            {searchItems.map((item, index) => {
              const content = (
                <>
                  <div>
                    <div className="text-sm">{item.label}</div>
                    <div className="text-[10px] text-muted-foreground mt-1">{item.category}</div>
                  </div>
                  <ArrowUpRight size={14} />
                </>
              );
              if (item.kind === "path")
                return (
                  <Link
                    key={index}
                    className="search-result"
                    to="/learning-paths/$pathId"
                    params={{ pathId: item.id }}
                  >
                    {content}
                  </Link>
                );
              if (item.kind === "lesson")
                return (
                  <Link
                    key={index}
                    className="search-result"
                    to="/learning-paths/$pathId/$topicId"
                    params={{ pathId: item.id, topicId: item.topic ?? "" }}
                  >
                    {content}
                  </Link>
                );
              if (item.kind === "question")
                return (
                  <Link
                    key={index}
                    className="search-result"
                    to="/interview-questions/$questionId"
                    params={{ questionId: item.id }}
                  >
                    {content}
                  </Link>
                );
              if (item.kind === "challenge")
                return (
                  <Link
                    key={index}
                    className="search-result"
                    to="/coding-arena/$challengeId"
                    params={{ challengeId: item.id }}
                  >
                    {content}
                  </Link>
                );
              if (item.kind === "design")
                return (
                  <Link
                    key={index}
                    className="search-result"
                    to="/system-design/$problemId"
                    params={{ problemId: item.id }}
                  >
                    {content}
                  </Link>
                );
              return (
                <Link key={index} className="search-result" to="/interview-studio">
                  {content}
                </Link>
              );
            })}
            {searchItems.length === 0 && (
              <div className="empty">
                No results for “{query}”. Try React, closures, or debounce.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
        open={!!modal}
        onOpenChange={(open) => {
          if (!open) setModal("");
        }}
      >
        <DialogContent>
          <DialogTitle>
            {
              (
                {
                  settings: "Your learning preferences",
                  help: "Here to help you grow",
                  profile: "Your workspace",
                  plans: "A little more room to grow",
                  notifications: "Your updates",
                } as Record<string, string>
              )[modal]
            }
          </DialogTitle>
          <DialogDescription>
            {modal === "plans"
              ? "Plans are a preview. Payments and subscriptions are not available yet."
              : modal === "profile"
                ? "This is a local prototype workspace, not a signed-in account."
                : modal === "help"
                  ? "Have feedback? Your thoughts help shape DevReady."
                  : "Make space for consistent, intentional learning."}
          </DialogDescription>
          {modal === "settings" || modal === "profile" ? (
            <div className="space-y-5 py-3">
              <PreparationProfile />
              <div className="flex justify-between items-center text-xs">
                <span>Color theme</span>
                <Button
                  variant="outline"
                  onClick={() => store.setTheme(store.theme === "dark" ? "light" : "dark")}
                >
                  {store.theme === "dark" ? <Sun /> : <Moon />}
                  {store.theme === "dark" ? "Light" : "Dark"}
                </Button>
              </div>
              <Button onClick={() => setModal("")}>
                Done
                <Check />
              </Button>
            </div>
          ) : modal === "plans" ? (
            <div className="space-y-3 py-3">
              {["Free", "Pro", "Premium"].map((plan, i) => (
                <div key={plan} className="panel p-4 flex items-center justify-between">
                  <div>
                    <strong>{plan}</strong>
                    <p className="text-xs text-muted-foreground mt-1">
                      {
                        [
                          "Explore the foundations",
                          "Deepen your engineering practice",
                          "Prepare with personal guidance",
                        ][i]
                      }
                    </p>
                  </div>
                  <span className="badge">{i === 0 ? "Current preview" : "Coming later"}</span>
                </div>
              ))}
            </div>
          ) : modal === "notifications" ? (
            <div className="space-y-4 py-4">
              <div className="flex gap-3">
                <BookOpen className="text-primary" size={18} />
                <div>
                  <strong className="text-sm">Your next chapter is ready</strong>
                  <p className="text-xs text-muted-foreground mt-1">
                    Continue JavaScript Mastery: the event loop.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Route className="text-cyan" size={18} />
                <div>
                  <strong className="text-sm">Set an intentional learning goal</strong>
                  <p className="text-xs text-muted-foreground mt-1">
                    A little progress every day makes a difference.
                  </p>
                </div>
              </div>
              <span className="badge">Sample workspace updates</span>
            </div>
          ) : (
            <div className="space-y-3 py-3">
              <p className="text-sm text-muted-foreground leading-7">
                Progress, bookmarks and notes are saved in this browser. You can explore all
                learning content without an account. Cloud sync and AI evaluation are future
                features.
              </p>
              <Button asChild>
                <a href="mailto:feedback@devready.example">
                  Draft feedback email
                  <ArrowUpRight />
                </a>
              </Button>
              <p className="text-xs text-muted-foreground">
                The email address is a prototype placeholder.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
