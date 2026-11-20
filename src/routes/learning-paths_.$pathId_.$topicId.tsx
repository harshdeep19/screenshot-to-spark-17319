import { createFileRoute } from "@tanstack/react-router";
import { Lesson } from "@/components/devready/learning";
import { pageHead } from "@/lib/dev-data";
export const Route = createFileRoute("/learning-paths_/$pathId_/$topicId")({
  head: () =>
    pageHead(
      "Engineering Lesson",
      "Learn technical concepts through examples, trade-offs and interactive knowledge checks.",
    ),
  component: Page,
});
function Page() {
  const { pathId, topicId } = Route.useParams();
  return <Lesson pathId={pathId} topicId={topicId} />;
}
