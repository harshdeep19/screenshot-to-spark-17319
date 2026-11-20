import { createFileRoute } from "@tanstack/react-router";
import { PathDetail } from "@/components/devready/learning";
import { paths, pageHead } from "@/lib/dev-data";
export const Route = createFileRoute("/learning-paths_/$pathId")({
  head: ({ params }) => {
    const path = paths.find((p) => p.id === params.pathId);
    return pageHead(
      path?.title ?? "Learning Journey",
      path?.description ?? "Explore frontend learning modules.",
    );
  },
  component: Page,
});
function Page() {
  const { pathId } = Route.useParams();
  return <PathDetail pathId={pathId} />;
}
