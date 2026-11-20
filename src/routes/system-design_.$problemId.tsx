import { createFileRoute } from "@tanstack/react-router";
import { DesignDetail } from "@/components/devready/practice";
import { designProblems, slugify, pageHead } from "@/lib/dev-data";
export const Route = createFileRoute("/system-design_/$problemId")({
  head: ({ params }) => {
    const title = designProblems.find((p) => slugify(p) === params.problemId);
    return pageHead(
      title ?? "Architecture Case Study",
      `Explore requirements, data flow, security and trade-offs for ${title?.toLowerCase() ?? "frontend systems"}.`,
    );
  },
  component: Page,
});
function Page() {
  const { problemId } = Route.useParams();
  return <DesignDetail problemId={problemId} />;
}
