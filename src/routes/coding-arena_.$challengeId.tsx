import { createFileRoute } from "@tanstack/react-router";
import { ChallengeDetail } from "@/components/devready/practice";
import { pageHead } from "@/lib/dev-data";
export const Route = createFileRoute("/coding-arena_/$challengeId")({
  head: () =>
    pageHead(
      "Coding Challenge",
      "Work through a frontend coding problem and compare with a reference solution.",
    ),
  component: Page,
});
function Page() {
  const { challengeId } = Route.useParams();
  return <ChallengeDetail challengeId={challengeId} />;
}
