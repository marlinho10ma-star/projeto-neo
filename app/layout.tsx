import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { AppProvider } from "@/contexts/AppContext";
import { AuthGuard } from "@/components/AuthGuard";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Projeto NEO",
  description: "Industrial Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${inter.variable} antialiased bg-background text-foreground overflow-hidden font-sans`}
      >
        <AppProvider>
          <AuthGuard>
            <div className="flex h-screen w-full flex-col md:flex-row">
              {/* Sidebar only visible on Desktop */}
              <div className="hidden md:block">
                <Sidebar />
              </div>

              <main className="flex-1 flex flex-col overflow-hidden md:mb-0">
                {/* Header sticky on top */}
                <Header />
                <div className="flex-1 overflow-auto p-4 md:p-6 bg-muted/10 relative">
                  {children}
                </div>
              </main>

              {/* Bottom Nav only visible on Mobile/Tablet */}
              <BottomNav />
            </div>
          </AuthGuard>
        </AppProvider>
      </body>
    </html>
  );
}


