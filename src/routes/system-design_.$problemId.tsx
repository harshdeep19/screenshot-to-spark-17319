import { createFileRoute } from "@tanstack/react-router";
import { DesignDetail } from "@/components/devready/practice";
import { pageHead } from "@/lib/dev-data";
export const Route = createFileRoute("/system-design_/$problemId")({
  head: () =>
    pageHead(
      "Architecture Case Study",
      "Explore requirements, architecture, data flow, caching and security decisions.",
    ),
  component: Page,
});
function Page() {
  const { problemId } = Route.useParams();
  return <DesignDetail problemId={problemId} />;
}
