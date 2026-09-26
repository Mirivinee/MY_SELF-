import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Twin",
  description: "Ask an AI version of me about myself.",
};

export default function TwinPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 px-6 py-24 text-center">
      <h1 className="text-3xl font-semibold tracking-tight">AI Digital Twin</h1>
      <p className="text-muted">
        This is an AI-generated version of me, not a real person. It&apos;s coming in a later phase —
        for now, head to the{" "}
        <a href="/contact" className="underline">
          contact page
        </a>{" "}
        to reach the real one.
      </p>
    </div>
  );
}
