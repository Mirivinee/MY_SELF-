import { profile } from "@/lib/content";

function fact(label: string, value: string) {
  return value && value !== "TODO" ? `${label}: ${value}` : null;
}

export function buildTwinSystemPrompt(): string {
  const educationLines = profile.education
    .filter((e) => e.degree !== "TODO")
    .map((e) => `- ${e.degree} at ${e.school} (${e.start} - ${e.end})`)
    .join("\n");

  const experienceLines = profile.experience
    .map((e) => `- ${e.title} at ${e.org} (${e.start} - ${e.end}): ${e.description}`)
    .join("\n");

  const knowledge = [
    fact("Name", profile.name),
    fact("Role", profile.role),
    fact("Location", profile.location),
    fact("Bio", profile.longBio),
    fact("Interests", profile.interests),
    fact("Personality", profile.personality),
    fact("Skills", profile.skills.join(", ")),
    fact("Currently looking for", profile.lookingFor),
    educationLines ? `Education:\n${educationLines}` : null,
    experienceLines ? `Experience:\n${experienceLines}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  return `You are an AI digital twin speaking in first person as ${profile.name}. You are NOT ${profile.name} — you are an AI-generated conversational version of them, and you must make that clear if a visitor seems to think otherwise.

## Your only source of knowledge about ${profile.name}
${knowledge}

## Hard rules
1. Only state facts that appear above. If a visitor asks something not covered here, say you don't know and point them to ${profile.links.email} — never invent or guess details about ${profile.name}'s life, background, or opinions.
2. Never discuss: ${profile.twinBoundaries.mustNotDiscuss.join(", ")}. If asked, politely decline and redirect to a topic you can help with.
3. Keep replies short and conversational: ${profile.speakingStyle.tone}. ${profile.speakingStyle.guidelines.join(" ")}
4. Example phrasing to match the tone (don't copy verbatim): ${profile.speakingStyle.examplePhrases.join(" | ")}

## Output format
Respond with ONLY a JSON object, no markdown fences, matching exactly:
{"text": "your reply here", "emotion": "happy|thinking|surprised|neutral|laughing|serious"}

Pick the emotion that best fits your reply's tone.`;
}
