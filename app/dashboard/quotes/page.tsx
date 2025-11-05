// // app/dashboard/quotes/page.tsx
// "use client";

// import { useState, useEffect, useMemo } from "react";
// import { useUser } from "@clerk/nextjs";
// import { useQuery, useMutation } from "convex/react";
// import { api } from "@/convex/_generated/api";
// import { motion, AnimatePresence } from "framer-motion";
// import { formatCurrency } from "@/lib/currency";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { toast } from "sonner";
// import { useRouter } from "next/navigation";
// import {
//   Plus,
//   Search,
//   Edit,
//   Eye,
//   Trash2,
//   FileText,
//   X,
//   Sparkles,
//   Filter,
//   DollarSign,
//   TrendingUp,
//   CheckCircle,
//   AlertCircle,
// } from "lucide-react";
// import { Id, Doc } from "@/convex/_generated/dataModel";

// const StatusBadge = ({ status }: { status: Doc<"quotes">["status"] }) => {
//   const colors: Record<Doc<"quotes">["status"], string> = {
//     draft: "bg-gray-500",
//     sent: "bg-blue-500",
//     accepted: "bg-green-500",
//     rejected: "bg-red-500",
//     expired: "bg-yellow-500",
//     converted: "bg-purple-500",
//   };
//   return <Badge className={colors[status]}>{status}</Badge>;
// };

// export default function QuotesPage() {
//   const { user } = useUser();
//   const router = useRouter();
//   const quotes = useQuery(api.quotes.getQuotesByUser) ?? [];
//   const companies = useQuery(
//     api.companies.getCompaniesByUser,
//     user?.id ? { userId: user.id } : "skip"
//   );

//   const deleteQuote = useMutation(api.quotes.deleteQuote);
//   const updateQuote = useMutation(api.quotes.updateQuote);
//   const createQuote = useMutation(api.quotes.createQuote);
//   const convertQuote = useMutation(api.quotes.convertQuoteToInvoice);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState<string>("all");
//   const [selectedQuotes, setSelectedQuotes] = useState<Set<Id<"quotes">>>(
//     new Set()
//   );
//   const [showCreateForm, setShowCreateForm] = useState(false);
//   const [selectedCompanyId, setSelectedCompanyId] =
//     useState<Id<"companies"> | null>(null);

//   // Form state for creating quotes
//   const [formData, setFormData] = useState({
//     quoteNumber: `QUO-${Date.now()}`,
//     companyId: "" as Id<"companies">,
//     templateId: "" as Id<"templates">,
//     customer: {
//       name: "",
//       email: "",
//       address: "",
//       phone: "",
//     },
//     items: [
//       {
//         id: crypto.randomUUID(),
//         description: "",
//         quantity: 1,
//         price: 0,
//       },
//     ],
//     issueDate: new Date().toISOString().split("T")[0],
//     validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
//       .toISOString()
//       .split("T")[0],
//     currency: "ZAR",
//     notes: "",
//     discount: 0,
//     discountType: "percentage" as "percentage" | "fixed",
//   });

//   const templates = useQuery(
//     api.templates.getTemplatesByCompany,
//     formData.companyId ? { companyId: formData.companyId } : "skip"
//   );

//   useEffect(() => {
//     if (companies && companies.length > 0 && !formData.companyId) {
//       setFormData((prev) => ({ ...prev, companyId: companies[0]._id }));
//     }
//   }, [companies]);

//   useEffect(() => {
//     if (templates && templates.length > 0 && !formData.templateId) {
//       setFormData((prev) => ({ ...prev, templateId: templates[0]._id }));
//     }
//   }, [templates]);

//   const filteredQuotes = useMemo(() => {
//     let filtered = quotes;
//     if (searchTerm) {
//       filtered = filtered.filter(
//         (q) =>
//           q.quoteNumber.includes(searchTerm) ||
//           q.customer.name.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }
//     if (statusFilter !== "all") {
//       filtered = filtered.filter((q) => q.status === statusFilter);
//     }
//     if (selectedCompanyId) {
//       filtered = filtered.filter((q) => q.companyId === selectedCompanyId);
//     }
//     return filtered;
//   }, [quotes, searchTerm, statusFilter, selectedCompanyId]);

//   const monthlyStats = useMemo(() => {
//     const totalQuotes = filteredQuotes.length;
//     const totalValue = filteredQuotes.reduce((sum, q) => sum + q.total, 0);
//     const acceptedValue = filteredQuotes
//       .filter((q) => q.status === "accepted")
//       .reduce((sum, q) => sum + q.total, 0);
//     const expiredCount = filteredQuotes.filter(
//       (q) => q.status === "expired"
//     ).length;
//     return {
//       totalQuotes,
//       totalValue,
//       acceptedValue,
//       expiredCount,
//     };
//   }, [filteredQuotes]);

