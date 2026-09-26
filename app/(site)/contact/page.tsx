import { profile } from "@/lib/content";

export default function ContactPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold tracking-tight">Contact</h1>
      <ul className="flex flex-col gap-3 text-muted">
        <li>
          Email:{" "}
          <a href={`mailto:${profile.links.email}`} className="text-foreground underline">
            {profile.links.email}
          </a>
        </li>
        <li>
          GitHub:{" "}
          <a
            href={profile.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground underline"
          >
            {profile.links.github}
          </a>
        </li>
        <li>
          LinkedIn:{" "}
          <a
            href={profile.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground underline"
          >
            {profile.links.linkedin}
          </a>
        </li>
        <li>
          Resume:{" "}
          <a href={profile.links.resume} className="text-foreground underline">
            Download
          </a>
        </li>
      </ul>
    </div>
  );
}
