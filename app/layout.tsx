import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Multi-LLM Chat",
  description: "Compare responses from multiple LLMs",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#05030d] text-slate-100">
        <div>
          {children}
        </div>
      </body>
    </html>
  );
}
