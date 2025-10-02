// // src/app/page.tsx
// "use client";

// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { SignInButton } from "@clerk/nextjs";
// import { Menu, X, Check } from "lucide-react";
// import Link from "next/link";

// export default function Home() {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

//   // Animation variants for Framer Motion
//   const containerVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, scale: 0.95 },
//     visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
//   };

//   return (
//     <div className="bg-gray-900 text-white overflow-x-hidden">
//       {/* Navigation */}
//       <nav className="fixed w-full z-50 bg-[rgba(255,255,255,0.1)] backdrop-blur-lg border border-[rgba(255,255,255,0.2)]">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="flex items-center space-x-2">
//               <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
//                 <svg
//                   className="w-6 h-6 text-white"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                   />
//                 </svg>
//               </div>
//               <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
//                 InvoicePro
//               </span>
//             </div>
//             <div className="hidden md:flex items-center space-x-8">
//               <Link
//                 href="#features"
//                 className="hover:text-secondary transition-colors"
//               >
//                 Features
//               </Link>
//               <Link
//                 href="#pricing"
//                 className="hover:text-secondary transition-colors"
//               >
//                 Pricing
//               </Link>
//               <Link
//                 href="#about"
//                 className="hover:text-secondary transition-colors"
//               >
//                 About
//               </Link>
//               <SignInButton mode="modal">
//                 <button className="bg-primary hover:bg-primary/80 px-4 py-2 rounded-lg transition-colors">
//                   Sign In
//                 </button>
//               </SignInButton>
//             </div>
//             <div className="md:hidden">
//               <button
//                 onClick={toggleMobileMenu}
//                 aria-label="Toggle mobile menu"
//                 className="text-white"
//               >
//                 {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
//               </button>
//             </div>
//           </div>
//           {/* Mobile Menu */}
//           <AnimatePresence>
//             {isMobileMenuOpen && (
//               <motion.div
//                 initial={{ opacity: 0, height: 0 }}
//                 animate={{ opacity: 1, height: "auto" }}
//                 exit={{ opacity: 0, height: 0 }}
//                 className="md:hidden bg-[rgba(255,255,255,0.1)] backdrop-blur-lg"
//               >
//                 <div className="flex flex-col space-y-4 px-4 py-6">
//                   <Link
//                     href="#features"
//                     className="hover:text-secondary"
//                     onClick={toggleMobileMenu}
//                   >
//                     Features
//                   </Link>
//                   <Link
//                     href="#pricing"
//                     className="hover:text-secondary"
//                     onClick={toggleMobileMenu}
//                   >
//                     Pricing
//                   </Link>
//                   <Link
//                     href="#about"
//                     className="hover:text-secondary"
//                     onClick={toggleMobileMenu}
//                   >
//                     About
//                   </Link>
//                   <SignInButton mode="modal">
//                     <button className="bg-primary hover:bg-primary/80 px-4 py-2 rounded-lg text-left">
//                       Sign In
//                     </button>
//                   </SignInButton>
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
//         <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent opacity-20 animate-[gradient_8s_ease_infinite] bg-[length:400%_400%]" />
//         <div className="absolute inset-0">
//           <div className="absolute top-20 left-20 w-72 h-72 bg-primary rounded-full mix-blend-multiply blur-xl opacity-20 animate-pulse-slow" />
//           <div className="absolute top-40 right-20 w-72 h-72 bg-secondary rounded-full mix-blend-multiply blur-xl opacity-20 animate-[pulse-slow_3s_infinite_2s]" />
//           <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-accent rounded-full mix-blend-multiply blur-xl opacity-20 animate-[pulse-slow_3s_infinite_4s]" />
//         </div>
//         <motion.div
//           variants={containerVariants}
//           initial="hidden"
//           animate="visible"
//           className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10"
//         >
//           <motion.div
//             variants={itemVariants}
//             className="animate-[float_6s_ease-in-out_infinite]"
//           >
//             <h1 className="text-5xl md:text-7xl font-bold mb-6">
//               Create{" "}
//               <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
//                 Professional
//               </span>{" "}
//               Invoices in Seconds
//             </h1>
//             <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
//               Generate stunning invoices with custom templates, automated
//               calculations, and secure database storage. Perfect for freelancers
//               and businesses.
//             </p>
//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//               <SignInButton mode="modal">
//                 <button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 px-8 py-4 rounded-lg text-lg font-semibold transition-all hover:scale-105">
//                   Start Free Trial
//                 </button>
//               </SignInButton>
//               <button className="bg-[rgba(255,255,255,0.1)] backdrop-blur-lg px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[rgba(255,255,255,0.2)] transition-all hover:scale-105">
//                 Watch Demo
//               </button>
//             </div>
//           </motion.div>
//         </motion.div>
//       </section>

