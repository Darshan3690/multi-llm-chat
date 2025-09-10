import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Multi-LLM Chat",
  description: "Compare responses from multiple LLMs",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div >
          {children}
        </div>
      </body>
    </html>
  );
}
