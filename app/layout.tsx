import { Inter } from "next/font/google";
import "./globals.css";
import HydrationSuppressor from "./components/HydrationSuppressor";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Ice Bath Directory",
  description: "Find and compare ice bath facilities across different cities",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <HydrationSuppressor />
        {children}
      </body>
    </html>
  );
}
