// "use client";

// import { useQuery, useMutation } from "convex/react";
// import { api } from "@/convex/_generated/api";
// import { useUser } from "@clerk/nextjs";
// import { Button } from "@/components/ui/button";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { toast } from "sonner";
// import Link from "next/link";
// import { Loader2, Plus, Edit, Trash2 } from "lucide-react";
// import { Id } from "@/convex/_generated/dataModel";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
// import { Card, CardContent } from "@/components/ui/card";

// export default function TemplatesList() {
//   const { user } = useUser();

//   // First get the company
//   const company = useQuery(api.companies.getCompanyByUser, {
//     userId: user?.id || "",
//   });

//   // Then get templates using companyId
//   const templates = useQuery(
//     api.templates.getTemplatesByCompany,
//     company?._id ? { companyId: company._id } : "skip"
//   );

//   const deleteTemplate = useMutation(api.templates.deleteTemplate);

//   const handleDelete = async (id: Id<"templates">) => {
//     if (!company) return;
//     try {
//       await deleteTemplate({ id, companyId: company._id });
//       toast.success("Template deleted successfully!");
//     } catch (error) {
//       console.error("Failed to delete template:", error);
//       toast.error("Failed to delete template. Please try again.");
//     }
//   };

//   if (!user || company === undefined || templates === undefined) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <Loader2 className="w-8 h-8 animate-spin" />
//       </div>
//     );
//   }

//   if (company === null) {
//     return (
//       <div className="max-w-7xl mx-auto p-6 mt-20">
//         <Card>
//           <CardContent className="pt-6">
//             <p className="text-center mb-4">
//               Please set up your company first.
//             </p>
//             <div className="flex justify-center">
//               <Link href="/dashboard/settings">
//                 <Button>Go to Settings</Button>
//               </Link>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto p-6 mt-20">
//       <div className="flex justify-between items-center mb-8">
//         <div>
//           <h1 className="text-3xl font-bold">Invoice Templates</h1>
//           <p className="text-gray-600 mt-2">
//             Customize your invoice designs and create new templates
//           </p>
//         </div>
//         <Link href="/dashboard/templates/create">
//           <Button size="lg" className="flex items-center gap-2">
//             <Plus size={20} />
//             Create New Template
//           </Button>
//         </Link>
//       </div>

//       {templates?.length === 0 ? (
//         <Card>
//           <CardContent className="py-12">
//             <div className="text-center">
//               <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <Plus size={32} className="text-primary" />
//               </div>
//               <h3 className="text-xl font-semibold mb-2">No Templates Yet</h3>
//               <p className="text-gray-600 mb-6">
//                 Create your first invoice template to get started!
//               </p>
//               <Link href="/dashboard/templates/create">
//                 <Button size="lg" className="flex items-center gap-2 mx-auto">
//                   <Plus size={20} />
//                   Create Your First Template
//                 </Button>
//               </Link>
//             </div>
//           </CardContent>
//         </Card>
//       ) : (
//         <Card>
//           <CardContent className="p-0">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Name</TableHead>
//                   <TableHead>Description</TableHead>
//                   <TableHead>Header Style</TableHead>
//                   <TableHead>Logo Position</TableHead>
//                   <TableHead>Default</TableHead>
//                   <TableHead className="text-right">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {templates?.map((template) => (
//                   <TableRow key={template._id}>
//                     <TableCell className="font-medium">
//                       {template.name}
//                     </TableCell>
//                     <TableCell>
//                       {template.description || "No description"}
//                     </TableCell>
//                     <TableCell className="capitalize">
//                       {template.layout.headerStyle}
//                     </TableCell>
//                     <TableCell className="capitalize">
//                       {template.layout.logoPosition}
//                     </TableCell>
//                     <TableCell>
//                       {template.isDefault ? (
//                         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                           Default
//                         </span>
//                       ) : (
//                         <span className="text-gray-400">No</span>
//                       )}
//                     </TableCell>
//                     <TableCell>
//                       <div className="flex justify-end space-x-2">
//                         <Link href={`/dashboard/templates/${template._id}`}>
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             className="flex items-center gap-1"
//                           >
//                             <Edit size={14} />
//                             Edit
//                           </Button>
//                         </Link>
//                         <AlertDialog>
//                           <AlertDialogTrigger asChild>
//                             <Button
//                               variant="destructive"
//                               size="sm"
//                               className="flex items-center gap-1"
//                             >
//                               <Trash2 size={14} />
//                               Delete
//                             </Button>
//                           </AlertDialogTrigger>
//                           <AlertDialogContent>
//                             <AlertDialogHeader>
//                               <AlertDialogTitle>Are you sure?</AlertDialogTitle>
//                               <AlertDialogDescription>
//                                 This will permanently delete the template "
//                                 {template.name}". This action cannot be undone.
//                               </AlertDialogDescription>
//                             </AlertDialogHeader>
//                             <AlertDialogFooter>
//                               <AlertDialogCancel>Cancel</AlertDialogCancel>
//                               <AlertDialogAction
//                                 onClick={() => handleDelete(template._id)}
//                                 className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
//                               >
//                                 Delete
//                               </AlertDialogAction>
//                             </AlertDialogFooter>
//                           </AlertDialogContent>
//                         </AlertDialog>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// }