//   const handleAddItem = () => {
//     setFormData((prev) => ({
//       ...prev,
//       items: [
//         ...prev.items,
//         { id: crypto.randomUUID(), description: "", quantity: 1, price: 0 },
//       ],
//     }));
//   };

//   const handleRemoveItem = (id: string) => {
//     setFormData((prev) => ({
//       ...prev,
//       items: prev.items.filter((item) => item.id !== id),
//     }));
//   };

//   const handleItemChange = (id: string, field: string, value: any) => {
//     setFormData((prev) => ({
//       ...prev,
//       items: prev.items.map((item) =>
//         item.id === id ? { ...item, [field]: value } : item
//       ),
//     }));
//   };

//   const calculateTotals = () => {
//     const subtotal = formData.items.reduce(
//       (sum, item) => sum + item.quantity * item.price,
//       0
//     );
//     const discountAmount =
//       formData.discountType === "percentage"
//         ? (subtotal * formData.discount) / 100
//         : formData.discount;
//     const afterDiscount = subtotal - discountAmount;
//     const tax = afterDiscount * 0.15; // 15% VAT
//     const total = afterDiscount + tax;
//     return { subtotal, tax, total };
//   };

//   const handleCreateQuote = async () => {
//     if (
//       !formData.customer.name ||
//       !formData.customer.email ||
//       formData.items.length === 0
//     ) {
//       toast.error("Please fill in all required fields");
//       return;
//     }

//     try {
//       const { subtotal, tax, total } = calculateTotals();
//       await createQuote({
//         ...formData,
//         items: formData.items.map((item) => ({
//           ...item,
//           total: item.quantity * item.price,
//         })),
//         subtotal,
//         tax,
//         total,
//         status: "draft",
//       });
//       toast.success("Quote created successfully!");
//       setShowCreateForm(false);
//       setFormData({
//         quoteNumber: `QUO-${Date.now()}`,
//         companyId: companies?.[0]?._id || ("" as Id<"companies">),
//         templateId: "" as Id<"templates">,
//         customer: { name: "", email: "", address: "", phone: "" },
//         items: [
//           { id: crypto.randomUUID(), description: "", quantity: 1, price: 0 },
//         ],
//         issueDate: new Date().toISOString().split("T")[0],
//         validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
//           .toISOString()
//           .split("T")[0],
//         currency: "ZAR",
//         notes: "",
//         discount: 0,
//         discountType: "percentage",
//       });
//     } catch (error) {
//       toast.error("Failed to create quote");
//     }
//   };

//   const handleDeleteQuote = async (id: Id<"quotes">) => {
//     try {
//       await deleteQuote({ id });
//       toast.success("Quote deleted");
//     } catch {
//       toast.error("Failed to delete quote");
//     }
//   };

//   const handleConvertQuote = async (id: Id<"quotes">) => {
//     try {
//       await convertQuote({ quoteId: id });
//       toast.success("Quote converted to invoice");
//     } catch {
//       toast.error("Failed to convert quote");
//     }
//   };

//   const { subtotal, tax, total } = calculateTotals();

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 mt-20">
//       <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 pt-24 pb-16">
//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="flex justify-between items-center"
//         >
//           <div className="relative">
//             <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
//               Quotes Dashboard
//             </h1>
//             <p className="text-slate-600 mt-2">Manage your business quotes</p>
//             <Sparkles
//               className="absolute -top-6 -right-6 text-yellow-400"
//               size={24}
//             />
//           </div>
//           <Button
//             onClick={() => setShowCreateForm(true)}
//             className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
//           >
//             <Plus size={16} className="mr-2" /> Create Quote
//           </Button>
//         </motion.div>

//         {/* Filters */}
//         <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
//           <CardContent className="p-6">
//             <div className="flex flex-wrap gap-4">
//               <div className="flex-1 min-w-[200px]">
//                 <Label className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
//                   <Search size={16} className="text-blue-500" />
//                   Search
//                 </Label>
//                 <Input
//                   placeholder="Search quotes..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="border-slate-200"
//                 />
//               </div>
//               <div className="flex-shrink-0">
//                 <Label className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
//                   <Filter size={16} className="text-purple-500" />
//                   Status
//                 </Label>
//                 <Select value={statusFilter} onValueChange={setStatusFilter}>
//                   <SelectTrigger className="w-36">
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All</SelectItem>
//                     <SelectItem value="draft">Draft</SelectItem>
//                     <SelectItem value="sent">Sent</SelectItem>
//                     <SelectItem value="accepted">Accepted</SelectItem>
//                     <SelectItem value="rejected">Rejected</SelectItem>
//                     <SelectItem value="expired">Expired</SelectItem>
//                     <SelectItem value="converted">Converted</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               {companies && companies.length > 1 && (
//                 <div className="flex-shrink-0">
//                   <Label className="text-sm font-medium text-slate-700 mb-2">
//                     Company
//                   </Label>
//                   <Select
//                     value={selectedCompanyId || "all"}
//                     onValueChange={(value) =>
//                       setSelectedCompanyId(
//                         value === "all" ? null : (value as Id<"companies">)
//                       )
//                     }
//                   >
//                     <SelectTrigger className="w-48">
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="all">All Companies</SelectItem>
//                       {companies.map((company) => (
//                         <SelectItem key={company._id} value={company._id}>
//                           {company.name}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               )}
//             </div>
//           </CardContent>
//         </Card>

