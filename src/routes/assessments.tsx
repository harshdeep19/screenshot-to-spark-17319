import { createFileRoute } from "@tanstack/react-router";
import { Assessments } from "@/components/devready/assessments";
import { pageHead } from "@/lib/dev-data";
export const Route = createFileRoute("/assessments")({
  head: () =>
    pageHead(
      "Skill Assessments",
      "Assess JavaScript, React, TypeScript and frontend system design with scored checks and focused recommendations.",
    ),
  component: Assessments,
});