// "use client";

// import { useQuery, useMutation } from "convex/react";
// import { api } from "@/convex/_generated/api";
// import { useUser } from "@clerk/nextjs";
// import { Button } from "@/components/ui/button";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { toast } from "sonner";
// import Link from "next/link";
// import { Plus, Edit, Trash2, Sparkles } from "lucide-react";
// import { Id } from "@/convex/_generated/dataModel";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
// import { Card, CardContent } from "@/components/ui/card";
// import { motion, AnimatePresence } from "framer-motion";

// const tableVariants = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: {
//       staggerChildren: 0.03,
//     },
//   },
// };

// const rowVariants = {
//   hidden: { opacity: 0, x: -20 },
//   visible: {
//     opacity: 1,
//     x: 0,
//     transition: {
//       type: "spring" as const,
//       stiffness: 100,
//     },
//   },
// };

// export default function TemplatesList() {
//   const { user } = useUser();

//   // First get the company
//   const company = useQuery(api.companies.getCompanyByUser, {
//     userId: user?.id || "",
//   });

//   // Then get templates using companyId
//   const templates = useQuery(
//     api.templates.getTemplatesByCompany,
//     company?._id ? { companyId: company._id } : "skip"
//   );

//   const deleteTemplate = useMutation(api.templates.deleteTemplate);

//   const handleDelete = async (id: Id<"templates">) => {
//     if (!company) return;
//     try {
//       await deleteTemplate({ id, companyId: company._id });
//       toast.success("Template deleted successfully!");
//     } catch (error) {
//       console.error("Failed to delete template:", error);
//       toast.error("Failed to delete template. Please try again.");
//     }
//   };

//   if (!user || company === undefined || templates === undefined) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20">
//         <div className="max-w-7xl mx-auto p-6 space-y-8 pt-24">
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="space-y-6"
//           >
//             <div className="h-12 w-1/2 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg animate-pulse" />
//             <div className="h-96 bg-gradient-to-br from-white to-slate-100 rounded-xl shadow-lg animate-pulse" />
//           </motion.div>
//         </div>
//       </div>
//     );
//   }

