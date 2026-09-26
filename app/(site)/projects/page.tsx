import projects from "@/content/projects.json";

export default function ProjectsPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-semibold tracking-tight">Projects</h1>
      <div className="grid gap-6 sm:grid-cols-2">
        {projects.map((project) => (
          <a
            key={project.slug}
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-border bg-surface p-6 transition-colors hover:border-accent"
          >
            <h2 className="font-medium">{project.title}</h2>
            <p className="mt-2 text-sm text-muted">{project.description}</p>
            <ul className="mt-4 flex flex-wrap gap-2 text-xs text-muted">
              {project.tech.map((t) => (
                <li key={t} className="rounded-full border border-border px-2 py-1">
                  {t}
                </li>
              ))}
            </ul>
          </a>
        ))}
      </div>
    </div>
  );
}
