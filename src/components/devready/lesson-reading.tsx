import { useEffect, useState, type RefObject } from "react";
import { List, ArrowDown } from "lucide-react";
import { Progress } from "./common";

type Section = { id: string; title: string };

/** Reading position is ephemeral, never evidence of completed learning. */
export function LessonReading({
  article,
  lessonId,
}: {
  article: RefObject<HTMLElement | null>;
  lessonId: string;
}) {
  const [sections, setSections] = useState<Section[]>([]);
  const [current, setCurrent] = useState(-1);
  useEffect(() => {
    const headings = Array.from(article.current?.querySelectorAll("h2") ?? []);
    headings.forEach((heading, i) => {
      heading.id = `lesson-section-${i + 1}`;
    });
    setSections(headings.map((heading) => ({ id: heading.id, title: heading.textContent ?? "" })));
    const update = () => {
      let position = -1;
      headings.forEach((heading, i) => {
        if (heading.getBoundingClientRect().top <= 220) position = i;
      });
      setCurrent(position);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [article, lessonId]);

  if (!sections.length) return null;
  return (
    <details className="lesson-reading" open>
      <summary>
        <List size={16} />
        <span>In this lesson</span>
        <ArrowDown size={14} />
      </summary>
      <div className="reading-position" aria-live="polite">
        <span>
          {current + 1} of {sections.length} sections reached
        </span>
        <Progress value={Math.round(((current + 1) / sections.length) * 100)} tone="cyan" />
      </div>
      <nav aria-label="Lesson sections">
        {sections.map((section, i) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            aria-current={i === current ? "location" : undefined}
          >
            <span className="reading-number">{String(i + 1).padStart(2, "0")}</span>
            <span>{section.title}</span>
          </a>
        ))}
      </nav>
    </details>
  );
}