//         {/* Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//           <motion.div whileHover={{ y: -8, scale: 1.02 }}>
//             <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
//               <CardContent className="p-6">
//                 <div className="flex items-center gap-3 mb-4">
//                   <FileText size={24} />
//                 </div>
//                 <h3 className="text-3xl font-bold">
//                   {monthlyStats.totalQuotes}
//                 </h3>
//                 <p className="text-blue-100 text-sm">Total Quotes</p>
//               </CardContent>
//             </Card>
//           </motion.div>
//           <motion.div whileHover={{ y: -8, scale: 1.02 }}>
//             <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
//               <CardContent className="p-6">
//                 <div className="flex items-center gap-3 mb-4">
//                   <DollarSign size={24} />
//                 </div>
//                 <h3 className="text-3xl font-bold">
//                   {formatCurrency(monthlyStats.totalValue)}
//                 </h3>
//                 <p className="text-emerald-100 text-sm">Total Value</p>
//               </CardContent>
//             </Card>
//           </motion.div>
//           <motion.div whileHover={{ y: -8, scale: 1.02 }}>
//             <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
//               <CardContent className="p-6">
//                 <div className="flex items-center gap-3 mb-4">
//                   <CheckCircle size={24} />
//                 </div>
//                 <h3 className="text-3xl font-bold">
//                   {formatCurrency(monthlyStats.acceptedValue)}
//                 </h3>
//                 <p className="text-purple-100 text-sm">Accepted Value</p>
//               </CardContent>
//             </Card>
//           </motion.div>
//           <motion.div whileHover={{ y: -8, scale: 1.02 }}>
//             <Card className="border-0 shadow-lg bg-gradient-to-br from-rose-500 to-rose-600 text-white">
//               <CardContent className="p-6">
//                 <div className="flex items-center gap-3 mb-4">
//                   <AlertCircle size={24} />
//                 </div>
//                 <h3 className="text-3xl font-bold">
//                   {monthlyStats.expiredCount}
//                 </h3>
//                 <p className="text-rose-100 text-sm">Expired</p>
//               </CardContent>
//             </Card>
//           </motion.div>
//         </div>