//   if (company === null) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20">
//         <div className="max-w-7xl mx-auto p-6 space-y-8 pt-24">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.15, duration: 0.6 }}
//             whileHover={{ y: -2 }}
//             className="transition-all duration-300"
//           >
//             <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 overflow-hidden group">
//               <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
//               <CardContent className="p-6 text-center">
//                 <p className="text-slate-700 mb-4 text-lg">
//                   Please set up your company first.
//                 </p>
//                 <motion.div
//                   initial={{ opacity: 0, x: 20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ delay: 0.3, duration: 0.5 }}
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                 >
//                   <Link href="/dashboard/settings">
//                     <Button className="group relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300">
//                       <motion.div
//                         className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent pointer-events-none"
//                         initial={{ x: "-100%" }}
//                         whileHover={{ x: "100%" }}
//                         transition={{ duration: 0.5 }}
//                       />
//                       Go to Settings
//                     </Button>
//                   </Link>
//                 </motion.div>
//               </CardContent>
//             </Card>
//           </motion.div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20">
//       <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 pt-24 pb-16 mt-20">
//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
//           className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
//         >
//           <div className="relative">
//             <motion.div
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.2, duration: 0.5 }}
//             >
//               <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
//                 Invoice Templates
//               </h1>
//               <p className="text-slate-600 mt-2 text-sm sm:text-base">
//                 Customize your invoice designs and create new templates
//               </p>
//             </motion.div>
//             <motion.div
//               className="absolute -top-6 -right-6 text-yellow-400"
//               animate={{
//                 rotate: [0, 10, -10, 10, 0],
//                 scale: [1, 1.1, 1, 1.1, 1],
//               }}
//               transition={{
//                 duration: 2,
//                 repeat: Infinity,
//                 repeatDelay: 3,
//               }}
//             >
//               <Sparkles size={24} />
//             </motion.div>
//           </div>
//           <motion.div
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: 0.3, duration: 0.5 }}
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             <Link href="/dashboard/templates/create">
//               <Button
//                 size="lg"
//                 className="group relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
//               >
//                 <motion.div
//                   className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent pointer-events-none"
//                   initial={{ x: "-100%" }}
//                   whileHover={{ x: "100%" }}
//                   transition={{ duration: 0.5 }}
//                 />
//                 <Plus
//                   size={16}
//                   className="group-hover:rotate-90 transition-transform duration-300"
//                 />
//                 Create New Template
//               </Button>
//             </Link>
//           </motion.div>
//         </motion.div>

