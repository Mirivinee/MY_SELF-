import { profile } from "@/lib/content";

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">About</h1>
        <p className="mt-1 text-sm text-muted">{profile.location}</p>
        <p className="mt-4 max-w-2xl text-muted">{profile.longBio}</p>
      </div>

      <div>
        <h2 className="text-xl font-medium">Skills</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {profile.skills.length === 0 && (
            <li className="text-sm text-muted">TODO</li>
          )}
          {profile.skills.map((skill) => (
            <li
              key={skill}
              className="rounded-full border border-border px-3 py-1 text-sm"
            >
              {skill}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-xl font-medium">Experience</h2>
        <ol className="mt-3 flex flex-col gap-4 border-l border-border pl-4">
          {profile.experience.length === 0 && (
            <li className="text-sm text-muted">None yet</li>
          )}
          {profile.experience.map((item, i) => (
            <li key={i}>
              <p className="font-medium">
                {item.title} · {item.org}
              </p>
              <p className="text-sm text-muted">
                {item.start} – {item.end}
              </p>
              <p className="mt-1 text-sm text-muted">{item.description}</p>
            </li>
          ))}
        </ol>
      </div>

      <div>
        <h2 className="text-xl font-medium">Education</h2>
        <ol className="mt-3 flex flex-col gap-4 border-l border-border pl-4">
          {profile.education.map((item, i) => (
            <li key={i}>
              <p className="font-medium">
                {item.degree} · {item.school}
              </p>
              <p className="text-sm text-muted">
                {item.start} – {item.end}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
