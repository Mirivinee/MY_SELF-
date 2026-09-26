import rawProfile from "@/content/profile.json";
import rawProjects from "@/content/projects.json";
import rawCertificates from "@/content/certificates.json";

export interface ExperienceItem {
  title: string;
  org: string;
  start: string;
  end: string;
  description: string;
}

export interface EducationItem {
  degree: string;
  school: string;
  start: string;
  end: string;
}

export type Emotion =
  | "happy"
  | "thinking"
  | "surprised"
  | "neutral"
  | "laughing"
  | "serious";

export interface SpeakingStyle {
  tone: string;
  guidelines: string[];
  examplePhrases: string[];
}

export interface Profile {
  name: string;
  role: string;
  location: string;
  shortBio: string;
  longBio: string;
  skills: string[];
  experience: ExperienceItem[];
  education: EducationItem[];
  personality: string;
  speakingStyle: SpeakingStyle;
  lookingFor: string;
  defaultEmotion: Emotion;
  links: {
    github: string;
    linkedin: string;
    email: string;
    resume: string;
  };
  twinBoundaries: {
    mustNotDiscuss: string[];
  };
}

export interface Project {
  slug: string;
  title: string;
  description: string;
  tech: string[];
  githubUrl: string;
  screenshots: string[];
}

export interface Certificate {
  title: string;
  issuer: string;
  year: string;
  description: string;
  linkedinUrl: string;
}

export const profile = rawProfile as Profile;
export const projects = rawProjects as Project[];
export const certificates = rawCertificates as Certificate[];
