import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RollPlay - Music Discovery",
  description: "Futuristic music discovery with Spotify - Roll the dice and discover new music",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "RollPlay",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#8B5CF6",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className={`${inter.className} h-full`}>
        <div className="flex flex-col h-full">
          <main className="flex-1 overflow-auto pb-20">
            {children}
          </main>
          
          {/* Bottom Navigation */}
          <nav className="fixed bottom-0 left-0 right-0 bg-surface-1 border-t border-border z-50">
            <div className="flex items-center justify-around h-16 max-w-md mx-auto px-4">
              <Link 
                href="/" 
                className="flex flex-col items-center gap-1 text-text-secondary hover:text-neon-violet transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="text-xs">Home</span>
              </Link>
              
              <Link 
                href="/profile" 
                className="flex flex-col items-center gap-1 text-text-secondary hover:text-neon-violet transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-xs">Profile</span>
              </Link>
            </div>
          </nav>
        </div>
      </body>
    </html>
  );
}
