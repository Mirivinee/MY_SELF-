import PlaceholderBadge from "@/components/ui/PlaceholderBadge";
import type { Profile } from "@/lib/content";

export default function Bio({ profile }: { profile: Profile }) {
  const interestsPlaceholder = profile.interests === "TODO";

  return (
    <div className="flex flex-col gap-4">
      <p className="max-w-2xl text-muted">{profile.longBio}</p>
      {interestsPlaceholder ? (
        <div className="max-w-2xl rounded-lg border-l-4 border-l-amber-500/60 bg-amber-500/5 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">Interests</p>
            <PlaceholderBadge />
          </div>
          <p className="mt-1 text-amber-700 dark:text-amber-400">TODO</p>
        </div>
      ) : (
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Interests</p>
          <p className="mt-1 max-w-2xl text-muted">{profile.interests}</p>
        </div>
      )}
    </div>
  );
}
