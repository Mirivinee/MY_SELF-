import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Text-to-speech is not implemented yet (Phase 5)." },
    { status: 501 },
  );
}
