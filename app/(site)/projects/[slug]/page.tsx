import { notFound } from "next/navigation";
import { projects } from "@/lib/content";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold tracking-tight">{project.title}</h1>
      <p className="text-muted">{project.description}</p>
      <a
        href={project.githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm underline"
      >
        View on GitHub
      </a>
    </div>
  );
}
