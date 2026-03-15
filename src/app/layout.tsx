import { Inter, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Quantum Aurora | Headhunting Platform",
  description: "Modern ATS and CRM for professional headhunters",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(, "font-sans", geist.variable)}>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
