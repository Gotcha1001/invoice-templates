// import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
// import { ConvexClientProvider } from "./ConvexClientProvider";
// import { ClerkProvider } from "@clerk/nextjs";
// import Navbar from "@/components/common/Navbar";
// import { dark } from "@clerk/themes";
// import { Toaster } from "@/components/ui/sonner"; // Change this import to use the custom Sonner component
// import { ThemeProvider } from "next-themes";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata: Metadata = {
//   title: "Professional Invoices Made Easy",
//   description: "Created by CodeNow101",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en" suppressHydrationWarning>
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased`}
//       >
//         <ClerkProvider appearance={{ baseTheme: dark }}>
//           <ConvexClientProvider>
//             <ThemeProvider
//               attribute="class"
//               defaultTheme="dark"
//               enableSystem
//               disableTransitionOnChange
//             >
//               <Navbar />
//               <main>{children}</main>
//               <Toaster richColors />
//             </ThemeProvider>
//           </ConvexClientProvider>
//         </ClerkProvider>
//       </body>
//     </html>
//   );
// }

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/common/Navbar";
import { dark } from "@clerk/themes";
import { Toaster } from "@/components/ui/sonner"; // Change this import to use the custom Sonner component
import { ThemeProvider } from "next-themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Professional Invoices Made Easy",
  description: "Created by CodeNow101",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClerkProvider appearance={{ baseTheme: dark }}>
          <ConvexClientProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <Navbar />
              <main>{children}</main>
              <Toaster richColors />
            </ThemeProvider>
          </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
