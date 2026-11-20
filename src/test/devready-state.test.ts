import { describe, it, expect } from "vitest";
import { toggleItem, pathProgress, paths } from "@/lib/dev-data";
describe("Local learning rules", () => {
  it("bookmarks toggle without duplicates", () => {
    expect(toggleItem(["question/closures"], "question/closures")).toEqual([]);
    expect(toggleItem([], "question/closures")).toEqual(["question/closures"]);
  });
  it("completed modules increase only the relevant path progress", () => {
    const path = paths.find((p) => p.id === "javascript");
    if (!path) throw new Error("JavaScript path missing");
    expect(pathProgress(path, ["javascript/scope-and-closures"])).toBe(6);
    expect(pathProgress(path, ["react/hooks"])).toBe(0);
  });
  it("sample study paths include all seven subject areas", () => {
    expect(paths.map((p) => p.id)).toEqual([
      "javascript",
      "react",
      "typescript",
      "nextjs",
      "html-css",
      "engineering",
      "system-design",
    ]);
  });
});
