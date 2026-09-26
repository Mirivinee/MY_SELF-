import { profile } from "@/lib/content";
import Bio from "@/components/about/Bio";
import SkillsGrouped from "@/components/about/SkillsGrouped";
import EducationTimeline from "@/components/about/EducationTimeline";

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">About</h1>
        <p className="mt-1 text-sm text-muted">{profile.location}</p>
        <div className="mt-4">
          <Bio profile={profile} />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-medium">Skills</h2>
        <SkillsGrouped skills={profile.skills} />
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
        <EducationTimeline items={profile.education} />
      </div>
    </div>
  );
}
