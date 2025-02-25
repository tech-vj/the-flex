import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import Sidebar from "@/app/components/Sidebar"; // Ensure alias works in tsconfig.json

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FlexNext App",
  description: "A Next.js app with a dynamic table",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script defer src="https://cdn.tailwindcss.com"></script>
        <script defer src="https://c20.live/script/chatbot-embed.js"></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-500`}
      >
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 p-6">{children}</main>
        </div>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.addEventListener('DOMContentLoaded', function() {
                if (window.initializeChatbot) {
                  window.initializeChatbot("67bda90867e91892a15520ed");
                  return;
                }
                const checkInitialize = setInterval(function() {
                  if (window.initializeChatbot) {
                    window.initializeChatbot("67bda90867e91892a15520ed");
                    clearInterval(checkInitialize);
                  }
                }, 100);
                setTimeout(() => clearInterval(checkInitialize), 10000);
              });
            `,
          }}
        />
      </body>
    </html>
  );
}
