import profile from "@/content/profile.json";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-6 py-8 text-sm text-muted sm:flex-row sm:justify-between">
        <p>
          © {year} {profile.name}
        </p>
        <div className="flex items-center gap-4">
          <a href={profile.links.github} className="hover:text-foreground">
            GitHub
          </a>
          <a href={profile.links.linkedin} className="hover:text-foreground">
            LinkedIn
          </a>
          <a href={`mailto:${profile.links.email}`} className="hover:text-foreground">
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
