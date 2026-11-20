import { createFileRoute } from "@tanstack/react-router";
import { SystemDesign } from "@/components/devready/practice";
import { pageHead } from "@/lib/dev-data";
export const Route = createFileRoute("/system-design")({
  head: () =>
    pageHead(
      "Frontend System Design",
      "Learn to design scalable frontend systems with explicit architectural trade-offs.",
    ),
  component: Page,
});
function Page() {
  return <SystemDesign />;
}
