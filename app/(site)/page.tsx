import Link from "next/link";
import profile from "@/content/profile.json";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm font-medium text-accent">Hi, I&apos;m</p>
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
        {profile.name}
      </h1>
      <p className="max-w-xl text-lg text-muted">
        {profile.role} — {profile.shortBio}
      </p>
      <div className="flex flex-wrap gap-3 pt-2">
        <Link
          href="/projects"
          className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          View projects
        </Link>
        <Link
          href="/twin"
          className="rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-surface"
        >
          Talk to my AI twin
        </Link>
      </div>
    </div>
  );
}
