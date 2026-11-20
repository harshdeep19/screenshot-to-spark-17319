import { createFileRoute } from "@tanstack/react-router";
import { Workspace } from "@/components/devready/workspace";
import { pageHead } from "@/lib/dev-data";
export const Route = createFileRoute("/workspace")({
  head: () =>
    pageHead(
      "My Workspace",
      "Your saved lessons, questions, notes, learning history and preparation goals.",
    ),
  component: Page,
});
function Page() {
  return <Workspace />;
}
