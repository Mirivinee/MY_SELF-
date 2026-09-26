import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "AI take comments are not implemented yet (Phase 4)." },
    { status: 501 },
  );
}
