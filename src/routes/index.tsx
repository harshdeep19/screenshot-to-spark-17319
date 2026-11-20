import { createFileRoute } from "@tanstack/react-router";
import { Overview } from "@/components/devready/overview";
import { pageHead } from "@/lib/dev-data";
export const Route = createFileRoute("/")({
  head: () =>
    pageHead(
      "Overview",
      "Your frontend engineering learning dashboard: progress, daily study, and interview readiness.",
    ),
  component: Page,
});
function Page() {
  return <Overview />;
}
