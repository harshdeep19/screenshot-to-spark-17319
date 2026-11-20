import { render, screen, cleanup } from "@testing-library/react";
import { useContext } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { refreshContext, type RefreshContextCache } from "@/lib/devready/refresh-context";

afterEach(cleanup);

describe("Workspace context during preview updates", () => {
  it("a refreshed consumer still reads the mounted provider's workspace", () => {
    const cache: RefreshContextCache<{ name: string }> = {};
    const beforeUpdate = refreshContext(cache);
    const afterUpdate = refreshContext(cache);
    function Consumer() {
      const workspace = useContext(afterUpdate);
      if (!workspace) throw new Error("DevReady workspace is unavailable");
      return <span>{workspace.name}</span>;
    }
    render(<beforeUpdate.Provider value={{ name: "Saved learner" }}><Consumer /></beforeUpdate.Provider>);
    expect(afterUpdate).toBe(beforeUpdate);
    expect(screen.getByText("Saved learner")).toBeInTheDocument();
  });

  it("contexts without a preview cache do not share state between server requests", () => {
    expect(refreshContext()).not.toBe(refreshContext());
  });
});