import { createFileRoute } from "@tanstack/react-router";
import { CodingArena } from "@/components/devready/practice";
import { pageHead } from "@/lib/dev-data";
export const Route = createFileRoute("/coding-arena")({
  head: () =>
    pageHead(
      "Coding Arena",
      "Practice JavaScript, DSA patterns and React machine coding with sample solutions.",
    ),
  component: Page,
});
function Page() {
  return <CodingArena />;
}
