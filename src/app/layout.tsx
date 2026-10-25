import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Project Blueprint | Cynbit prototype",
  description:
    "Scope a software or AI project in four steps and get an instant indicative blueprint: timeline, cost range, stack and matching case studies.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
