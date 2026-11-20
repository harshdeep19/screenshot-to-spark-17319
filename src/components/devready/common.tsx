import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Check, Copy, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { paths, pathProgress, type LearningPath } from "@/lib/dev-data";
import { useDev } from "@/lib/dev-store";
export function Progress({ value, tone = "" }: { value: number; tone?: string }) {
  return (
    <div className={`progress-track ${tone}`}>
      <progress value={value} max={100} aria-label={`${value}% complete`} />
    </div>
  );
}
export function PageHeader({
  label,
  title,
  description,
  children,
}: {
  label?: string;
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="welcome-row">
      <div>
        {label && <div className="eyebrow mb-3">{label}</div>}
        <h1 className="page-title">{title}</h1>
        <p className="page-subtitle">{description}</p>
      </div>
      {children}
    </div>
  );
}
export function Difficulty({ value }: { value: string }) {
  return (
    <span
      className={`badge ${value === "Easy" || value === "Beginner" ? "green" : value === "Hard" || value === "Advanced" ? "violet" : "amber"}`}
    >
      {value}
    </span>
  );
}
export function PathCard({ path, compact = false }: { path: LearningPath; compact?: boolean }) {
  const { completed } = useDev();
  const progress = pathProgress(path, completed);
  return (
    <Link
      to="/learning-paths/$pathId"
      params={{ pathId: path.id }}
      className={`panel ${compact ? "learning-card" : "path-card"}`}
    >
      <div className={`tech-symbol ${path.tone}`}>{path.symbol}</div>
      {compact ? <h3>{path.title}</h3> : <h2>{path.title}</h2>}
      <p>
        {compact
          ? path.modules[path.id === "javascript" ? 10 : path.id === "react" ? 4 : 3]
          : path.description}
      </p>
      {!compact && (
        <>
          <div className="flex gap-2">
            <Difficulty value={path.level} />
            <span className="badge">{path.modules.length} modules</span>
          </div>
          <div className="path-meta">
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {path.hours} hours
            </span>
            <span>Self-paced</span>
          </div>
        </>
      )}
      <div className="progress-label flex justify-between text-xs text-muted-foreground mb-2">
        <span>{compact ? "Path progress" : "Your progress"}</span>
        <span>{progress}%</span>
      </div>
      <Progress value={progress} tone={path.tone === "react" ? "cyan" : ""} />
      <div className="continue-link flex items-center justify-between text-xs mt-5">
        <span>{progress ? "Continue learning" : "Explore path"}</span>
        <ArrowRight size={13} />
      </div>
    </Link>
  );
}
export function CodeBlock({ code, language = "JavaScript" }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="code-block">
      <div className="code-header">
        <span>{language}</span>
        <Button
          variant="ghost"
          size="icon"
          title="Copy code"
          aria-label="Copy code"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(code);
              setCopied(true);
              setTimeout(() => setCopied(false), 1800);
            } catch {
              setCopied(false);
            }
          }}
        >
          {copied ? <Check /> : <Copy />}
        </Button>
      </div>
      <pre>
        <code>
          {code
            .split(
              /(\/\/[^\n]*|"[^"\n]*"|'[^'\n]*'|\b(?:function|const|let|return|if|else|new|await|async|for|throw)\b)/g,
            )
            .map((part, i) => (
              <span
                key={i}
                className={
                  part.startsWith("//")
                    ? "code-comment"
                    : /^['"]/.test(part)
                      ? "code-string"
                      : /^(function|const|let|return|if|else|new|await|async|for|throw)$/.test(part)
                        ? "code-keyword"
                        : ""
                }
              >
                {part}
              </span>
            ))}
        </code>
      </pre>
    </div>
  );
}
export function EngineeringArt() {
  return (
    <svg
      className="feature-art"
      viewBox="0 0 280 175"
      role="img"
      aria-label="Connected frontend engineering modules"
    >
      <path
        className="line"
        d="M140 20v35M140 90v35M70 65h140M70 65v65h140V65M40 98h200"
        fill="none"
      />
      <g transform="translate(98 36)">
        <rect className="node" width="84" height="53" rx="8" />
        <text x="42" y="34" textAnchor="middle" fontSize="23">
          &lt;/&gt;
        </text>
      </g>
      <g transform="translate(36 113)">
        <rect className="node" width="64" height="40" rx="6" />
        <text x="32" y="26" textAnchor="middle" fontSize="14">
          JS
        </text>
      </g>
      <g transform="translate(116 119)">
        <rect className="node" width="52" height="40" rx="6" />
        <text x="26" y="27" textAnchor="middle" fontSize="24">
          ⚛
        </text>
      </g>
      <g transform="translate(185 113)">
        <rect className="node" width="64" height="40" rx="6" />
        <text x="32" y="26" textAnchor="middle" fontSize="14">
          TS
        </text>
      </g>
      <circle className="node" cx="69" cy="29" r="5" />
      <circle className="node" cx="224" cy="38" r="5" />
      <path className="line" d="M69 34v30m155-21v23M30 65h35M211 65h40" />
    </svg>
  );
}
export function ArchitectureDiagram() {
  return (
    <svg
      viewBox="0 0 720 330"
      className="architecture"
      role="img"
      aria-label="Dashboard architecture: client connects through an API gateway to services and cache"
    >
      <path d="M360 65v38M360 151v40M360 171H130v30m230-30h230v30M130 248v27h460v-27M360 248v27" />
      <rect className="special" x="260" y="15" width="200" height="50" rx="6" />
      <text x="360" y="45" textAnchor="middle">
        React application
      </text>
      <rect x="260" y="103" width="200" height="48" rx="6" />
      <text x="360" y="132" textAnchor="middle">
        API gateway / BFF
      </text>
      <rect x="40" y="201" width="180" height="47" rx="6" />
      <text x="130" y="230" textAnchor="middle">
        Identity service
      </text>
      <rect className="special" x="270" y="201" width="180" height="47" rx="6" />
      <text x="360" y="230" textAnchor="middle">
        Query cache
      </text>
      <rect x="500" y="201" width="180" height="47" rx="6" />
      <text x="590" y="230" textAnchor="middle">
        Analytics service
      </text>
      <text x="360" y="310" textAnchor="middle">
        Typed contracts · Scoped caching · Observable requests
      </text>
    </svg>
  );
}
export function SectionLink({
  title,
  to,
}: {
  title: string;
  to:
    | "/"
    | "/learning-paths"
    | "/interview-questions"
    | "/career-roadmap"
    | "/workspace"
    | "/coding-arena";
}) {
  return (
    <div className="section-heading">
      <h2>{title}</h2>
      <Link to={to}>
        View all
        <ArrowUpRight size={13} />
      </Link>
    </div>
  );
}
export function RelatedPaths() {
  return (
    <div className="path-grid">
      {paths.slice(0, 3).map((path) => (
        <PathCard key={path.id} path={path} />
      ))}
    </div>
  );
}
