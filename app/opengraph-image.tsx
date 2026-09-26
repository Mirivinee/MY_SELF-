import { ImageResponse } from "next/og";
import { profile } from "@/lib/content";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#0b0c0f",
          color: "#edeff2",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, color: "#60a5fa", marginBottom: 16 }}>
          Hi, I&apos;m
        </div>
        <div style={{ display: "flex", fontSize: 72, fontWeight: 700 }}>{profile.name}</div>
        <div style={{ display: "flex", fontSize: 32, color: "#9aa3af", marginTop: 24 }}>
          {profile.role}
        </div>
      </div>
    ),
    { ...size }
  );
}
