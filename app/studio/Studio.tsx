"use client";

import { NextStudio } from "next-sanity/studio";
import config from "@/sanity.config";

function StudioFallback() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        fontFamily: "monospace",
        fontSize: 14,
        color: "#C9C9C9",
        background: "#000",
        gap: 16,
        padding: 40,
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: 18, color: "#fff" }}>Sanity Studio</h1>
      <p>
        Set <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> in{" "}
        <code>.env.local</code> to connect to your Sanity project.
      </p>
      <p style={{ color: "#767676" }}>
        See <code>.env.example</code> for the required environment variables.
      </p>
    </div>
  );
}

export default function Studio() {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    return <StudioFallback />;
  }
  return <NextStudio config={config} />;
}