//       {/* Features Section */}
//       <section id="features" className="py-20 bg-gray-800/50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <motion.div
//             variants={containerVariants}
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true }}
//           >
//             <div className="text-center mb-16">
//               <h2 className="text-4xl md:text-5xl font-bold mb-4">
//                 Powerful Features
//               </h2>
//               <p className="text-xl text-gray-300">
//                 Everything you need to manage your invoicing workflow
//               </p>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//               {[
//                 {
//                   icon: (
//                     <svg
//                       className="w-6 h-6 text-white"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
//                       />
//                     </svg>
//                   ),
//                   title: "Secure Authentication",
//                   description:
//                     "Advanced security with Clerk authentication, encrypted data, and role-based access control.",
//                 },
//                 {
//                   icon: (
//                     <svg
//                       className="w-6 h-6 text-white"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
//                       />
//                     </svg>
//                   ),
//                   title: "Custom Templates",
//                   description:
//                     "Design your own invoice templates or choose from our professional collection. Full customization control.",
//                 },
//                 {
//                   icon: (
//                     <svg
//                       className="w-6 h-6 text-white"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
//                       />
//                     </svg>
//                   ),
//                   title: "Brand Integration",
//                   description:
//                     "Upload your logo with Cloudinary, customize colors, and maintain consistent branding across all invoices.",
//                 },
//                 {
//                   icon: (
//                     <svg
//                       className="w-6 h-6 text-white"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
//                       />
//                     </svg>
//                   ),
//                   title: "Secure Database",
//                   description:
//                     "Store data securely with Convex, featuring automated backups, version control, and instant sync.",
//                 },
//                 {
//                   icon: (
//                     <svg
//                       className="w-6 h-6 text-white"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
//                       />
//                     </svg>
//                   ),
//                   title: "Smart Calculations",
//                   description:
//                     "Automated tax calculations, discounts, and totals with support for multiple currencies.",
//                 },
//                 {
//                   icon: (
//                     <svg
//                       className="w-6 h-6 text-white"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                       />
//                     </svg>
//                   ),
//                   title: "Multiple Formats",
//                   description:
//                     "Export invoices as PDF, Excel, or send via email with tracking and delivery confirmation.",
//                 },
//               ].map((feature, index) => (
//                 <motion.div
//                   key={index}
//                   variants={itemVariants}
//                   initial="hidden"
//                   whileInView="visible"
//                   viewport={{ once: true }}
//                   className="bg-[rgba(255,255,255,0.1)] backdrop-blur-lg border border-[rgba(255,255,255,0.2)] rounded-xl p-6 hover:scale-105 transition-transform"
//                 >
//                   <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center mb-4">
//                     {feature.icon}
//                   </div>
//                   <h3 className="text-xl font-semibold mb-2">
//                     {feature.title}
//                   </h3>
//                   <p className="text-gray-300">{feature.description}</p>
//                 </motion.div>
//               ))}
//             </div>
//           </motion.div>
//         </div>
//       </section>

