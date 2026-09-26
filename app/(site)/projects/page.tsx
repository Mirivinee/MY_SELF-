import type { Metadata } from "next";
import { projects } from "@/lib/content";
import ProjectsGrid from "@/components/projects/ProjectsGrid";

export const metadata: Metadata = {
  title: "Projects",
  description: "Things I've built, with links to the code.",
};

export default function ProjectsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Projects</h1>
        <p className="mt-2 text-muted">
          A selection of things I&apos;ve built. Click a card to open its repo on GitHub.
        </p>
      </div>
      <ProjectsGrid projects={projects} />
    </div>
  );
}