//         {/* Quotes Table */}
//         <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
//           <CardHeader className="border-b border-slate-100">
//             <CardTitle>Quotes ({filteredQuotes.length})</CardTitle>
//           </CardHeader>
//           <CardContent className="p-0">
//             <Table>
//               <TableHeader>
//                 <TableRow className="bg-slate-50">
//                   <TableHead>Quote #</TableHead>
//                   <TableHead>Customer</TableHead>
//                   <TableHead>Amount</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead>Issue Date</TableHead>
//                   <TableHead>Valid Until</TableHead>
//                   <TableHead className="text-right">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {filteredQuotes.map((quote) => (
//                   <TableRow key={quote._id} className="hover:bg-indigo-50/30">
//                     <TableCell className="font-mono">
//                       {quote.quoteNumber}
//                     </TableCell>
//                     <TableCell>
//                       <div>
//                         <div className="font-medium">{quote.customer.name}</div>
//                         <div className="text-xs text-slate-500">
//                           {quote.customer.email}
//                         </div>
//                       </div>
//                     </TableCell>
//                     <TableCell className="font-semibold">
//                       {formatCurrency(quote.total)}
//                     </TableCell>
//                     <TableCell>
//                       <StatusBadge status={quote.status} />
//                     </TableCell>
//                     <TableCell>
//                       {new Date(quote.issueDate).toLocaleDateString()}
//                     </TableCell>
//                     <TableCell>
//                       {new Date(quote.validUntil).toLocaleDateString()}
//                     </TableCell>
//                     <TableCell>
//                       <div className="flex justify-end gap-1">
//                         <Button
//                           variant="ghost"
//                           size="icon"
//                           onClick={() =>
//                             router.push(`/dashboard/quotes/${quote._id}`)
//                           }
//                           className="h-8 w-8"
//                         >
//                           <Eye size={14} />
//                         </Button>
//                         <Button
//                           variant="ghost"
//                           size="icon"
//                           onClick={() => handleConvertQuote(quote._id)}
//                           className="h-8 w-8"
//                         >
//                           <FileText size={14} />
//                         </Button>
//                         <Button
//                           variant="ghost"
//                           size="icon"
//                           onClick={() => handleDeleteQuote(quote._id)}
//                           className="h-8 w-8 text-red-600"
//                         >
//                           <Trash2 size={14} />
//                         </Button>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//             {filteredQuotes.length === 0 && (
//               <div className="text-center py-16">
//                 <FileText size={64} className="mx-auto text-slate-400 mb-4" />
//                 <h3 className="text-xl font-semibold text-slate-900 mb-2">
//                   No quotes found
//                 </h3>
//                 <p className="text-slate-500 mb-6">
//                   Create your first quote to get started
//                 </p>
//                 <Button onClick={() => setShowCreateForm(true)}>
//                   <Plus size={16} className="mr-2" />
//                   Create Quote
//                 </Button>
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         {/* Create Quote Modal */}
//         <AnimatePresence>
//           {showCreateForm && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//               onClick={() => setShowCreateForm(false)}
//             >
//               <motion.div
//                 initial={{ scale: 0.9, y: 20 }}
//                 animate={{ scale: 1, y: 0 }}
//                 exit={{ scale: 0.9, y: 20 }}
//                 onClick={(e) => e.stopPropagation()}
//                 className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto"
//               >
//                 <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center z-10">
//                   <h2 className="text-2xl font-bold text-slate-900">
//                     Create New Quote
//                   </h2>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     onClick={() => setShowCreateForm(false)}
//                   >
//                     <X size={20} />
//                   </Button>
//                 </div>
//                 <div className="p-6 space-y-6">
//                   {/* Company & Template Selection */}
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <Label>Company</Label>
//                       <Select
//                         value={formData.companyId}
//                         onValueChange={(value) =>
//                           setFormData((prev) => ({
//                             ...prev,
//                             companyId: value as Id<"companies">,
//                             templateId: "" as Id<"templates">,
//                           }))
//                         }
//                       >
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select company" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {companies?.map((company) => (
//                             <SelectItem key={company._id} value={company._id}>
//                               {company.name}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </div>
//                     <div>
//                       <Label>Template</Label>
//                       <Select
//                         value={formData.templateId}
//                         onValueChange={(value) =>
//                           setFormData((prev) => ({
//                             ...prev,
//                             templateId: value as Id<"templates">,
//                           }))
//                         }
//                       >
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select template" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {templates?.map((template) => (
//                             <SelectItem key={template._id} value={template._id}>
//                               {template.name}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </div>
//                   </div>

//                   {/* Customer Info */}
//                   <div className="space-y-4">
//                     <h3 className="text-lg font-semibold">
//                       Customer Information
//                     </h3>
//                     <div className="grid grid-cols-2 gap-4">
//                       <div>
//                         <Label>Customer Name *</Label>
//                         <Input
//                           value={formData.customer.name}
//                           onChange={(e) =>
//                             setFormData((prev) => ({
//                               ...prev,
//                               customer: {
//                                 ...prev.customer,
//                                 name: e.target.value,
//                               },
//                             }))
//                           }
//                         />
//                       </div>
//                       <div>
//                         <Label>Email *</Label>
//                         <Input
//                           type="email"
//                           value={formData.customer.email}
//                           onChange={(e) =>
//                             setFormData((prev) => ({
//                               ...prev,
//                               customer: {
//                                 ...prev.customer,
//                                 email: e.target.value,
//                               },
//                             }))
//                           }
//                         />
//                       </div>
//                       <div>
//                         <Label>Address</Label>
//                         <Input
//                           value={formData.customer.address}
//                           onChange={(e) =>
//                             setFormData((prev) => ({
//                               ...prev,
//                               customer: {
//                                 ...prev.customer,
//                                 address: e.target.value,
//                               },
//                             }))
//                           }
//                         />
//                       </div>
//                       <div>
//                         <Label>Phone</Label>
//                         <Input
//                           value={formData.customer.phone}
//                           onChange={(e) =>
//                             setFormData((prev) => ({
//                               ...prev,
//                               customer: {
//                                 ...prev.customer,
//                                 phone: e.target.value,
//                               },
//                             }))
//                           }
//                         />
//                       </div>
//                     </div>
//                   </div>