//       {/* Demo Section */}
//       <section className="py-20">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <motion.div
//             variants={containerVariants}
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true }}
//             className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
//           >
//             <div>
//               <h2 className="text-4xl md:text-5xl font-bold mb-6">
//                 See It In Action
//               </h2>
//               <p className="text-xl text-gray-300 mb-8">
//                 Watch how easy it is to create professional invoices with our
//                 intuitive interface and powerful automation.
//               </p>
//               <ul className="space-y-4 text-lg">
//                 {[
//                   "Create invoice in under 30 seconds",
//                   "Automatic calculations and formatting",
//                   "Instant PDF generation and email",
//                 ].map((item, index) => (
//                   <li key={index} className="flex items-center space-x-3">
//                     <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
//                       <Check className="w-4 h-4 text-white" />
//                     </div>
//                     <span>{item}</span>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//             <motion.div variants={itemVariants} className="relative">
//               <div className="bg-[rgba(255,255,255,0.1)] backdrop-blur-lg rounded-2xl p-8 hover:scale-105 transition-transform">
//                 <div className="bg-gray-700 rounded-lg p-6">
//                   <div className="flex items-center space-x-3 mb-6">
//                     <div className="w-3 h-3 bg-red-500 rounded-full" />
//                     <div className="w-3 h-3 bg-yellow-500 rounded-full" />
//                     <div className="w-3 h-3 bg-green-500 rounded-full" />
//                     <span className="text-sm text-gray-400 ml-4">
//                       InvoicePro Dashboard
//                     </span>
//                   </div>
//                   <div className="space-y-4">
//                     <div className="bg-gray-600 rounded p-3">
//                       <div className="flex justify-between items-center">
//                         <span className="text-sm">Invoice #INV-2025-001</span>
//                         <span className="text-green-400 text-sm">
//                           $2,450.00
//                         </span>
//                       </div>
//                     </div>
//                     <div className="bg-gray-600 rounded p-3">
//                       <div className="flex justify-between items-center">
//                         <span className="text-sm">Invoice #INV-2025-002</span>
//                         <span className="text-yellow-400 text-sm">
//                           $1,875.50
//                         </span>
//                       </div>
//                     </div>
//                     <div className="bg-primary/20 rounded p-3 border border-primary">
//                       <div className="flex justify-between items-center">
//                         <span className="text-sm">Creating new invoice...</span>
//                         <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         </div>
//       </section>

