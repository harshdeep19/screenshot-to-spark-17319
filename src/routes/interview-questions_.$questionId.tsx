import { createFileRoute } from "@tanstack/react-router";
import { QuestionDetail } from "@/components/devready/practice";
import { pageHead } from "@/lib/dev-data";
export const Route = createFileRoute("/interview-questions_/$questionId")({
  head: () =>
    pageHead(
      "Interview Deep Dive",
      "Understand a frontend interview question, its mechanics and follow-up discussion.",
    ),
  component: Page,
});
function Page() {
  const { questionId } = Route.useParams();
  return <QuestionDetail questionId={questionId} />;
}
