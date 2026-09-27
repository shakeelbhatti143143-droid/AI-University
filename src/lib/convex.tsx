"use client";

import React, { createContext, useContext, useMemo } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

const FALLBACK_CONVEX_URL = "http://127.0.0.1:3210";
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || FALLBACK_CONVEX_URL;

export const isConvexConfigured = Boolean(
  convexUrl &&
    (convexUrl.startsWith("https://") || convexUrl.startsWith("http://")) &&
    !convexUrl.includes("placeholder")
);

let client: ConvexReactClient | null = null;

try {
  client = new ConvexReactClient(convexUrl);
} catch (err) {
  console.warn("Failed to initialize Convex client with primary URL, trying fallback:", err);
  try {
    client = new ConvexReactClient(FALLBACK_CONVEX_URL);
  } catch (innerErr) {
    console.warn("Critical Convex initialization error:", innerErr);
  }
}

export function ConvexClientProvider({ children }: { children: React.ReactNode }) {
  if (!client) {
    return <>{children}</>;
  }

  return <ConvexProvider client={client}>{children}</ConvexProvider>;
}

export function getConvexClient() {
  return client;
}
