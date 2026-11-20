import { createFileRoute } from "@tanstack/react-router";
import { PathDetail } from "@/components/devready/learning";
import { pageHead } from "@/lib/dev-data";
export const Route = createFileRoute("/learning-paths_/$pathId")({
  head: () =>
    pageHead(
      "Learning Journey",
      "Explore the modules and practical concepts in your frontend learning journey.",
    ),
  component: Page,
});
function Page() {
  const { pathId } = Route.useParams();
  return <PathDetail pathId={pathId} />;
}
