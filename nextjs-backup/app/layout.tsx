import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StudyMate",
  description: "Your AI-Powered Study Notes App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="font-bold text-xl text-blue-600 flex items-center gap-2">
              🧠 StudyMate
            </Link>
            <div className="flex gap-6">
              <Link href="/notes" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition">
                Notes
              </Link>
              <Link href="/summaries" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition">
                Summaries
              </Link>
              <Link href="/quizzes" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition">
                Quizzes
              </Link>
            </div>
          </div>
        </nav>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
