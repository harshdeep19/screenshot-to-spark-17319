import { createFileRoute } from "@tanstack/react-router";
import { QuestionsHub } from "@/components/devready/practice";
import { pageHead } from "@/lib/dev-data";
export const Route = createFileRoute("/interview-questions")({
  head: () =>
    pageHead(
      "Interview Questions",
      "Explore curated frontend interview questions with detailed engineering explanations.",
    ),
  component: Page,
});
function Page() {
  return <QuestionsHub />;
}