//       {/* Pricing Section */}
//       <section id="pricing" className="py-20 bg-gray-800/50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <motion.div
//             variants={containerVariants}
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true }}
//           >
//             <div className="text-center mb-16">
//               <h2 className="text-4xl md:text-5xl font-bold mb-4">
//                 Simple Pricing
//               </h2>
//               <p className="text-xl text-gray-300">
//                 Choose the plan that fits your business needs
//               </p>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//               {[
//                 {
//                   title: "Starter",
//                   price: "$9",
//                   features: [
//                     "Up to 50 invoices/month",
//                     "Basic templates",
//                     "Email support",
//                   ],
//                   buttonClass: "bg-primary hover:bg-primary/80",
//                 },
//                 {
//                   title: "Professional",
//                   price: "$29",
//                   features: [
//                     "Unlimited invoices",
//                     "Custom templates",
//                     "Logo & branding",
//                     "Priority support",
//                   ],
//                   buttonClass:
//                     "bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80",
//                   isPopular: true,
//                 },
//                 {
//                   title: "Enterprise",
//                   price: "$99",
//                   features: [
//                     "Everything in Professional",
//                     "Multi-user access",
//                     "API access",
//                     "24/7 phone support",
//                   ],
//                   buttonClass: "bg-accent hover:bg-accent/80",
//                 },
//               ].map((plan, index) => (
//                 <motion.div
//                   key={index}
//                   variants={itemVariants}
//                   initial="hidden"
//                   whileInView="visible"
//                   viewport={{ once: true }}
//                   className={`bg-[rgba(255,255,255,0.1)] backdrop-blur-lg rounded-2xl p-8 hover:scale-105 transition-transform relative ${
//                     plan.isPopular ? "border-2 border-primary" : ""
//                   }`}
//                 >
//                   {plan.isPopular && (
//                     <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-primary to-secondary px-4 py-1 rounded-full text-sm font-semibold">
//                       Most Popular
//                     </div>
//                   )}
//                   <h3 className="text-2xl font-bold mb-4">{plan.title}</h3>
//                   <div className="text-4xl font-bold mb-6">
//                     {plan.price}
//                     <span className="text-lg text-gray-400">/month</span>
//                   </div>
//                   <ul className="space-y-3 mb-8">
//                     {plan.features.map((feature, i) => (
//                       <li key={i} className="flex items-center space-x-2">
//                         <Check className="w-5 h-5 text-primary" />
//                         <span>{feature}</span>
//                       </li>
//                     ))}
//                   </ul>
//                   <SignInButton mode="modal">
//                     <button
//                       className={`w-full ${plan.buttonClass} py-3 rounded-lg font-semibold transition-colors`}
//                     >
//                       Get Started
//                     </button>
//                   </SignInButton>
//                 </motion.div>
//               ))}
//             </div>
//           </motion.div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="py-20">
//         <motion.div
//           variants={containerVariants}
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true }}
//           className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8"
//         >
//           <h2 className="text-4xl md:text-5xl font-bold mb-6">
//             Ready to Streamline Your Invoicing?
//           </h2>
//           <p className="text-xl text-gray-300 mb-8">
//             Join thousands of freelancers and businesses who trust InvoicePro
//             for fast, professional, and secure invoicing.
//           </p>
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <SignInButton mode="modal">
//               <button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 px-8 py-4 rounded-lg text-lg font-semibold transition-all hover:scale-105">
//                 Start Free Trial
//               </button>
//             </SignInButton>
//             <Link
//               href="#demo"
//               className="bg-[rgba(255,255,255,0.1)] backdrop-blur-lg px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[rgba(255,255,255,0.2)] transition-all hover:scale-105"
//             >
//               Watch Demo
//             </Link>
//           </div>
//         </motion.div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-gray-800/50 py-12">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <motion.div
//             variants={containerVariants}
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true }}
//             className="grid grid-cols-1 md:grid-cols-4 gap-8"
//           >
//             <div>
//               <div className="flex items-center space-x-2 mb-4">
//                 <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
//                   <svg
//                     className="w-6 h-6 text-white"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                     />
//                   </svg>
//                 </div>
//                 <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
//                   InvoicePro
//                 </span>
//               </div>
//               <p className="text-gray-300">
//                 Streamline your invoicing with our powerful, secure, and
//                 easy-to-use platform.
//               </p>
//             </div>
//             <div>
//               <h4 className="text-lg font-semibold mb-4">Product</h4>
//               <ul className="space-y-2 text-gray-300">
//                 <li>
//                   <Link href="#features" className="hover:text-secondary">
//                     Features
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="#pricing" className="hover:text-secondary">
//                     Pricing
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="#demo" className="hover:text-secondary">
//                     Demo
//                   </Link>
//                 </li>
//               </ul>
//             </div>
//             <div>
//               <h4 className="text-lg font-semibold mb-4">Company</h4>
//               <ul className="space-y-2 text-gray-300">
//                 <li>
//                   <Link href="#about" className="hover:text-secondary">
//                     About
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="/contact" className="hover:text-secondary">
//                     Contact
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="/terms" className="hover:text-secondary">
//                     Terms
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="/privacy" className="hover:text-secondary">
//                     Privacy
//                   </Link>
//                 </li>
//               </ul>
//             </div>
//             <div>
//               <h4 className="text-lg font-semibold mb-4">Connect</h4>
//               <ul className="space-y-2 text-gray-300">
//                 <li>
//                   <a
//                     href="https://twitter.com/invoicepro"
//                     className="hover:text-secondary"
//                   >
//                     Twitter
//                   </a>
//                 </li>
//                 <li>
//                   <a
//                     href="https://linkedin.com/company/invoicepro"
//                     className="hover:text-secondary"
//                   >
//                     LinkedIn
//                   </a>
//                 </li>
//                 <li>
//                   <a
//                     href="mailto:support@invoicepro.com"
//                     className="hover:text-secondary"
//                   >
//                     support@invoicepro.com
//                   </a>
//                 </li>
//               </ul>
//             </div>
//           </motion.div>
//           <div className="mt-8 text-center text-gray-400">
//             <p>
//               &copy; {new Date().getFullYear()} InvoicePro. All rights reserved.
//             </p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }
// app/page.tsx
// app/page.tsx
"use client";

