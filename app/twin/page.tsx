import type { Metadata } from "next";
import ChatPanel from "@/components/twin/ChatPanel";
import { profile } from "@/lib/content";

export const metadata: Metadata = {
  title: "AI Twin",
  description: "Ask an AI version of me about myself.",
};

export default function TwinPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-6 py-16 text-center">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">AI Digital Twin</h1>
        <p className="mt-2 text-muted">
          This is an AI-generated version of {profile.name}, not a real person. It only knows
          what&apos;s on this site — for anything else, use the{" "}
          <a href="/contact" className="underline">
            contact page
          </a>
          .
        </p>
      </div>
      <ChatPanel />
    </div>
  );
}
