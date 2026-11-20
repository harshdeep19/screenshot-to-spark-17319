import { createFileRoute } from "@tanstack/react-router";
import { Lesson } from "@/components/devready/learning";
import { paths, slugify, pageHead } from "@/lib/dev-data";
export const Route = createFileRoute("/learning-paths_/$pathId_/$topicId")({
  head: ({ params }) => {
    const path = paths.find((p) => p.id === params.pathId),
      title = path?.modules.find((m) => slugify(m) === params.topicId);
    return pageHead(
      title ?? "Engineering Lesson",
      `Study ${title ?? "frontend engineering"} with technical examples, practical exercises and revision notes.`,
    );
  },
  component: Page,
});
function Page() {
  const { pathId, topicId } = Route.useParams();
  return <Lesson pathId={pathId} topicId={topicId} />;
}
