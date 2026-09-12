"use client";

import React, { createContext, useContext, useMemo } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

export const isConvexConfigured = Boolean(
  convexUrl &&
    convexUrl.startsWith("https://") &&
    !convexUrl.includes("placeholder")
);

let client: ConvexReactClient | null = null;

if (isConvexConfigured && convexUrl) {
  try {
    client = new ConvexReactClient(convexUrl);
  } catch (err) {
    console.warn("Failed to initialize Convex client:", err);
  }
}

export function ConvexClientProvider({ children }: { children: React.ReactNode }) {
  if (!client) {
    // If Convex is not yet connected to a live URL, render children directly
    return <>{children}</>;
  }

  return <ConvexProvider client={client}>{children}</ConvexProvider>;
}

export function getConvexClient() {
  return client;
}
