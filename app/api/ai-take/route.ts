import { NextResponse } from "next/server";
import { getAiProvider } from "@/lib/ai";
import { isRateLimited, clientKeyFrom } from "@/lib/ai/rate-limit";
import { pickCannedTake } from "@/lib/ai/canned-takes";

const MAX_FIELD_LENGTH = 300;

function isValidField(value: unknown): value is string {
  return typeof value === "string" && value.length > 0 && value.length <= MAX_FIELD_LENGTH;
}

export async function POST(request: Request) {
  if (isRateLimited(clientKeyFrom(request))) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment and try again." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { kind, title, description } = body as {
    kind?: unknown;
    title?: unknown;
    description?: unknown;
  };

  if (kind !== "project" && kind !== "certificate") {
    return NextResponse.json({ error: 'kind must be "project" or "certificate".' }, { status: 400 });
  }
  if (!isValidField(title) || !isValidField(description)) {
    return NextResponse.json(
      { error: `title and description are required, up to ${MAX_FIELD_LENGTH} characters.` },
      { status: 400 },
    );
  }

  try {
    const provider = getAiProvider();
    const text = await provider.generateTake({ kind, title, description });
    return NextResponse.json({ text });
  } catch (error) {
    console.error("[api/ai-take] provider error:", error);
    return NextResponse.json({ text: pickCannedTake(title) });
  }
}
