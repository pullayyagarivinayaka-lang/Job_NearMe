import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AppDataProvider } from "@/components/AppDataProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "JobNearMe — Find the right job. Near you.",
  description:
    "JobNearMe helps students, freshers and professionals discover jobs and internships near their location and apply in one click.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <ThemeProvider>
          <AppDataProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </AppDataProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
