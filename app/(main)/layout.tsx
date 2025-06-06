import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "@/app/globals.css";
import Header from "@/components/header/header";
import { Toaster } from "@/components/ui/sonner";
import Footer from "@/components/home/footer";
import AuthProvider from "@/components/providers/auth-provider";
import { CartProvider } from "@/context/cart-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "VitaForge",
  description: "Premium Supplements for Your Fitness Journey",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.className} antialiased`}
      >
        <AuthProvider>
          <CartProvider>


            <Header />
            <div className="flex min-h-screen flex-col">

              <main className="flex-1">{children}</main>
              <Toaster position="bottom-right" />
              <Footer />

            </div>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
