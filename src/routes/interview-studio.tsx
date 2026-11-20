import { createFileRoute } from "@tanstack/react-router";
import { InterviewStudio } from "@/components/devready/workspace";
import { pageHead } from "@/lib/dev-data";
export const Route = createFileRoute("/interview-studio")({
  head: () =>
    pageHead(
      "Interview Studio",
      "Practice your interview explanations with timers, checklists and self-evaluation.",
    ),
  component: Page,
});
function Page() {
  return <InterviewStudio />;
}
