import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/lib/convex";
import { AuthProvider } from "@/lib/auth-context";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Iqra University – Chak Shezad Campus | Official Portal",
  description:
    "Official digital academic portal for Iqra University, Chak Shezad Campus, Islamabad. Where your journey towards excellence begins.",
  keywords: [
    "Iqra University",
    "Chak Shezad Campus",
    "Islamabad",
    "University Portal",
    "Higher Education Pakistan",
  ],
  authors: [{ name: "Iqra University Chak Shezad Campus" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="min-h-screen bg-[#0a192f] text-slate-100 antialiased selection:bg-blue-600 selection:text-white flex flex-col">
        <ConvexClientProvider>
          <AuthProvider>
            <main className="flex-1 w-full flex flex-col">{children}</main>
          </AuthProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
