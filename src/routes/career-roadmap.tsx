import { createFileRoute } from "@tanstack/react-router";
import { CareerRoadmap } from "@/components/devready/workspace";
import { pageHead } from "@/lib/dev-data";
export const Route = createFileRoute("/career-roadmap")({
  head: () =>
    pageHead(
      "Career Roadmap",
      "Plan your next frontend role with weekly learning and coding milestones.",
    ),
  component: Page,
});
function Page() {
  return <CareerRoadmap />;
}
