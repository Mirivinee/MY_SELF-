import { profile } from "@/lib/content";
import Hero from "@/components/home/Hero";
import Highlights from "@/components/home/Highlights";
import ExploreLinks from "@/components/home/ExploreLinks";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-20">
      <Hero profile={profile} />
      <Highlights profile={profile} />
      <ExploreLinks />
    </div>
  );
}
