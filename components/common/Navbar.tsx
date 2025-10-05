// "use client";

// import { useState, useEffect } from "react";
// import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
// import Link from "next/link";
// import { Menu, X } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useUser } from "@clerk/nextjs";
// import { useMutation, useQuery } from "convex/react";
// import { api } from "@/convex/_generated/api";

// export default function Navbar() {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const { isSignedIn, user } = useUser();
//   const upsertUser = useMutation(api.users.upsertUser);
//   const getUser = useQuery(api.users.getUser, { clerkId: user?.id || "" });

//   const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

//   // Capture user data on sign-in
//   useEffect(() => {
//     if (isSignedIn && user && !getUser) {
//       upsertUser({
//         clerkId: user.id,
//         email: user.emailAddresses[0].emailAddress,
//         firstName: user.firstName || undefined,
//         lastName: user.lastName || undefined,
//       }).catch((error) => {
//         console.error("Failed to save user to Convex:", error);
//       });
//     }
//   }, [isSignedIn, user, getUser, upsertUser]);

//   return (
//     <nav className="fixed top-0 left-0 right-0 bg-[rgba(0,0,0,0.5)] backdrop-blur-md z-50 border-b border-[rgba(255,255,255,0.1)]">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
//         <Link href="/" className="flex items-center space-x-2">
//           <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
//             <svg
//               className="w-6 h-6 text-white"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//               />
//             </svg>
//           </div>
//           <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
//             InvoicePro
//           </span>
//         </Link>
//         <div className="hidden md:flex items-center space-x-8">
//           <SignedOut>
//             <Link
//               href="#features"
//               className="hover:text-secondary transition-colors"
//             >
//               Features
//             </Link>
//             <Link
//               href="#pricing"
//               className="hover:text-secondary transition-colors"
//             >
//               Pricing
//             </Link>
//             <Link
//               href="#about"
//               className="hover:text-secondary transition-colors"
//             >
//               About
//             </Link>
//             <SignInButton mode="modal">
//               <button className="bg-primary hover:bg-primary/80 px-4 py-2 rounded-lg transition-all hover:scale-105">
//                 Sign In
//               </button>
//             </SignInButton>
//           </SignedOut>
//           <SignedIn>
//             <Link
//               href="/dashboard"
//               className="hover:text-secondary transition-colors"
//             >
//               Dashboard
//             </Link>
//             <Link
//               href="/dashboard/invoices"
//               className="hover:text-secondary transition-colors"
//             >
//               Invoices
//             </Link>
//             <Link
//               href="/dashboard/templates"
//               className="hover:text-secondary transition-colors"
//             >
//               Templates
//             </Link>
//             <Link
//               href="/dashboard/settings"
//               className="hover:text-secondary transition-colors"
//             >
//               Settings
//             </Link>
//             <UserButton afterSignOutUrl="/" />
//           </SignedIn>
//         </div>
//         <button
//           onClick={toggleMobileMenu}
//           className="md:hidden focus:outline-none"
//         >
//           {isMobileMenuOpen ? (
//             <X className="w-6 h-6" />
//           ) : (
//             <Menu className="w-6 h-6" />
//           )}
//         </button>
//       </div>
//       <AnimatePresence>
//         {isMobileMenuOpen && (
//           <motion.div
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: 1, height: "auto" }}
//             exit={{ opacity: 0, height: 0 }}
//             className="md:hidden bg-[rgba(255,255,255,0.1)] backdrop-blur-lg"
//           >
//             <div className="flex flex-col space-y-4 px-4 py-6">
//               <SignedOut>
//                 <Link
//                   href="#features"
//                   className="hover:text-secondary"
//                   onClick={toggleMobileMenu}
//                 >
//                   Features
//                 </Link>
//                 <Link
//                   href="#pricing"
//                   className="hover:text-secondary"
//                   onClick={toggleMobileMenu}
//                 >
//                   Pricing
//                 </Link>
//                 <Link
//                   href="#about"
//                   className="hover:text-secondary"
//                   onClick={toggleMobileMenu}
//                 >
//                   About
//                 </Link>
//                 <SignInButton mode="modal">
//                   <button
//                     className="bg-primary hover:bg-primary/80 px-4 py-2 rounded-lg text-left"
//                     onClick={toggleMobileMenu}
//                   >
//                     Sign In
//                   </button>
//                 </SignInButton>
//               </SignedOut>
//               <SignedIn>
//                 <Link
//                   href="/dashboard"
//                   className="hover:text-secondary"
//                   onClick={toggleMobileMenu}
//                 >
//                   Dashboard
//                 </Link>
//                 <Link
//                   href="/dashboard/invoices"
//                   className="hover:text-secondary"
//                   onClick={toggleMobileMenu}
//                 >
//                   Invoices
//                 </Link>
//                 <Link
//                   href="/dashboard/templates"
//                   className="hover:text-secondary"
//                   onClick={toggleMobileMenu}
//                 >
//                   Templates
//                 </Link>
//                 <Link
//                   href="/dashboard/settings"
//                   className="hover:text-secondary"
//                   onClick={toggleMobileMenu}
//                 >
//                   Settings
//                 </Link>
//                 <UserButton afterSignOutUrl="/" />
//               </SignedIn>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </nav>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Menu, X, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useTheme } from "next-themes";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isSignedIn, user } = useUser();
  const upsertUser = useMutation(api.users.upsertUser);
  const getUser = useQuery(api.users.getUser, { clerkId: user?.id || "" });
  const { theme, setTheme } = useTheme();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Capture user data on sign-in
  useEffect(() => {
    if (isSignedIn && user && !getUser) {
      upsertUser({
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        firstName: user.firstName || undefined,
        lastName: user.lastName || undefined,
      }).catch((error) => {
        console.error("Failed to save user to Convex:", error);
      });
    }
  }, [isSignedIn, user, getUser, upsertUser]);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-[rgba(0,0,0,0.5)] backdrop-blur-md z-50 border-b border-[rgba(255,255,255,0.1)] dark:bg-[rgba(0,0,0,0.5)] dark:border-[rgba(255,255,255,0.1)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            InvoicePro
          </span>
        </Link>
        <div className="hidden md:flex items-center space-x-8">
          <SignedOut>
            <Link
              href="#features"
              className="hover:text-secondary transition-colors"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="hover:text-secondary transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="#about"
              className="hover:text-secondary transition-colors"
            >
              About
            </Link>
            <SignInButton mode="modal">
              <button className="bg-primary hover:bg-primary/80 px-4 py-2 rounded-lg transition-all hover:scale-105">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link
              href="/dashboard"
              className="hover:text-secondary transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/invoices"
              className="hover:text-secondary transition-colors"
            >
              Invoices
            </Link>
            <Link
              href="/dashboard/templates"
              className="hover:text-secondary transition-colors"
            >
              Templates
            </Link>
            <Link
              href="/dashboard/settings"
              className="hover:text-secondary transition-colors"
            >
              Settings
            </Link>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
        <button
          onClick={toggleMobileMenu}
          className="md:hidden focus:outline-none"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[rgba(255,255,255,0.1)] backdrop-blur-lg"
          >
            <div className="flex flex-col space-y-4 px-4 py-6">
              <SignedOut>
                <Link
                  href="#features"
                  className="hover:text-secondary"
                  onClick={toggleMobileMenu}
                >
                  Features
                </Link>
                <Link
                  href="#pricing"
                  className="hover:text-secondary"
                  onClick={toggleMobileMenu}
                >
                  Pricing
                </Link>
                <Link
                  href="#about"
                  className="hover:text-secondary"
                  onClick={toggleMobileMenu}
                >
                  About
                </Link>
                <SignInButton mode="modal">
                  <button
                    className="bg-primary hover:bg-primary/80 px-4 py-2 rounded-lg text-left"
                    onClick={toggleMobileMenu}
                  >
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Link
                  href="/dashboard"
                  className="hover:text-secondary"
                  onClick={toggleMobileMenu}
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/invoices"
                  className="hover:text-secondary"
                  onClick={toggleMobileMenu}
                >
                  Invoices
                </Link>
                <Link
                  href="/dashboard/templates"
                  className="hover:text-secondary"
                  onClick={toggleMobileMenu}
                >
                  Templates
                </Link>
                <Link
                  href="/dashboard/settings"
                  className="hover:text-secondary"
                  onClick={toggleMobileMenu}
                >
                  Settings
                </Link>
                <button
                  onClick={() => {
                    toggleTheme();
                    toggleMobileMenu();
                  }}
                  className="flex items-center gap-2 hover:text-secondary"
                >
                  {theme === "dark" ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                  Toggle Theme
                </button>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
