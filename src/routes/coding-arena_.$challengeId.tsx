import { createFileRoute } from "@tanstack/react-router";
import { ChallengeDetail } from "@/components/devready/practice";
import { challenges, pageHead } from "@/lib/dev-data";
export const Route = createFileRoute("/coding-arena_/$challengeId")({
  head: ({ params }) => {
    const challenge = challenges.find((c) => c.id === params.challengeId);
    return pageHead(
      challenge?.title ?? "Coding Challenge",
      challenge?.description ??
        "Practice frontend coding with sample tests and reference solutions.",
    );
  },
  component: Page,
});
function Page() {
  const { challengeId } = Route.useParams();
  return <ChallengeDetail challengeId={challengeId} />;
}