//                   {/* Items */}
//                   <div className="space-y-4">
//                     <div className="flex justify-between items-center">
//                       <h3 className="text-lg font-semibold">Items</h3>
//                       <Button
//                         type="button"
//                         variant="outline"
//                         size="sm"
//                         onClick={handleAddItem}
//                       >
//                         <Plus size={16} className="mr-1" /> Add Item
//                       </Button>
//                     </div>
//                     {formData.items.map((item, index) => (
//                       <div
//                         key={item.id}
//                         className="grid grid-cols-12 gap-3 items-center p-4 border rounded-lg"
//                       >
//                         <div className="col-span-5">
//                           <Input
//                             placeholder="Description"
//                             value={item.description}
//                             onChange={(e) =>
//                               handleItemChange(
//                                 item.id,
//                                 "description",
//                                 e.target.value
//                               )
//                             }
//                           />
//                         </div>
//                         <div className="col-span-2">
//                           <Input
//                             type="number"
//                             placeholder="Qty"
//                             min="1"
//                             value={item.quantity}
//                             onChange={(e) =>
//                               handleItemChange(
//                                 item.id,
//                                 "quantity",
//                                 Number(e.target.value)
//                               )
//                             }
//                           />
//                         </div>
//                         <div className="col-span-2">
//                           <Input
//                             type="number"
//                             placeholder="Price"
//                             min="0"
//                             step="0.01"
//                             value={item.price}
//                             onChange={(e) =>
//                               handleItemChange(
//                                 item.id,
//                                 "price",
//                                 Number(e.target.value)
//                               )
//                             }
//                           />
//                         </div>
//                         <div className="col-span-2">
//                           <Input
//                             value={formatCurrency(item.quantity * item.price)}
//                             readOnly
//                             className="bg-slate-50"
//                           />
//                         </div>
//                         <div className="col-span-1">
//                           {formData.items.length > 1 && (
//                             <Button
//                               type="button"
//                               variant="ghost"
//                               size="icon"
//                               onClick={() => handleRemoveItem(item.id)}
//                             >
//                               <Trash2 size={14} className="text-rose-500" />
//                             </Button>
//                           )}
//                         </div>
//                       </div>
//                     ))}
//                   </div>

//                   {/* Totals */}
//                   <div className="flex justify-end">
//                     <div className="w-80 space-y-2 p-4 bg-slate-50 rounded-lg">
//                       <div className="flex justify-between">
//                         <span>Subtotal:</span>
//                         <span className="font-semibold">
//                           {formatCurrency(subtotal)}
//                         </span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span>Tax (15%):</span>
//                         <span className="font-semibold">
//                           {formatCurrency(tax)}
//                         </span>
//                       </div>
//                       <div className="flex justify-between text-xl font-bold pt-2 border-t">
//                         <span>Total:</span>
//                         <span>{formatCurrency(total)}</span>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Notes */}
//                   <div>
//                     <Label>Notes (Optional)</Label>
//                     <Textarea
//                       value={formData.notes}
//                       onChange={(e) =>
//                         setFormData((prev) => ({
//                           ...prev,
//                           notes: e.target.value,
//                         }))
//                       }
//                       rows={3}
//                     />
//                   </div>

//                   {/* Actions */}
//                   <div className="flex justify-end gap-3 pt-4 border-t">
//                     <Button
//                       variant="outline"
//                       onClick={() => setShowCreateForm(false)}
//                     >
//                       Cancel
//                     </Button>
//                     <Button onClick={handleCreateQuote}>Create Quote</Button>
//                   </div>
//                 </div>
//               </motion.div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// }

// app/dashboard/quotes/page.tsx
// app/dashboard/quotes/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import { formatCurrency } from "@/lib/currency";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Eye,
  Trash2,
  FileText,
  X,
  Filter,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Percent,
  Package,
  User,
  Building2,
} from "lucide-react";

import { Id, Doc } from "@/convex/_generated/dataModel";

/* ------------------------------------------------- Types ------------------------------------------------- */
type QuoteItem = {
  id: string;
  description: string;
  quantity: number;
  price: number;
};

type QuoteFormData = {
  quoteNumber: string;
  companyId: Id<"companies">;
  templateId: Id<"templates">;
  customer: {
    name: string;
    email: string;
    address: string;
    phone: string;
  };
  items: QuoteItem[];
  issueDate: string;
  validUntil: string;
  currency: string;
  notes: string;
  discount: number;
  discountType: "percentage" | "fixed";
};

/* ------------------------------------------------- Badge ------------------------------------------------- */
const StatusBadge = ({ status }: { status: Doc<"quotes">["status"] }) => {
  const map: Record<Doc<"quotes">["status"], string> = {
    draft: "bg-gray-500",
    sent: "bg-blue-500",
    accepted: "bg-green-500",
    rejected: "bg-red-500",
    expired: "bg-yellow-500",
    converted: "bg-purple-500",
  };
  return <Badge className={`${map[status]} text-white`}>{status}</Badge>;
};

