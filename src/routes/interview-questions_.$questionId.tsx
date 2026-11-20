import { createFileRoute } from "@tanstack/react-router";
import { QuestionDetail } from "@/components/devready/practice";
import { questions, pageHead } from "@/lib/dev-data";
export const Route = createFileRoute("/interview-questions_/$questionId")({
  head: ({ params }) => {
    const q = questions.find((q) => q.id === params.questionId);
    return pageHead(
      q?.title ?? "Interview Deep Dive",
      q?.answer ?? "Practice detailed frontend interview explanations.",
    );
  },
  component: Page,
});
function Page() {
  const { questionId } = Route.useParams();
  return <QuestionDetail questionId={questionId} />;
}
