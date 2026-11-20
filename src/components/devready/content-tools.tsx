import { useState, useEffect } from "react";
import { Bookmark, FileText, Flag, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDev } from "@/lib/dev-store";
export function ContentTools({ id, title }: { id: string; title: string }) {
  const store = useDev(),
    existing = store.notes.find((n) => n.linked === id),
    [body, setBody] = useState(existing?.body ?? ""),
    [saved, setSaved] = useState(false);
  useEffect(() => {
    setBody(existing?.body ?? "");
  }, [store.loaded, existing?.id]);
  return (
    <section className="content-tools">
      <div className="flex flex-wrap gap-2 mb-5">
        <Button variant="outline" size="sm" onClick={() => store.toggleBookmark(id)}>
          <Bookmark
            size={14}
            className={store.bookmarks.includes(id) ? "fill-primary text-primary" : ""}
          />
          {store.bookmarks.includes(id) ? "Saved" : "Save for revision"}
        </Button>
        <Button variant="outline" size="sm" onClick={() => store.toggleDifficult(id)}>
          <Flag size={14} />
          {store.difficult.includes(id) ? "Marked difficult" : "Mark difficult"}
        </Button>
      </div>
      <label className="text-xs block font-medium">
        <FileText size={14} className="inline mr-2" />
        Your notes
        <textarea
          className="field min-h-28 mt-3"
          aria-label="Notes for this topic"
          value={body}
          onChange={(e) => {
            setBody(e.target.value);
            setSaved(false);
          }}
          placeholder="Capture your mental model, mistakes, or a production example…"
        />
      </label>
      <div className="flex flex-wrap gap-4 mt-3 items-end">
        <Button
          size="sm"
          disabled={!body.trim()}
          onClick={() => {
            store.saveNote({
              id: existing?.id ?? crypto.randomUUID(),
              title,
              body: body.trim(),
              linked: id,
            });
            setSaved(true);
          }}
        >
          <Check size={14} />
          {saved ? "Note saved" : "Save note"}
        </Button>
        <label className="text-xs text-muted-foreground">
          Revision date
          <input
            type="date"
            className="field mt-2"
            aria-label="Revision date"
            value={store.reminders[id] ?? ""}
            onChange={(e) => store.remind(id, e.target.value)}
          />
        </label>
      </div>
    </section>
  );
}