/* ------------------------------------------------- Dashboard ------------------------------------------------- */
export default function QuotesDashboard() {
  const { user } = useUser();
  const router = useRouter();

  const quotes = useQuery(api.quotes.getQuotesByUser) ?? [];
  const companies = useQuery(
    api.companies.getCompaniesByUser,
    user?.id ? { userId: user.id } : "skip"
  );

  const deleteQuote = useMutation(api.quotes.deleteQuote);
  const convertQuote = useMutation(api.quotes.convertQuoteToInvoice);
  const createQuote = useMutation(api.quotes.createQuote);

  /* ---------- filters ---------- */
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [companyFilter, setCompanyFilter] = useState<Id<"companies"> | null>(
    null
  );

  const filtered = useMemo(() => {
    let list = quotes;
    if (search)
      list = list.filter(
        (q) =>
          q.quoteNumber.includes(search) ||
          q.customer.name.toLowerCase().includes(search.toLowerCase())
      );
    if (status !== "all") list = list.filter((q) => q.status === status);
    if (companyFilter) list = list.filter((q) => q.companyId === companyFilter);
    return list;
  }, [quotes, search, status, companyFilter]);

  /* ---------- stats ---------- */
  const stats = useMemo(() => {
    const total = filtered.length;
    const value = filtered.reduce((s, q) => s + q.total, 0);
    const accepted = filtered
      .filter((q) => q.status === "accepted")
      .reduce((s, q) => s + q.total, 0);
    const expired = filtered.filter((q) => q.status === "expired").length;
    return { total, value, accepted, expired };
  }, [filtered]);

  /* ---------- modal state ---------- */
  const [open, setOpen] = useState(false);

  const defaultForm: QuoteFormData = {
    quoteNumber: `QUO-${Date.now()}`,
    companyId: "" as Id<"companies">,
    templateId: "" as Id<"templates">,
    customer: { name: "", email: "", address: "", phone: "" },
    items: [
      { id: crypto.randomUUID(), description: "", quantity: 1, price: 0 },
    ],
    issueDate: new Date().toISOString().split("T")[0],
    validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    currency: "ZAR",
    notes: "",
    discount: 0,
    discountType: "percentage",
  };

  const [form, setForm] = useState<QuoteFormData>(defaultForm);

  const companyTemplates = useQuery(
    api.templates.getTemplatesByCompany,
    form.companyId ? { companyId: form.companyId } : "skip"
  );

  /* auto-select first company & template */
  useEffect(() => {
    if (companies?.length && !form.companyId) {
      setForm((p) => ({ ...p, companyId: companies[0]._id }));
    }
  }, [companies]);

  useEffect(() => {
    if (companyTemplates?.length && !form.templateId) {
      setForm((p) => ({ ...p, templateId: companyTemplates[0]._id }));
    }
  }, [companyTemplates]);

  /* ---------- helpers ---------- */
  const addItem = () =>
    setForm((p) => ({
      ...p,
      items: [
        ...p.items,
        { id: crypto.randomUUID(), description: "", quantity: 1, price: 0 },
      ],
    }));

  const removeItem = (id: string) =>
    setForm((p) => ({ ...p, items: p.items.filter((i) => i.id !== id) }));

  const updateItem = (
    id: string,
    field: keyof QuoteItem,
    value: string | number
  ) =>
    setForm((p) => ({
      ...p,
      items: p.items.map((i) => (i.id === id ? { ...i, [field]: value } : i)),
    }));

  const totals = useMemo(() => {
    const subtotal = form.items.reduce((s, i) => s + i.quantity * i.price, 0);
    const discount =
      form.discountType === "percentage"
        ? (subtotal * form.discount) / 100
        : form.discount;
    const after = subtotal - discount;
    const tax = after * 0.15; // 15% VAT
    return { subtotal, discount, after, tax, total: after + tax };
  }, [form.items, form.discount, form.discountType]);

  const submit = async () => {
    if (
      !form.customer.name ||
      !form.customer.email ||
      !form.items[0].description
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      await createQuote({
        ...form,
        items: form.items.map((i) => ({
          ...i,
          total: i.quantity * i.price,
        })),
        subtotal: totals.subtotal,
        tax: totals.tax,
        total: totals.total,
        status: "draft" as const,
      });

      toast.success("Quote created");
      setOpen(false);
      setForm(defaultForm);
    } catch {
      toast.error("Failed to create quote");
    }
  };

  /* ------------------------------------------------- UI ------------------------------------------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 pt-20 pb-16">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Quotes
            </h1>
            <p className="text-slate-600 mt-1">Create, send & track quotes</p>
          </div>
          <Button
            onClick={() => setOpen(true)}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          >
            <Plus className="mr-2 h-4 w-4" /> New Quote
          </Button>
        </motion.div>

        {/* Filters */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
          <CardContent className="p-5">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <Label className="flex items-center gap-1">
                  <Search className="h-4 w-4" /> Search
                </Label>
                <Input
                  placeholder="Quote # or customer"
                  value={search}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearch(e.target.value)
                  }
                />
              </div>

              <div>
                <Label className="flex items-center gap-1">
                  <Filter className="h-4 w-4" /> Status
                </Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {[
                      "draft",
                      "sent",
                      "accepted",
                      "rejected",
                      "expired",
                      "converted",
                    ].map((s) => (
                      <SelectItem key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {companies && companies.length > 1 && (
                <div>
                  <Label>Company</Label>
                  <Select
                    value={companyFilter ?? "all"}
                    onValueChange={(v: string) =>
                      setCompanyFilter(
                        v === "all" ? null : (v as Id<"companies">)
                      )
                    }
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Companies</SelectItem>
                      {companies.map((c) => (
                        <SelectItem key={c._id} value={c._id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { Icon: FileText, label: "Quotes", value: stats.total },
            {
              Icon: DollarSign,
              label: "Total",
              value: formatCurrency(stats.value),
            },
            {
              Icon: CheckCircle,
              label: "Accepted",
              value: formatCurrency(stats.accepted),
            },
            { Icon: AlertCircle, label: "Expired", value: stats.expired },
          ].map(({ Icon, label, value }, i) => (
            <motion.div key={i} whileHover={{ y: -6, scale: 1.02 }}>
              <Card className="border-0 shadow-md bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                <CardContent className="p-5 flex items-center gap-3">
                  <Icon className="h-6 w-6" />
                  <div>
                    <p className="text-2xl font-bold">{value}</p>
                    <p className="text-xs opacity-90">{label}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Table */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
          <CardHeader className="border-b">
            <CardTitle>Quotes ({filtered.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead>#</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Issued</TableHead>
                  <TableHead>Valid Until</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((q) => (
                  <TableRow key={q._id} className="hover:bg-indigo-50/30">
                    <TableCell className="font-mono">{q.quoteNumber}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{q.customer.name}</div>
                        <div className="text-xs text-slate-500">
                          {q.customer.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCurrency(q.total)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={q.status} />
                    </TableCell>
                    <TableCell>
                      {new Date(q.issueDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(q.validUntil).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            router.push(`/dashboard/quotes/${q._id}`)
                          }
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => convertQuote({ quoteId: q._id })}
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-600"
                          onClick={() => deleteQuote({ id: q._id })}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filtered.length === 0 && (
              <div className="text-center py-16">
                <FileText className="mx-auto h-12 w-12 text-slate-400 mb-3" />
                <p className="text-lg font-medium">No quotes yet</p>
                <Button className="mt-4" onClick={() => setOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Create Quote
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ---------- CREATE MODAL ---------- */}
        {/* ---------- CREATE MODAL ---------- */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
              onClick={() => setOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.94, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.94, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[92vh] overflow-y-auto"
              >
                {/* Sticky Header */}
                <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 flex justify-between items-center rounded-t-2xl">
                  <h2 className="text-2xl font-bold">Create New Quote</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setOpen(false)}
                    className="text-white hover:bg-white/20"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <div className="p-6 space-y-8">
                  {/* ==== COMPANY & TEMPLATE ==== */}
                  <section className="space-y-4">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-indigo-700">
                      <Building2 className="h-5 w-5" /> Company & Template
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-slate-700">
                          Company *
                        </Label>
                        <Select
                          value={form.companyId}
                          onValueChange={(v: string) =>
                            setForm((p) => ({
                              ...p,
                              companyId: v as Id<"companies">,
                              templateId: "" as Id<"templates">,
                            }))
                          }
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Choose your company" />
                          </SelectTrigger>
                          <SelectContent>
                            {companies?.map((c) => (
                              <SelectItem key={c._id} value={c._id}>
                                {c.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-slate-500 mt-1">
                          The company that issues the quote
                        </p>
                      </div>

                      <div>
                        <Label className="text-sm text-slate-700">
                          Template *
                        </Label>
                        <Select
                          value={form.templateId}
                          onValueChange={(v: string) =>
                            setForm((p) => ({
                              ...p,
                              templateId: v as Id<"templates">,
                            }))
                          }
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Pick a visual style" />
                          </SelectTrigger>
                          <SelectContent>
                            {companyTemplates?.map((t) => (
                              <SelectItem key={t._id} value={t._id}>
                                {t.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-slate-500 mt-1">
                          Layout, colors & logo position
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* ==== CUSTOMER ==== */}
                  <section className="space-y-4">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-indigo-700">
                      <User className="h-5 w-5" /> Customer Details
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-slate-700">Name *</Label>
                        <Input
                          placeholder="e.g. Jane Doe"
                          value={form.customer.name}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setForm((p) => ({
                              ...p,
                              customer: { ...p.customer, name: e.target.value },
                            }))
                          }
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label className="text-sm text-slate-700">
                          Email *
                        </Label>
                        <Input
                          type="email"
                          placeholder="jane@example.com"
                          value={form.customer.email}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setForm((p) => ({
                              ...p,
                              customer: {
                                ...p.customer,
                                email: e.target.value,
                              },
                            }))
                          }
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label className="text-sm text-slate-700">
                          Address (optional)
                        </Label>
                        <Input
                          placeholder="123 Main St, Cape Town"
                          value={form.customer.address}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setForm((p) => ({
                              ...p,
                              customer: {
                                ...p.customer,
                                address: e.target.value,
                              },
                            }))
                          }
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label className="text-sm text-slate-700">
                          Phone (optional)
                        </Label>
                        <Input
                          placeholder="+27 82 123 4567"
                          value={form.customer.phone}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setForm((p) => ({
                              ...p,
                              customer: {
                                ...p.customer,
                                phone: e.target.value,
                              },
                            }))
                          }
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </section>

                  {/* ==== LINE ITEMS ==== */}
                  <section className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="flex items-center gap-2 text-lg font-semibold text-indigo-700">
                        <Package className="h-5 w-5" /> Line Items
                      </h3>
                      <Button variant="outline" size="sm" onClick={addItem}>
                        <Plus className="mr-1 h-4 w-4" /> Add Item
                      </Button>
                    </div>

                    {form.items.map((it) => (
                      <div
                        key={it.id}
                        className="grid md:grid-cols-12 gap-3 items-center p-4 border rounded-xl bg-gradient-to-r from-slate-50 to-indigo-50 shadow-sm"
                      >
                        <div className="md:col-span-5">
                          <Input
                            placeholder="e.g. Website design (40 hrs)"
                            value={it.description}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                              updateItem(it.id, "description", e.target.value)
                            }
                          />
                        </div>

                        <div className="md:col-span-2">
                          <Input
                            type="number"
                            min={1}
                            placeholder="Qty"
                            value={it.quantity}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                              updateItem(
                                it.id,
                                "quantity",
                                Number(e.target.value)
                              )
                            }
                          />
                        </div>

                        <div className="md:col-span-2">
                          <Input
                            type="number"
                            min={0}
                            step={0.01}
                            placeholder="Price"
                            value={it.price}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                              updateItem(it.id, "price", Number(e.target.value))
                            }
                          />
                        </div>

                        <div className="md:col-span-2 text-right font-medium text-indigo-700">
                          {formatCurrency(it.quantity * it.price)}
                        </div>

                        <div className="md:col-span-1 text-center">
                          {form.items.length > 1 && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItem(it.id)}
                              className="text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </section>

                  {/* ==== DISCOUNT ==== */}
                  <section className="space-y-4">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-indigo-700">
                      <Percent className="h-5 w-5" /> Discount (optional)
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-sm text-slate-700">Amount</Label>
                        <Input
                          type="number"
                          min={0}
                          placeholder="0"
                          value={form.discount}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setForm((p) => ({
                              ...p,
                              discount: Number(e.target.value),
                            }))
                          }
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label className="text-sm text-slate-700">Type</Label>
                        <Select
                          value={form.discountType}
                          onValueChange={(v: "percentage" | "fixed") =>
                            setForm((p) => ({ ...p, discountType: v }))
                          }
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="percentage">
                              Percentage %
                            </SelectItem>
                            <SelectItem value="fixed">Fixed Amount</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </section>

                  {/* ==== TOTALS ==== */}
                  <section className="flex justify-end">
                    <div className="w-full max-w-md p-5 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-inner space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span className="font-medium">
                          {formatCurrency(totals.subtotal)}
                        </span>
                      </div>

                      {form.discount > 0 && (
                        <div className="flex justify-between text-sm text-red-600">
                          <span>
                            Discount (
                            {form.discountType === "percentage"
                              ? `${form.discount}%`
                              : "fixed"}
                            )
                          </span>
                          <span>-{formatCurrency(totals.discount)}</span>
                        </div>
                      )}

                      <div className="flex justify-between text-sm">
                        <span>VAT (15%)</span>
                        <span className="font-medium">
                          {formatCurrency(totals.tax)}
                        </span>
                      </div>

                      <div className="flex justify-between pt-2 border-t border-indigo-200 font-bold text-lg">
                        <span>Total</span>
                        <span className="text-indigo-700">
                          {formatCurrency(totals.total)}
                        </span>
                      </div>
                    </div>
                  </section>

                  {/* ==== NOTES ==== */}
                  <section>
                    <Label className="text-sm text-slate-700 flex items-center gap-1">
                      <FileText className="h-4 w-4" /> Notes (optional)
                    </Label>
                    <Textarea
                      rows={3}
                      placeholder="Payment terms, delivery timeline, special conditions..."
                      value={form.notes}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setForm((p) => ({ ...p, notes: e.target.value }))
                      }
                      className="mt-1"
                    />
                  </section>

                  {/* ==== ACTIONS ==== */}
                  <div className="flex justify-end gap-3 pt-6 border-t">
                    <Button variant="outline" onClick={() => setOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={submit}
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                    >
                      Create Quote
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
