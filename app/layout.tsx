import "./globals.css";
import { ReactNode } from "react";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Multi-LLM Chat",
  description: "Compare responses from multiple LLMs",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="bg-[#05030d] text-slate-100">
        {children}
      </body>
    </html>
  );
}
