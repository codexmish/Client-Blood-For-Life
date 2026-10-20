import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Providers from "@/providers";
import { Toaster } from "@/components/ui/toast";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});



export const metadata: Metadata = {
  title: "Blood For Life",
  description: "You can save someones life by donating your blood",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", "font-sans", inter.variable)}
    >
      <Providers>

      <body className="min-h-full flex flex-col">
        {children}
        <Toaster/>
        </body>
      </Providers>
    </html>
  );
}
