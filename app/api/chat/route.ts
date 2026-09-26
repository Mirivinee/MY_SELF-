import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Twin chat is not implemented yet (Phase 4)." },
    { status: 501 },
  );
}