import Link from "next/link";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent opacity-20 animate-[gradient_8s_ease_infinite] bg-[length:400%_400%]" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary rounded-full mix-blend-multiply blur-xl opacity-20 animate-pulse-slow" />
          <div className="absolute top-40 right-20 w-72 h-72 bg-secondary rounded-full mix-blend-multiply blur-xl opacity-20 animate-[pulse-slow_3s_infinite_2s]" />
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-accent rounded-full mix-blend-multiply blur-xl opacity-20 animate-[pulse-slow_3s_infinite_4s]" />
        </div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10"
        >
          <motion.div
            variants={itemVariants}
            className="animate-[float_6s_ease-in-out_infinite]"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Create{" "}
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Professional
              </span>{" "}
              Invoices in Seconds
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Generate stunning invoices with custom templates, automated
              calculations, and secure database storage. Perfect for freelancers
              and businesses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <SignedOut>
                <SignInButton mode="modal">
                  <button
                    className={cn(
                      "bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 px-8 py-4 rounded-lg text-lg font-semibold transition-all hover:scale-105"
                    )}
                  >
                    Start Free Trial
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Link
                  href="/dashboard"
                  className={cn(
                    "bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 px-8 py-4 rounded-lg text-lg font-semibold transition-all hover:scale-105"
                  )}
                >
                  Go to Dashboard
                </Link>
              </SignedIn>
              <button
                className={cn(
                  "bg-[rgba(255,255,255,0.1)] backdrop-blur-lg px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[rgba(255,255,255,0.2)] transition-all hover:scale-105"
                )}
              >
                Watch Demo
              </button>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Powerful Features
              </h2>
              <p className="text-xl text-gray-300">
                Everything you need to manage your invoicing workflow
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: (
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
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  ),
                  title: "Secure Authentication",
                  description:
                    "Advanced security with Clerk authentication, encrypted data, and role-based access control.",
                },
                {
                  icon: (
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
                        d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                      />
                    </svg>
                  ),
                  title: "Custom Templates",
                  description:
                    "Design your own invoice templates or choose from our professional collection. Full customization control.",
                },
                {
                  icon: (
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
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  ),
                  title: "Brand Integration",
                  description:
                    "Upload your logo with Cloudinary, customize colors, and maintain consistent branding across all invoices.",
                },
                {
                  icon: (
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
                        d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                      />
                    </svg>
                  ),
                  title: "Secure Database",
                  description:
                    "Store data securely with Convex, featuring automated backups, version control, and instant sync.",
                },
                {
                  icon: (
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
                        d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                  ),
                  title: "Smart Calculations",
                  description:
                    "Automated tax calculations, discounts, and totals with support for multiple currencies.",
                },
                {
                  icon: (
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
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  ),
                  title: "Multiple Formats",
                  description:
                    "Export invoices as PDF, Excel, or send via email with tracking and delivery confirmation.",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  className={cn(
                    "bg-[rgba(255,255,255,0.1)] backdrop-blur-lg border border-[rgba(255,255,255,0.2)] rounded-xl p-6 hover:scale-105 transition-transform"
                  )}
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                See It In Action
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Watch how easy it is to create professional invoices with our
                intuitive interface and powerful automation.
              </p>
              <ul className="space-y-4 text-lg">
                {[
                  "Create invoice in under 30 seconds",
                  "Automatic calculations and formatting",
                  "Instant PDF generation and email",
                ].map((item, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <motion.div variants={itemVariants} className="relative">
              <div className="bg-[rgba(255,255,255,0.1)] backdrop-blur-lg rounded-2xl p-8 hover:scale-105 transition-transform">
                <div className="bg-gray-700 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                    <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <span className="text-sm text-gray-400 ml-4">
                      InvoicePro Dashboard
                    </span>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-gray-600 rounded p-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Invoice #INV-2025-001</span>
                        <span className="text-green-400 text-sm">
                          $2,450.00
                        </span>
                      </div>
                    </div>
                    <div className="bg-gray-600 rounded p-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Invoice #INV-2025-002</span>
                        <span className="text-yellow-400 text-sm">
                          $1,875.50
                        </span>
                      </div>
                    </div>
                    <div className="bg-primary/20 rounded p-3 border border-primary">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Creating new invoice...</span>
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Simple Pricing
              </h2>
              <p className="text-xl text-gray-300">
                Choose the plan that fits your business needs
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Starter",
                  price: "$9",
                  features: [
                    "Up to 50 invoices/month",
                    "Basic templates",
                    "Email support",
                  ],
                  buttonClass: "bg-primary hover:bg-primary/80",
                },
                {
                  title: "Professional",
                  price: "$29",
                  features: [
                    "Unlimited invoices",
                    "Custom templates",
                    "Logo & branding",
                    "Priority support",
                  ],
                  buttonClass:
                    "bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80",
                  isPopular: true,
                },
                {
                  title: "Enterprise",
                  price: "$99",
                  features: [
                    "Everything in Professional",
                    "Multi-user access",
                    "API access",
                    "24/7 phone support",
                  ],
                  buttonClass: "bg-accent hover:bg-accent/80",
                },
              ].map((plan, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  className={cn(
                    "bg-[rgba(255,255,255,0.1)] backdrop-blur-lg rounded-2xl p-8 hover:scale-105 transition-transform relative",
                    plan.isPopular && "border-2 border-primary"
                  )}
                >
                  {plan.isPopular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-primary to-secondary px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-2xl font-bold mb-4">{plan.title}</h3>
                  <div className="text-4xl font-bold mb-6">
                    {plan.price}
                    <span className="text-lg text-gray-400">/month</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center space-x-2">
                        <Check className="w-5 h-5 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <SignedOut>
                    <SignInButton mode="modal">
                      <button
                        className={cn(
                          "w-full",
                          plan.buttonClass,
                          "py-3 rounded-lg font-semibold transition-colors"
                        )}
                      >
                        Get Started
                      </button>
                    </SignInButton>
                  </SignedOut>
                  <SignedIn>
                    <Link
                      href="/dashboard"
                      className={cn(
                        "w-full",
                        plan.buttonClass,
                        "py-3 rounded-lg font-semibold transition-colors inline-block text-center"
                      )}
                    >
                      Go to Dashboard
                    </Link>
                  </SignedIn>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Streamline Your Invoicing?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of freelancers and businesses who trust InvoicePro
            for fast, professional, and secure invoicing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <SignedOut>
              <SignInButton mode="modal">
                <button
                  className={cn(
                    "bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 px-8 py-4 rounded-lg text-lg font-semibold transition-all hover:scale-105"
                  )}
                >
                  Start Free Trial
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link
                href="/dashboard"
                className={cn(
                  "bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 px-8 py-4 rounded-lg text-lg font-semibold transition-all hover:scale-105"
                )}
              >
                Go to Dashboard
              </Link>
            </SignedIn>
            <Link
              href="#demo"
              className={cn(
                "bg-[rgba(255,255,255,0.1)] backdrop-blur-lg px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[rgba(255,255,255,0.2)] transition-all hover:scale-105"
              )}
            >
              Watch Demo
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-4 gap-8"
          >
            <div>
              <div className="flex items-center space-x-2 mb-4">
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
              </div>
              <p className="text-gray-300">
                Streamline your invoicing with our powerful, secure, and
                easy-to-use platform.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Link href="#features" className="hover:text-secondary">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-secondary">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#demo" className="hover:text-secondary">
                    Demo
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Link href="#about" className="hover:text-secondary">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-secondary">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-secondary">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-secondary">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <a
                    href="https://twitter.com/invoicepro"
                    className="hover:text-secondary"
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    href="https://linkedin.com/company/invoicepro"
                    className="hover:text-secondary"
                  >
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:support@invoicepro.com"
                    className="hover:text-secondary"
                  >
                    support@invoicepro.com
                  </a>
                </li>
              </ul>
            </div>
          </motion.div>
          <div className="mt-8 text-center text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} InvoicePro. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
