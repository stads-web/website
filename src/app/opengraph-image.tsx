import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export const runtime = "nodejs";

export const alt =
  "STADS – Students' Association for Data Analytics & Statistics Mannheim";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const markPath = join(process.cwd(), "src", "app", "icon.png");
  const markSrc = `data:image/png;base64,${readFileSync(markPath).toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0F1D36",
          color: "#ffffff",
          fontFamily: "sans-serif",
          padding: "80px",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={markSrc} alt="" width={148} height={148} style={{ marginBottom: 40 }} />
        <div
          style={{
            fontSize: 76,
            fontWeight: 700,
            letterSpacing: 2,
            lineHeight: 1,
          }}
        >
          STADS
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 30,
            marginTop: 28,
            color: "rgba(255,255,255,0.75)",
            textAlign: "center",
            maxWidth: 880,
          }}
        >
          Students&apos; Association for Data Analytics &amp; Statistics
        </div>
      </div>
    ),
    { ...size }
  );
}