//         <AnimatePresence mode="popLayout">
//           {templates?.length === 0 ? (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//             >
//               <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 overflow-hidden group">
//                 <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
//                 <CardContent className="py-12 text-center">
//                   <motion.div
//                     initial={{ scale: 0 }}
//                     animate={{ scale: 1 }}
//                     transition={{ delay: 0.2, type: "spring" }}
//                     className="inline-block p-6 bg-gradient-to-br from-slate-50 to-indigo-50 rounded-full mb-6"
//                   >
//                     <Plus size={64} className="text-indigo-500" />
//                   </motion.div>
//                   <motion.h3
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: 0.3 }}
//                     className="text-2xl font-semibold text-slate-900 mb-2"
//                   >
//                     No Templates Yet
//                   </motion.h3>
//                   <motion.p
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: 0.4 }}
//                     className="text-slate-500 mb-6 max-w-md mx-auto"
//                   >
//                     Create your first invoice template to get started!
//                   </motion.p>
//                   <motion.div
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: 0.5 }}
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                   >
//                     <Link href="/dashboard/templates/create">
//                       <Button
//                         size="lg"
//                         className="group relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 mx-auto"
//                       >
//                         <motion.div
//                           className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent pointer-events-none"
//                           initial={{ x: "-100%" }}
//                           whileHover={{ x: "100%" }}
//                           transition={{ duration: 0.5 }}
//                         />
//                         <Plus
//                           size={16}
//                           className="group-hover:rotate-90 transition-transform duration-300"
//                         />
//                         Create Your First Template
//                       </Button>
//                     </Link>
//                   </motion.div>
//                 </CardContent>
//               </Card>
//             </motion.div>
//           ) : (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.45, duration: 0.6 }}
//               whileHover={{ y: -4 }}
//               className="transition-all duration-300"
//             >
//               <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 overflow-hidden group">
//                 <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
//                 <CardContent className="p-0 relative">
//                   <motion.div
//                     variants={tableVariants}
//                     initial="hidden"
//                     animate="visible"
//                     className="overflow-x-auto"
//                   >
//                     <Table>
//                       <TableHeader>
//                         <TableRow className="bg-slate-50 hover:bg-slate-50 border-b-2 border-slate-200">
//                           <TableHead className="font-semibold text-slate-700">
//                             Name
//                           </TableHead>
//                           <TableHead className="font-semibold text-slate-700">
//                             Description
//                           </TableHead>
//                           <TableHead className="font-semibold text-slate-700">
//                             Header Style
//                           </TableHead>
//                           <TableHead className="font-semibold text-slate-700">
//                             Logo Position
//                           </TableHead>
//                           <TableHead className="font-semibold text-slate-700">
//                             Default
//                           </TableHead>
//                           <TableHead className="text-right font-semibold text-slate-700">
//                             Actions
//                           </TableHead>
//                         </TableRow>
//                       </TableHeader>
//                       <TableBody>
//                         <AnimatePresence mode="popLayout">
//                           {templates?.map((template, index) => (
//                             <motion.tr
//                               key={template._id}
//                               variants={rowVariants}
//                               initial="hidden"
//                               animate="visible"
//                               exit={{ opacity: 0, x: -20 }}
//                               custom={index}
//                               whileHover={{
//                                 backgroundColor: "rgba(99, 102, 241, 0.03)",
//                                 scale: 1.005,
//                               }}
//                               className="border-b border-slate-100 transition-colors"
//                             >
//                               <TableCell className="font-medium text-slate-900">
//                                 {template.name}
//                               </TableCell>
//                               <TableCell className="text-slate-600">
//                                 {template.description || "No description"}
//                               </TableCell>
//                               <TableCell className="capitalize text-slate-600">
//                                 {template.layout.headerStyle}
//                               </TableCell>
//                               <TableCell className="capitalize text-slate-600">
//                                 {template.layout.logoPosition}
//                               </TableCell>
//                               <TableCell>
//                                 {template.isDefault ? (
//                                   <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                                     Default
//                                   </span>
//                                 ) : (
//                                   <span className="text-slate-400">No</span>
//                                 )}
//                               </TableCell>
//                               <TableCell>
//                                 <div className="flex justify-end space-x-2">
//                                   <motion.div
//                                     whileHover={{ scale: 1.1 }}
//                                     whileTap={{ scale: 0.9 }}
//                                   >
//                                     <Link
//                                       href={`/dashboard/templates/${template._id}`}
//                                     >
//                                       <Button
//                                         variant="ghost"
//                                         size="icon"
//                                         className="h-8 w-8 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
//                                       >
//                                         <Edit size={14} />
//                                       </Button>
//                                     </Link>
//                                   </motion.div>
//                                   <motion.div
//                                     whileHover={{ scale: 1.1 }}
//                                     whileTap={{ scale: 0.9 }}
//                                   >
//                                     <AlertDialog>
//                                       <AlertDialogTrigger asChild>
//                                         <Button
//                                           variant="ghost"
//                                           size="icon"
//                                           className="h-8 w-8 hover:bg-rose-50 hover:text-rose-600 transition-colors"
//                                         >
//                                           <Trash2 size={14} />
//                                         </Button>
//                                       </AlertDialogTrigger>
//                                       <AlertDialogContent>
//                                         <AlertDialogHeader>
//                                           <AlertDialogTitle>
//                                             Are you sure?
//                                           </AlertDialogTitle>
//                                           <AlertDialogDescription>
//                                             This will permanently delete the
//                                             template "{template.name}". This
//                                             action cannot be undone.
//                                           </AlertDialogDescription>
//                                         </AlertDialogHeader>
//                                         <AlertDialogFooter>
//                                           <AlertDialogCancel>
//                                             Cancel
//                                           </AlertDialogCancel>
//                                           <AlertDialogAction
//                                             onClick={() =>
//                                               handleDelete(template._id)
//                                             }
//                                             className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
//                                           >
//                                             Delete
//                                           </AlertDialogAction>
//                                         </AlertDialogFooter>
//                                       </AlertDialogContent>
//                                     </AlertDialog>
//                                   </motion.div>
//                                 </div>
//                               </TableCell>
//                             </motion.tr>
//                           ))}
//                         </AnimatePresence>
//                       </TableBody>
//                     </Table>
//                   </motion.div>
//                 </CardContent>
//               </Card>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import Link from "next/link";
import { Plus, Edit, Trash2, Sparkles } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const tableVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
    },
  },
};

const rowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
    },
  },
};

export default function TemplatesList() {
  const { user } = useUser();

  const companies = useQuery(api.companies.getCompaniesByUser, {});

  const [selectedCompanyId, setSelectedCompanyId] =
    useState<Id<"companies"> | null>(null);

  useEffect(() => {
    if (companies && companies.length > 0 && !selectedCompanyId) {
      setSelectedCompanyId(companies[0]._id);
    }
  }, [companies, selectedCompanyId]);

  const templates = useQuery(
    api.templates.getTemplatesByCompany,
    selectedCompanyId ? { companyId: selectedCompanyId } : "skip"
  );

  const deleteTemplate = useMutation(api.templates.deleteTemplate);

  const handleDelete = async (id: Id<"templates">) => {
    if (!selectedCompanyId) return;
    try {
      await deleteTemplate({ id, companyId: selectedCompanyId });
      toast.success("Template deleted successfully!");
    } catch (error) {
      console.error("Failed to delete template:", error);
      toast.error("Failed to delete template. Please try again.");
    }
  };

  if (!user || companies === undefined) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20">
        <div className="max-w-7xl mx-auto p-6 space-y-8 pt-24">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="h-12 w-1/2 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg animate-pulse" />
            <div className="h-96 bg-gradient-to-br from-white to-slate-100 rounded-xl shadow-lg animate-pulse" />
          </motion.div>
        </div>
      </div>
    );
  }

  if (companies.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20">
        <div className="max-w-7xl mx-auto p-6 space-y-8 pt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            whileHover={{ y: -2 }}
            className="transition-all duration-300"
          >
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <CardContent className="p-6 text-center">
                <p className="text-slate-700 mb-4 text-lg">
                  Please set up your company first.
                </p>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href="/dashboard/settings">
                    <Button className="group relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300">
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent pointer-events-none"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.5 }}
                      />
                      Go to Settings
                    </Button>
                  </Link>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 pt-24 pb-16 mt-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Invoice Templates
              </h1>
              <p className="text-slate-600 mt-2 text-sm sm:text-base">
                Customize your invoice designs and create new templates
              </p>
            </motion.div>
            <motion.div
              className="absolute -top-6 -right-6 text-yellow-400"
              animate={{
                rotate: [0, 10, -10, 10, 0],
                scale: [1, 1.1, 1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
              }}
            >
              <Sparkles size={24} />
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href={`/dashboard/templates/create?companyId=${selectedCompanyId || ""}`}
            >
              <Button
                size="lg"
                className="group relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent pointer-events-none"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.5 }}
                />
                <Plus
                  size={16}
                  className="group-hover:rotate-90 transition-transform duration-300"
                />
                Create New Template
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Company Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="max-w-md"
        >
          <label className="mb-2 text-sm font-medium text-slate-700 block">
            Select Company
          </label>
          <Select
            value={selectedCompanyId || ""}
            onValueChange={(value) =>
              setSelectedCompanyId(value as Id<"companies">)
            }
          >
            <SelectTrigger className="border-slate-200 focus:ring-2 focus:ring-indigo-500/20 hover:border-indigo-300 transition-all duration-200">
              <SelectValue placeholder="Select a company" />
            </SelectTrigger>
            <SelectContent>
              {companies?.map((c) => (
                <SelectItem key={c._id} value={c._id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        <AnimatePresence mode="popLayout">
          {selectedCompanyId && templates?.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <CardContent className="py-12 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="inline-block p-6 bg-gradient-to-br from-slate-50 to-indigo-50 rounded-full mb-6"
                  >
                    <Plus size={64} className="text-indigo-500" />
                  </motion.div>
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl font-semibold text-slate-900 mb-2"
                  >
                    No Template for this Company
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-slate-500 mb-6 max-w-md mx-auto"
                  >
                    Create a template for this company to get started!
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href={`/dashboard/templates/create?companyId=${selectedCompanyId || ""}`}
                    >
                      <Button
                        size="lg"
                        className="group relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 mx-auto"
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent pointer-events-none"
                          initial={{ x: "-100%" }}
                          whileHover={{ x: "100%" }}
                          transition={{ duration: 0.5 }}
                        />
                        <Plus
                          size={16}
                          className="group-hover:rotate-90 transition-transform duration-300"
                        />
                        Create Template
                      </Button>
                    </Link>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              whileHover={{ y: -4 }}
              className="transition-all duration-300"
            >
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <CardContent className="p-0 relative">
                  <motion.div
                    variants={tableVariants}
                    initial="hidden"
                    animate="visible"
                    className="overflow-x-auto"
                  >
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-slate-50 hover:bg-slate-50 border-b-2 border-slate-200">
                          <TableHead className="font-semibold text-slate-700">
                            Name
                          </TableHead>
                          <TableHead className="font-semibold text-slate-700">
                            Description
                          </TableHead>
                          <TableHead className="font-semibold text-slate-700">
                            Header Style
                          </TableHead>
                          <TableHead className="font-semibold text-slate-700">
                            Logo Position
                          </TableHead>
                          <TableHead className="font-semibold text-slate-700">
                            Default
                          </TableHead>
                          <TableHead className="text-right font-semibold text-slate-700">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <AnimatePresence mode="popLayout">
                          {templates?.map((template, index) => (
                            <motion.tr
                              key={template._id}
                              variants={rowVariants}
                              initial="hidden"
                              animate="visible"
                              exit={{ opacity: 0, x: -20 }}
                              custom={index}
                              whileHover={{
                                backgroundColor: "rgba(99, 102, 241, 0.03)",
                                scale: 1.005,
                              }}
                              className="border-b border-slate-100 transition-colors"
                            >
                              <TableCell className="font-medium text-slate-900">
                                {template.name}
                              </TableCell>
                              <TableCell className="text-slate-600">
                                {template.description || "No description"}
                              </TableCell>
                              <TableCell className="capitalize text-slate-600">
                                {template.layout.headerStyle}
                              </TableCell>
                              <TableCell className="capitalize text-slate-600">
                                {template.layout.logoPosition}
                              </TableCell>
                              <TableCell>
                                {template.isDefault ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Default
                                  </span>
                                ) : (
                                  <span className="text-slate-400">No</span>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="flex justify-end space-x-2">
                                  <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    <Link
                                      href={`/dashboard/templates/${template._id}`}
                                    >
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                                      >
                                        <Edit size={14} />
                                      </Button>
                                    </Link>
                                  </motion.div>
                                  <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-8 w-8 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                                        >
                                          <Trash2 size={14} />
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>
                                            Are you sure?
                                          </AlertDialogTitle>
                                          <AlertDialogDescription>
                                            This will permanently delete the
                                            template "{template.name}". This
                                            action cannot be undone.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>
                                            Cancel
                                          </AlertDialogCancel>
                                          <AlertDialogAction
                                            onClick={() =>
                                              handleDelete(template._id)
                                            }
                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                          >
                                            Delete
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </motion.div>
                                </div>
                              </TableCell>
                            </motion.tr>
                          ))}
                        </AnimatePresence>
                      </TableBody>
                    </Table>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
