import { createFileRoute } from "@tanstack/react-router";
import { Welcome } from "@/components/devready/welcome";
import { pageHead } from "@/lib/dev-data";
export const Route = createFileRoute("/welcome")({
  head: () =>
    pageHead(
      "Learn Deep. Build Smart.",
      "A premium frontend engineering and interview preparation learning platform.",
    ),
  component: Page,
});
function Page() {
  return <Welcome />;
}
