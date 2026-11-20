import { createFileRoute } from "@tanstack/react-router";
import { LearningPaths } from "@/components/devready/learning";
import { pageHead } from "@/lib/dev-data";
export const Route = createFileRoute("/learning-paths")({
  head: () =>
    pageHead(
      "Learning Paths",
      "Structured paths for JavaScript, React, TypeScript and frontend architecture.",
    ),
  component: Page,
});
function Page() {
  return <LearningPaths />;
}
