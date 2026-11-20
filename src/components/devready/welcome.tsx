import { Link } from "@tanstack/react-router";
import { ArrowRight, Code2, Check, BookOpen, Network, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RelatedPaths, EngineeringArt, ArchitectureDiagram, CodeBlock } from "./common";
export function Welcome() {
  return (
    <div className="marketing">
      <header className="flex items-center justify-between">
        <Link to="/" className="brand !p-0">
          <span className="brand-mark">
            <Code2 size={21} />
          </span>
          <span>
            DevReady<span className="brand-dot">.</span>
          </span>
        </Link>
        <Button asChild variant="outline">
          <Link to="/">
            Open workspace
            <ArrowRight />
          </Link>
        </Button>
      </header>
      <section className="marketing-hero">
        <span className="badge violet">LEARN DEEP. BUILD SMART. GET INTERVIEW READY.</span>
        <h1 className="mt-6">DevReady</h1>
        <h2 className="text-3xl max-w-3xl mt-5 leading-snug font-semibold">
          Your frontend career deserves more than memorizing interview questions.
        </h2>
        <p>
          Master JavaScript, React, frontend architecture and real-world engineering. Build the
          knowledge and confidence to crack your next frontend interview.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link to="/">
              Start learning
              <ArrowRight />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/learning-paths">Explore learning paths</Link>
          </Button>
        </div>
      </section>
      <section className="preview-band">
        <div className="flex items-center justify-between">
          <div>
            <div className="eyebrow">YOUR LEARNING WORKSPACE</div>
            <h2 className="text-2xl font-semibold mt-4">
              Don’t just learn what to answer.
              <br />
              Learn how to think like an engineer.
            </h2>
            <p className="text-sm text-muted-foreground mt-4">
              Connected concepts. Real implementation. Intentional progress.
            </p>
            <Button asChild variant="link" className="!px-0 mt-4">
              <Link to="/">
                Explore the live dashboard
                <ArrowRight />
              </Link>
            </Button>
          </div>
          <EngineeringArt />
        </div>
      </section>
      <section className="py-12">
        <div className="eyebrow mb-6">Built for developers, from first role to tech lead</div>
        <div className="path-grid">
          {[
            {
              icon: BookOpen,
              title: "Depth, not a question dump",
              body: "Understand why a concept exists, how it works, and where it belongs in production.",
            },
            {
              icon: Code2,
              title: "Learn it. Then build it.",
              body: "Bridge explanations and implementation with focused coding and machine-coding practice.",
            },
            {
              icon: Network,
              title: "Think in engineering systems",
              body: "Explore architectural boundaries, caching, rendering strategies and meaningful trade-offs.",
            },
          ].map((item) => (
            <div key={item.title}>
              <item.icon className="text-cyan mb-4" />
              <h3 className="font-semibold mb-3">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-7">{item.body}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="py-9 border-t border-border">
        <h2 className="text-2xl font-semibold mb-7">Your next chapter has a path.</h2>
        <RelatedPaths />
      </section>
      <section className="py-10 border-t border-border">
        <h2 className="text-2xl font-semibold mb-5">From concept to confident explanation.</h2>
        <div className="flex flex-wrap gap-7 text-sm text-muted-foreground">
          {[
            "Understand the mechanics",
            "Build a working example",
            "Explain the trade-offs",
            "Reflect and repeat",
          ].map((item, i) => (
            <div key={item}>
              <span className="text-primary font-mono mr-3">0{i + 1}</span>
              {item}
            </div>
          ))}
        </div>
      </section>
      <section className="py-9 border-t border-border">
        <h2 className="text-2xl font-semibold">Practice the code behind the concept.</h2>
        <CodeBlock
          code={
            "function debounce(fn, delay) {\n  let timer;\n  return function (...args) {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn.apply(this, args), delay);\n  };\n}"
          }
        />
        <Button variant="outline" asChild>
          <Link to="/coding-arena">
            Explore coding practice
            <ArrowRight />
          </Link>
        </Button>
      </section>
      <section className="py-9 border-t border-border">
        <h2 className="text-2xl font-semibold">Go beyond the component.</h2>
        <ArchitectureDiagram />
        <Button variant="outline" asChild>
          <Link to="/system-design">
            Explore system design
            <ArrowRight />
          </Link>
        </Button>
      </section>
      <section className="py-9 border-t border-border">
        <h2 className="text-2xl font-semibold mb-6">A direction for every experience level.</h2>
        <div className="flex flex-wrap gap-3">
          {["Fresher", "1–3 years", "3–5 years", "5–8 years", "8+ years"].map((item) => (
            <span className="badge" key={item}>
              {item}
            </span>
          ))}
        </div>
        <p className="text-sm text-muted-foreground leading-7 mt-5">
          Build a foundation for your first role, deepen your production skills, or prepare to lead
          an engineering team.
        </p>
        <Button asChild variant="link" className="!px-0">
          <Link to="/career-roadmap">
            Find your roadmap
            <ArrowRight />
          </Link>
        </Button>
      </section>
      <section className="py-9 border-t border-border">
        <h2 className="text-2xl font-semibold mb-7">Room to grow.</h2>
        <div className="path-grid">
          {["Free", "Pro", "Premium"].map((item, i) => (
            <div key={item} className="panel p-6">
              <span className="badge mb-4">{i === 0 ? "Prototype access" : "Coming later"}</span>
              <h3 className="text-xl font-semibold">{item}</h3>
              <p className="text-sm text-muted-foreground leading-7 mt-4">
                {
                  [
                    "Explore the foundations and build your learning habit.",
                    "Deeper challenges and extended preparation collections.",
                    "Future guided preparation and personalized feedback.",
                  ][i]
                }
              </p>
              <p className="text-xs text-muted-foreground mt-6">
                {i === 0
                  ? "All sample content is available now."
                  : "Pricing has not been announced."}
              </p>
              {i === 0 && (
                <Button asChild className="mt-5">
                  <Link to="/">
                    Start learning
                    <ArrowRight />
                  </Link>
                </Button>
              )}
            </div>
          ))}
        </div>
      </section>
      <section className="py-9 border-t border-border">
        <h2 className="text-2xl font-semibold mb-6">A few good questions.</h2>
        {[
          {
            q: "Who is DevReady for?",
            a: "Frontend developers from their first interview through senior engineering and tech lead preparation.",
          },
          {
            q: "Are these verified company interview questions?",
            a: "No. These are curated practice collections, not claims about verified interviews or company endorsements.",
          },
          {
            q: "Does the coding arena execute my code?",
            a: "This first version offers local editing, sample-output previews and reference solutions. It does not execute arbitrary code.",
          },
          {
            q: "Where is my progress saved?",
            a: "In this browser only. Accounts, secure cloud sync, payments and AI evaluation are future features.",
          },
        ].map((item) => (
          <details key={item.q} className="border-b border-border py-5">
            <summary className="font-medium cursor-pointer">{item.q}</summary>
            <p className="text-sm text-muted-foreground leading-7 mt-4">{item.a}</p>
          </details>
        ))}
      </section>
      <footer className="page-footer">
        <span>DevReady · Learn Deep. Build Smart. Get Interview Ready.</span>
        <Link to="/">Open your workspace →</Link>
      </footer>
    </div>
  );
}
