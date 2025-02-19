import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";

config.autoAddCss = false;

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Neo ID Scanner",
  description: "A web application for scanning and managing student IDs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col bg-[#f2fafc]">
          <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <h1 className="text-2xl text-center font-bold text-gray-900">
                Neo ID Scanner
              </h1>
            </div>
          </header>

          <main className="flex-grow">
            <div className="container mx-auto px-2 md:px-4 lg:px-6 py-8">
              {children}
            </div>
          </main>

          <footer className="bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <p className="text-center text-gray-600">
                © 2025 RMIT Neo Culture Tech
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
