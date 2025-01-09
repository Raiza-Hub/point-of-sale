import { Urbanist } from 'next/font/google';
import "./globals.css";
import ConvexClerkProvider from "@/providers/ConvexClerkProvider";
import { Toaster } from "@/components/ui/toaster"
import { Suspense } from "react";
import { constructMetadata } from '@/lib/utils';

const urbanist = Urbanist({
  subsets: ['latin'],
});

export const metadata = constructMetadata()

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexClerkProvider>
      <html lang="en">
        <body
          className={`${urbanist.className} antialiased min-h-screen`}
        >
          <div className="w-full flex flex-col min-h-screen mx-auto bg-[#fafafa]">
            <Toaster />
            <Suspense>
              {children}
            </Suspense>
          </div>
        </body>
      </html>
    </ConvexClerkProvider>
  );
}
