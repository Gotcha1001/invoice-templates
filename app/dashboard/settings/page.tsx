//RED RABBIT +++++++++++++++++++++++++++++++++++
// "use client";

// import { useState, useEffect } from "react";
// import { useUser } from "@clerk/nextjs";
// import { useMutation, useQuery } from "convex/react";
// import { api } from "@/convex/_generated/api";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import LogoUpload from "@/components/common/LogoUpload";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { toast } from "sonner";
// import { Loader2, Trash2, Edit2 } from "lucide-react";
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
// import { Id } from "@/convex/_generated/dataModel";

// const companySchema = z.object({
//   name: z.string().min(1, "Company name is required"),
//   address: z.string().min(1, "Address is required"),
//   phone: z.string().min(1, "Phone number is required"),
//   email: z.string().email("Invalid email address"),
//   website: z.string().url("Invalid URL").optional().or(z.literal("")),
//   logoUrl: z.string().optional(),
// });

// type CompanyFormData = z.infer<typeof companySchema>;

// export default function Settings() {
//   const { user } = useUser();
//   const companies = useQuery(api.companies.getCompaniesByUser, {
//     userId: user?.id || "",
//   });
//   const createCompany = useMutation(api.companies.createCompany);
//   const updateCompany = useMutation(api.companies.updateCompany);
//   const deleteCompany = useMutation(api.companies.deleteCompany);

//   const [logoUrl, setLogoUrl] = useState<string | null>(null);
//   const [logoPreview, setLogoPreview] = useState<string>("");
//   const [editingCompanyId, setEditingCompanyId] =
//     useState<Id<"companies"> | null>(null);
//   const [isDeleting, setIsDeleting] = useState<Id<"companies"> | null>(null);

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     formState: { errors },
//     reset,
//   } = useForm<CompanyFormData>({
//     resolver: zodResolver(companySchema),
//     defaultValues: {
//       name: "",
//       address: "",
//       phone: "",
//       email: "",
//       website: "",
//       logoUrl: "",
//     },
//   });

//   useEffect(() => {
//     if (editingCompanyId !== null && companies) {
//       const companyToEdit = companies.find((c) => c._id === editingCompanyId);
//       if (companyToEdit) {
//         reset({
//           name: companyToEdit.name,
//           address: companyToEdit.address,
//           phone: companyToEdit.phone,
//           email: companyToEdit.email,
//           website: companyToEdit.website || "",
//           logoUrl: companyToEdit.logoUrl || "",
//         });
//         setLogoUrl(companyToEdit.logoUrl || null);
//         setLogoPreview(companyToEdit.logoUrl || "");
//       } else {
//         reset({
//           name: "",
//           address: "",
//           phone: "",
//           email: "",
//           website: "",
//           logoUrl: "",
//         });
//         setLogoUrl(null);
//         setLogoPreview("");
//       }
//     }
//   }, [editingCompanyId, companies, reset]);

//   const onSubmit = async (data: CompanyFormData) => {
//     if (!user) return;

//     try {
//       if (editingCompanyId) {
//         await updateCompany({
//           id: editingCompanyId,
//           name: data.name,
//           address: data.address,
//           phone: data.phone,
//           email: data.email,
//           website: data.website,
//           logoUrl: logoUrl || data.logoUrl,
//           userId: user.id,
//         });
//         toast.success("Company updated successfully!");
//       } else {
//         await createCompany({
//           name: data.name,
//           address: data.address,
//           phone: data.phone,
//           email: data.email,
//           website: data.website,
//           logoUrl: logoUrl || data.logoUrl,
//           userId: user.id,
//         });
//         toast.success("Company created successfully!");
//       }
//       setEditingCompanyId(null);
//     } catch (error) {
//       console.error("Failed to save company:", error);
//       toast.error("Failed to save company details. Please try again.");
//     }
//   };

//   const handleDelete = async (id: Id<"companies">) => {
//     if (!user) return;

//     setIsDeleting(id);
//     try {
//       await deleteCompany({ id, userId: user.id });
//       toast.success("Company deleted successfully!");
//     } catch (error: any) {
//       console.error("Failed to delete company:", error);
//       toast.error(error.message || "Failed to delete company.");
//     } finally {
//       setIsDeleting(null);
//     }
//   };

//   const handleLogoUpload = (url: string) => {
//     setLogoUrl(url);
//     setLogoPreview(url);
//     setValue("logoUrl", url);
//   };

//   if (!user || companies === undefined) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <Loader2 className="w-8 h-8 animate-spin" />
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto p-6 pt-24">
//       {/* Added pt-24 to fix potential navbar overlap */}
//       <Card>
//         <CardHeader>
//           <div className="flex justify-between items-center">
//             <CardTitle>Company Settings</CardTitle>
//           </div>
//         </CardHeader>
//         <CardContent>
//           {companies.length === 0 && editingCompanyId === null && (
//             <p className="text-gray-600 mb-4">
//               No companies found. Create one to get started!
//             </p>
//           )}
//           {companies.map((company) => (
//             <Card key={company._id} className="mb-6">
//               <CardHeader>
//                 <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
//                   {company.logoUrl && (
//                     <img
//                       src={company.logoUrl}
//                       alt={`${company.name} logo`}
//                       className="h-16 w-16 object-contain border rounded-lg p-1"
//                     />
//                   )}
//                   <div>
//                     <CardTitle>{company.name}</CardTitle>
//                     <p className="text-sm text-gray-600">{company.email}</p>
//                   </div>
//                 </div>
//               </CardHeader>
//               <CardContent className="space-y-2">
//                 <p>
//                   <strong>Address:</strong> {company.address}
//                 </p>
//                 <p>
//                   <strong>Phone:</strong> {company.phone}
//                 </p>
//                 {company.website && (
//                   <p>
//                     <strong>Website:</strong>{" "}
//                     <a
//                       href={company.website}
//                       className="text-blue-500 hover:underline"
//                     >
//                       {company.website}
//                     </a>
//                   </p>
//                 )}
//                 <div className="flex gap-2 mt-4">
//                   <Button
//                     variant="outline"
//                     onClick={() => setEditingCompanyId(company._id)}
//                   >
//                     <Edit2 className="w-4 h-4 mr-2" />
//                     Edit
//                   </Button>
//                   <AlertDialog>
//                     <AlertDialogTrigger asChild>
//                       <Button variant="destructive">
//                         <Trash2 className="w-4 h-4 mr-2" />
//                         Delete
//                       </Button>
//                     </AlertDialogTrigger>
//                     <AlertDialogContent>
//                       <AlertDialogHeader>
//                         <AlertDialogTitle>Are you sure?</AlertDialogTitle>
//                         <AlertDialogDescription>
//                           This will permanently delete the company and all
//                           associated templates. This action cannot be undone.
//                           Make sure you don't have any invoices before deleting.
//                         </AlertDialogDescription>
//                       </AlertDialogHeader>
//                       <AlertDialogFooter>
//                         <AlertDialogCancel>Cancel</AlertDialogCancel>
//                         <AlertDialogAction
//                           onClick={() => handleDelete(company._id)}
//                           className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
//                           disabled={isDeleting === company._id}
//                         >
//                           {isDeleting === company._id ? (
//                             <>
//                               <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                               Deleting...
//                             </>
//                           ) : (
//                             "Delete"
//                           )}
//                         </AlertDialogAction>
//                       </AlertDialogFooter>
//                     </AlertDialogContent>
//                   </AlertDialog>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//           <Button onClick={() => setEditingCompanyId(null)} className="mt-4">
//             Create New Company
//           </Button>
//           {editingCompanyId !== undefined && (
//             <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
//               <div>
//                 <Label>Company Logo</Label>
//                 <LogoUpload onUpload={handleLogoUpload} />
//                 {logoPreview && (
//                   <div className="mt-2">
//                     <img
//                       src={logoPreview}
//                       alt="Logo preview"
//                       className="h-24 w-24 object-contain border rounded-lg p-2"
//                     />
//                   </div>
//                 )}
//                 <Input type="hidden" {...register("logoUrl")} />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium">
//                   Company Name
//                 </label>
//                 <Input {...register("name")} />
//                 {errors.name && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {errors.name.message}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium">Address</label>
//                 <Textarea {...register("address")} rows={3} />
//                 {errors.address && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {errors.address.message}
//                   </p>
//                 )}
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium">Phone</label>
//                   <Input {...register("phone")} />
//                   {errors.phone && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {errors.phone.message}
//                     </p>
//                   )}
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium">Email</label>
//                   <Input {...register("email")} type="email" />
//                   {errors.email && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {errors.email.message}
//                     </p>
//                   )}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium">
//                   Website (Optional)
//                 </label>
//                 <Input
//                   {...register("website")}
//                   placeholder="https://example.com"
//                 />
//                 {errors.website && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {errors.website.message}
//                   </p>
//                 )}
//               </div>
//               <div className="flex gap-3 pt-4">
//                 <Button type="submit">
//                   {editingCompanyId ? "Update Company" : "Create Company"}
//                 </Button>
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={() => setEditingCompanyId(null)}
//                 >
//                   Cancel
//                 </Button>
//               </div>
//             </form>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
// "use client";

// import { useState, useEffect } from "react";
// import { useUser } from "@clerk/nextjs";
// import { useMutation, useQuery } from "convex/react";
// import { api } from "@/convex/_generated/api";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import LogoUpload from "@/components/common/LogoUpload";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { toast } from "sonner";
// import { Loader2, Trash2, Edit2 } from "lucide-react";
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
// import { Id } from "@/convex/_generated/dataModel";

// const companySchema = z.object({
//   name: z.string().min(1, "Company name is required"),
//   address: z.string().min(1, "Address is required"),
//   phone: z.string().min(1, "Phone number is required"),
//   email: z.string().email("Invalid email address"),
//   website: z.string().url("Invalid URL").optional().or(z.literal("")),
//   logoUrl: z.string().optional(),
//   bankingDetails: z.object({
//     bankName: z.string().min(1, "Bank name is required"),
//     accountNumber: z.string().min(1, "Account number is required"),
//     branchCode: z.string().min(1, "Branch code is required"),
//     accountHolder: z.string().min(1, "Account holder name is required"),
//   }),
// });

// type CompanyFormData = z.infer<typeof companySchema>;

// export default function Settings() {
//   const { user } = useUser();
//   const companies = useQuery(api.companies.getCompaniesByUser, {
//     userId: user?.id || "",
//   });
//   const createCompany = useMutation(api.companies.createCompany);
//   const updateCompany = useMutation(api.companies.updateCompany);
//   const deleteCompany = useMutation(api.companies.deleteCompany);
//   const [logoUrl, setLogoUrl] = useState<string | null>(null);
//   const [logoPreview, setLogoPreview] = useState<string>("");
//   const [editingCompanyId, setEditingCompanyId] =
//     useState<Id<"companies"> | null>(null);
//   const [isDeleting, setIsDeleting] = useState<Id<"companies"> | null>(null);

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     formState: { errors },
//     reset,
//   } = useForm<CompanyFormData>({
//     resolver: zodResolver(companySchema),
//     defaultValues: {
//       name: "",
//       address: "",
//       phone: "",
//       email: "",
//       website: "",
//       logoUrl: "",
//       bankingDetails: {
//         bankName: "",
//         accountNumber: "",
//         branchCode: "",
//         accountHolder: "",
//       },
//     },
//   });

//   useEffect(() => {
//     if (editingCompanyId !== null && companies) {
//       const companyToEdit = companies.find((c) => c._id === editingCompanyId);
//       if (companyToEdit) {
//         reset({
//           name: companyToEdit.name,
//           address: companyToEdit.address,
//           phone: companyToEdit.phone,
//           email: companyToEdit.email,
//           website: companyToEdit.website || "",
//           logoUrl: companyToEdit.logoUrl || "",
//           bankingDetails: companyToEdit.bankingDetails || {
//             bankName: "",
//             accountNumber: "",
//             branchCode: "",
//             accountHolder: "",
//           },
//         });
//         setLogoUrl(companyToEdit.logoUrl || null);
//         setLogoPreview(companyToEdit.logoUrl || "");
//       } else {
//         reset({
//           name: "",
//           address: "",
//           phone: "",
//           email: "",
//           website: "",
//           logoUrl: "",
//           bankingDetails: {
//             bankName: "",
//             accountNumber: "",
//             branchCode: "",
//             accountHolder: "",
//           },
//         });
//         setLogoUrl(null);
//         setLogoPreview("");
//       }
//     }
//   }, [editingCompanyId, companies, reset]);

//   const onSubmit = async (data: CompanyFormData) => {
//     if (!user) return;

//     try {
//       if (editingCompanyId) {
//         await updateCompany({
//           id: editingCompanyId,
//           name: data.name,
//           address: data.address,
//           phone: data.phone,
//           email: data.email,
//           website: data.website,
//           logoUrl: logoUrl || data.logoUrl,
//           userId: user.id,
//           bankingDetails: data.bankingDetails,
//         });
//         toast.success("Company updated successfully!");
//       } else {
//         await createCompany({
//           name: data.name,
//           address: data.address,
//           phone: data.phone,
//           email: data.email,
//           website: data.website,
//           logoUrl: logoUrl || data.logoUrl,
//           userId: user.id,
//           bankingDetails: data.bankingDetails,
//         });
//         toast.success("Company created successfully!");
//       }
//       setEditingCompanyId(null);
//     } catch (error) {
//       console.error("Failed to save company:", error);
//       toast.error("Failed to save company details. Please try again.");
//     }
//   };

//   const handleDelete = async (id: Id<"companies">) => {
//     if (!user) return;
//     setIsDeleting(id);
//     try {
//       await deleteCompany({ id, userId: user.id });
//       toast.success("Company deleted successfully!");
//     } catch (error: any) {
//       console.error("Failed to delete company:", error);
//       toast.error(error.message || "Failed to delete company.");
//     } finally {
//       setIsDeleting(null);
//     }
//   };

//   const handleLogoUpload = (url: string) => {
//     setLogoUrl(url);
//     setLogoPreview(url);
//     setValue("logoUrl", url);
//   };

//   if (!user || companies === undefined) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <Loader2 className="w-8 h-8 animate-spin" />
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto p-6 pt-24">
//       <Card>
//         <CardHeader>
//           <div className="flex justify-between items-center">
//             <CardTitle>Company Settings</CardTitle>
//           </div>
//         </CardHeader>
//         <CardContent>
//           {companies.length === 0 && editingCompanyId === null && (
//             <p className="text-gray-600 mb-4">
//               No companies found. Create one to get started!
//             </p>
//           )}
//           {companies.map((company) => (
//             <Card key={company._id} className="mb-6">
//               <CardHeader>
//                 <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
//                   {company.logoUrl && (
//                     <img
//                       src={company.logoUrl}
//                       alt={`${company.name} logo`}
//                       className="h-16 w-16 object-contain border rounded-lg p-1"
//                     />
//                   )}
//                   <div>
//                     <CardTitle>{company.name}</CardTitle>
//                     <p className="text-sm text-gray-600">{company.email}</p>
//                   </div>
//                 </div>
//               </CardHeader>
//               <CardContent className="space-y-2">
//                 <p>
//                   <strong>Address:</strong> {company.address}
//                 </p>
//                 <p>
//                   <strong>Phone:</strong> {company.phone}
//                 </p>
//                 {company.website && (
//                   <p>
//                     <strong>Website:</strong>{" "}
//                     <a
//                       href={company.website}
//                       className="text-blue-500 hover:underline"
//                     >
//                       {company.website}
//                     </a>
//                   </p>
//                 )}
//                 <p>
//                   <strong>Bank Name:</strong>{" "}
//                   {company.bankingDetails?.bankName || "N/A"}
//                 </p>
//                 <p>
//                   <strong>Account Number:</strong>{" "}
//                   {company.bankingDetails?.accountNumber || "N/A"}
//                 </p>
//                 <p>
//                   <strong>Branch Code:</strong>{" "}
//                   {company.bankingDetails?.branchCode || "N/A"}
//                 </p>
//                 <p>
//                   <strong>Account Holder:</strong>{" "}
//                   {company.bankingDetails?.accountHolder || "N/A"}
//                 </p>
//                 <div className="flex gap-2 mt-4">
//                   <Button
//                     variant="outline"
//                     onClick={() => setEditingCompanyId(company._id)}
//                   >
//                     <Edit2 className="w-4 h-4 mr-2" />
//                     Edit
//                   </Button>
//                   <AlertDialog>
//                     <AlertDialogTrigger asChild>
//                       <Button variant="destructive">
//                         <Trash2 className="w-4 h-4 mr-2" />
//                         Delete
//                       </Button>
//                     </AlertDialogTrigger>
//                     <AlertDialogContent>
//                       <AlertDialogHeader>
//                         <AlertDialogTitle>Are you sure?</AlertDialogTitle>
//                         <AlertDialogDescription>
//                           This will permanently delete the company and all
//                           associated templates. This action cannot be undone.
//                           Make sure you don't have any invoices before deleting.
//                         </AlertDialogDescription>
//                       </AlertDialogHeader>
//                       <AlertDialogFooter>
//                         <AlertDialogCancel>Cancel</AlertDialogCancel>
//                         <AlertDialogAction
//                           onClick={() => handleDelete(company._id)}
//                           className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
//                           disabled={isDeleting === company._id}
//                         >
//                           {isDeleting === company._id ? (
//                             <>
//                               <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                               Deleting...
//                             </>
//                           ) : (
//                             "Delete"
//                           )}
//                         </AlertDialogAction>
//                       </AlertDialogFooter>
//                     </AlertDialogContent>
//                   </AlertDialog>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//           <Button onClick={() => setEditingCompanyId(null)} className="mt-4">
//             Create New Company
//           </Button>
//           {editingCompanyId !== undefined && (
//             <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
//               <div>
//                 <Label>Company Logo</Label>
//                 <LogoUpload onUpload={handleLogoUpload} />
//                 {logoPreview && (
//                   <div className="mt-2">
//                     <img
//                       src={logoPreview}
//                       alt="Logo preview"
//                       className="h-24 w-24 object-contain border rounded-lg p-2"
//                     />
//                   </div>
//                 )}
//                 <Input type="hidden" {...register("logoUrl")} />
//               </div>
//               <div>
//                 <Label>Company Name</Label>
//                 <Input {...register("name")} />
//                 {errors.name && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {errors.name.message}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <Label>Address</Label>
//                 <Textarea {...register("address")} rows={3} />
//                 {errors.address && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {errors.address.message}
//                   </p>
//                 )}
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <Label>Phone</Label>
//                   <Input {...register("phone")} />
//                   {errors.phone && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {errors.phone.message}
//                     </p>
//                   )}
//                 </div>
//                 <div>
//                   <Label>Email</Label>
//                   <Input {...register("email")} type="email" />
//                   {errors.email && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {errors.email.message}
//                     </p>
//                   )}
//                 </div>
//               </div>
//               <div>
//                 <Label>Website (Optional)</Label>
//                 <Input
//                   {...register("website")}
//                   placeholder="https://example.com"
//                 />
//                 {errors.website && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {errors.website.message}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <Label>Bank Name</Label>
//                 <Input {...register("bankingDetails.bankName")} />
//                 {errors.bankingDetails?.bankName && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {errors.bankingDetails.bankName.message}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <Label>Account Number</Label>
//                 <Input {...register("bankingDetails.accountNumber")} />
//                 {errors.bankingDetails?.accountNumber && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {errors.bankingDetails.accountNumber.message}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <Label>Branch Code</Label>
//                 <Input {...register("bankingDetails.branchCode")} />
//                 {errors.bankingDetails?.branchCode && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {errors.bankingDetails.branchCode.message}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <Label>Account Holder</Label>
//                 <Input {...register("bankingDetails.accountHolder")} />
//                 {errors.bankingDetails?.accountHolder && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {errors.bankingDetails.accountHolder.message}
//                   </p>
//                 )}
//               </div>
//               <div className="flex gap-3 pt-4">
//                 <Button type="submit">
//                   {editingCompanyId ? "Update Company" : "Create Company"}
//                 </Button>
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={() => setEditingCompanyId(null)}
//                 >
//                   Cancel
//                 </Button>
//               </div>
//             </form>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import LogoUpload from "@/components/common/LogoUpload";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Trash2, Edit2, Sparkles } from "lucide-react";
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
import { Id } from "@/convex/_generated/dataModel";
import { motion, AnimatePresence } from "framer-motion";

const companySchema = z.object({
  name: z.string().min(1, "Company name is required"),
  address: z.string().min(1, "Address is required"),
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email address"),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  logoUrl: z.string().optional(),
  bankingDetails: z.object({
    bankName: z.string().min(1, "Bank name is required"),
    accountNumber: z.string().min(1, "Account number is required"),
    branchCode: z.string().min(1, "Branch code is required"),
    accountHolder: z.string().min(1, "Account holder name is required"),
  }),
});

type CompanyFormData = z.infer<typeof companySchema>;

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Settings() {
  const { user } = useUser();
  const companies = useQuery(api.companies.getCompaniesByUser, {
    userId: user?.id || "",
  });
  const createCompany = useMutation(api.companies.createCompany);
  const updateCompany = useMutation(api.companies.updateCompany);
  const deleteCompany = useMutation(api.companies.deleteCompany);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [editingCompanyId, setEditingCompanyId] = useState<
    Id<"companies"> | undefined
  >(undefined);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<Id<"companies"> | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      email: "",
      website: "",
      logoUrl: "",
      bankingDetails: {
        bankName: "",
        accountNumber: "",
        branchCode: "",
        accountHolder: "",
      },
    },
  });

  useEffect(() => {
    if (isCreating) {
      reset({
        name: "",
        address: "",
        phone: "",
        email: "",
        website: "",
        logoUrl: "",
        bankingDetails: {
          bankName: "",
          accountNumber: "",
          branchCode: "",
          accountHolder: "",
        },
      });
      setLogoUrl(null);
      setLogoPreview("");
    } else if (editingCompanyId !== undefined && companies) {
      const companyToEdit = companies.find((c) => c._id === editingCompanyId);
      if (companyToEdit) {
        reset({
          name: companyToEdit.name,
          address: companyToEdit.address,
          phone: companyToEdit.phone,
          email: companyToEdit.email,
          website: companyToEdit.website || "",
          logoUrl: companyToEdit.logoUrl || "",
          bankingDetails: companyToEdit.bankingDetails || {
            bankName: "",
            accountNumber: "",
            branchCode: "",
            accountHolder: "",
          },
        });
        setLogoUrl(companyToEdit.logoUrl || null);
        setLogoPreview(companyToEdit.logoUrl || "");
      }
    }
  }, [isCreating, editingCompanyId, companies, reset]);

  const onSubmit = async (data: CompanyFormData) => {
    if (!user) return;

    try {
      if (isCreating) {
        await createCompany({
          name: data.name,
          address: data.address,
          phone: data.phone,
          email: data.email,
          website: data.website,
          logoUrl: logoUrl || data.logoUrl,
          userId: user.id,
          bankingDetails: data.bankingDetails,
        });
        toast.success("Company created successfully!");
      } else {
        await updateCompany({
          id: editingCompanyId!,
          name: data.name,
          address: data.address,
          phone: data.phone,
          email: data.email,
          website: data.website,
          logoUrl: logoUrl || data.logoUrl,
          userId: user.id,
          bankingDetails: data.bankingDetails,
        });
        toast.success("Company updated successfully!");
      }
      setIsCreating(false);
      setEditingCompanyId(undefined);
    } catch (error) {
      console.error("Failed to save company:", error);
      toast.error("Failed to save company details. Please try again.");
    }
  };

  const handleDelete = async (id: Id<"companies">) => {
    if (!user) return;
    setIsDeleting(id);
    try {
      await deleteCompany({ id, userId: user.id });
      toast.success("Company deleted successfully!");
    } catch (error: any) {
      console.error("Failed to delete company:", error);
      toast.error(error.message || "Failed to delete company.");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleLogoUpload = (url: string) => {
    setLogoUrl(url);
    setLogoPreview(url);
    setValue("logoUrl", url);
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

  const isFormOpen = isCreating || editingCompanyId !== undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 pt-24 pb-16 mt-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Company Settings
            </h1>
            <p className="text-slate-600 mt-2 text-sm sm:text-base">
              Manage your company details and banking information
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          whileHover={{ y: -2 }}
          className="transition-all duration-300"
        >
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <CardContent className="p-6">
              <AnimatePresence>
                {companies.length === 0 && !isFormOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center py-12"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                      className="inline-block p-6 bg-gradient-to-br from-slate-50 to-indigo-50 rounded-full mb-6"
                    >
                      <Trash2 size={64} className="text-slate-400" />{" "}
                      {/* Changed icon for variety */}
                    </motion.div>
                    <motion.h3
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-xl font-semibold text-slate-900 mb-2"
                    >
                      No Companies Found
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-slate-500 mb-6 max-w-md mx-auto"
                    >
                      Create one to get started!
                    </motion.p>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        onClick={() => {
                          setIsCreating(true);
                          setEditingCompanyId(undefined);
                        }}
                        className="group relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent pointer-events-none"
                          initial={{ x: "-100%" }}
                          whileHover={{ x: "100%" }}
                          transition={{ duration: 0.5 }}
                        />
                        Create New Company
                      </Button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {companies.map((company, index) => (
                  <motion.div
                    key={company._id}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.1 }}
                    className="mb-6"
                  >
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50 hover:shadow-xl transition-all duration-300 overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/10 to-purple-50/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                      <CardHeader className="border-b border-slate-100">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                          {company.logoUrl && (
                            <motion.img
                              src={company.logoUrl}
                              alt={`${company.name} logo`}
                              className="h-16 w-16 object-contain border rounded-lg p-1"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                            />
                          )}
                          <div>
                            <CardTitle className="text-xl text-slate-900">
                              {company.name}
                            </CardTitle>
                            <p className="text-sm text-slate-600">
                              {company.email}
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2 p-6">
                        <p className="text-slate-700">
                          <strong className="font-semibold">Address:</strong>{" "}
                          {company.address}
                        </p>
                        <p className="text-slate-700">
                          <strong className="font-semibold">Phone:</strong>{" "}
                          {company.phone}
                        </p>
                        {company.website && (
                          <p className="text-slate-700">
                            <strong className="font-semibold">Website:</strong>{" "}
                            <a
                              href={company.website}
                              className="text-indigo-600 hover:underline"
                            >
                              {company.website}
                            </a>
                          </p>
                        )}
                        <p className="text-slate-700">
                          <strong className="font-semibold">Bank Name:</strong>{" "}
                          {company.bankingDetails?.bankName || "N/A"}
                        </p>
                        <p className="text-slate-700">
                          <strong className="font-semibold">
                            Account Number:
                          </strong>{" "}
                          {company.bankingDetails?.accountNumber || "N/A"}
                        </p>
                        <p className="text-slate-700">
                          <strong className="font-semibold">
                            Branch Code:
                          </strong>{" "}
                          {company.bankingDetails?.branchCode || "N/A"}
                        </p>
                        <p className="text-slate-700">
                          <strong className="font-semibold">
                            Account Holder:
                          </strong>{" "}
                          {company.bankingDetails?.accountHolder || "N/A"}
                        </p>
                        <div className="flex gap-2 mt-4">
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              variant="outline"
                              onClick={() => {
                                setIsCreating(false);
                                setEditingCompanyId(company._id);
                              }}
                              className="border-indigo-200 hover:bg-indigo-50 transition-colors"
                            >
                              <Edit2 className="w-4 h-4 mr-2 text-indigo-600" />
                              Edit
                            </Button>
                          </motion.div>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="destructive"
                                  className="hover:bg-rose-700 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Are you sure?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will permanently delete the company and
                                    all associated templates. This action cannot
                                    be undone. Make sure you don't have any
                                    invoices before deleting.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(company._id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    disabled={isDeleting === company._id}
                                  >
                                    {isDeleting === company._id
                                      ? "Deleting..."
                                      : "Delete"}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </motion.div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>

              {companies.length > 0 && !isFormOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={() => {
                      setIsCreating(true);
                      setEditingCompanyId(undefined);
                    }}
                    className="group relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 mt-4"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent pointer-events-none"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.5 }}
                    />
                    Create New Company
                  </Button>
                </motion.div>
              )}

              <AnimatePresence>
                {isFormOpen && (
                  <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-6 mt-8 border-t border-slate-200 pt-8"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                          Company Logo
                        </Label>
                        <LogoUpload onUpload={handleLogoUpload} />
                        {logoPreview && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mt-2"
                          >
                            <img
                              src={logoPreview}
                              alt="Logo preview"
                              className="h-24 w-24 object-contain border rounded-lg p-2 shadow-sm"
                            />
                          </motion.div>
                        )}
                        <Input type="hidden" {...register("logoUrl")} />
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium text-slate-700 mb-2">
                            Company Name
                          </Label>
                          <Input
                            {...register("name")}
                            className="border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 hover:border-slate-300 transition-all duration-200"
                          />
                          {errors.name && (
                            <p className="text-rose-500 text-sm mt-1">
                              {errors.name.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-slate-700 mb-2">
                            Email
                          </Label>
                          <Input
                            {...register("email")}
                            type="email"
                            className="border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 hover:border-slate-300 transition-all duration-200"
                          />
                          {errors.email && (
                            <p className="text-rose-500 text-sm mt-1">
                              {errors.email.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-slate-700 mb-2">
                        Address
                      </Label>
                      <Textarea
                        {...register("address")}
                        rows={3}
                        className="border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 hover:border-slate-300 transition-all duration-200"
                      />
                      {errors.address && (
                        <p className="text-rose-500 text-sm mt-1">
                          {errors.address.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label className="text-sm font-medium text-slate-700 mb-2">
                          Phone
                        </Label>
                        <Input
                          {...register("phone")}
                          className="border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 hover:border-slate-300 transition-all duration-200"
                        />
                        {errors.phone && (
                          <p className="text-rose-500 text-sm mt-1">
                            {errors.phone.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-slate-700 mb-2">
                          Website (Optional)
                        </Label>
                        <Input
                          {...register("website")}
                          placeholder="https://example.com"
                          className="border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 hover:border-slate-300 transition-all duration-200"
                        />
                        {errors.website && (
                          <p className="text-rose-500 text-sm mt-1">
                            {errors.website.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200">
                      <h3 className="text-lg font-semibold text-slate-900 mb-4">
                        Banking Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label className="text-sm font-medium text-slate-700 mb-2">
                            Bank Name
                          </Label>
                          <Input
                            {...register("bankingDetails.bankName")}
                            className="border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 hover:border-slate-300 transition-all duration-200"
                          />
                          {errors.bankingDetails?.bankName && (
                            <p className="text-rose-500 text-sm mt-1">
                              {errors.bankingDetails.bankName.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-slate-700 mb-2">
                            Account Number
                          </Label>
                          <Input
                            {...register("bankingDetails.accountNumber")}
                            className="border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 hover:border-slate-300 transition-all duration-200"
                          />
                          {errors.bankingDetails?.accountNumber && (
                            <p className="text-rose-500 text-sm mt-1">
                              {errors.bankingDetails.accountNumber.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-slate-700 mb-2">
                            Branch Code
                          </Label>
                          <Input
                            {...register("bankingDetails.branchCode")}
                            className="border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 hover:border-slate-300 transition-all duration-200"
                          />
                          {errors.bankingDetails?.branchCode && (
                            <p className="text-rose-500 text-sm mt-1">
                              {errors.bankingDetails.branchCode.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-slate-700 mb-2">
                            Account Holder
                          </Label>
                          <Input
                            {...register("bankingDetails.accountHolder")}
                            className="border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 hover:border-slate-300 transition-all duration-200"
                          />
                          {errors.bankingDetails?.accountHolder && (
                            <p className="text-rose-500 text-sm mt-1">
                              {errors.bankingDetails.accountHolder.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          type="submit"
                          className="group relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent pointer-events-none"
                            initial={{ x: "-100%" }}
                            whileHover={{ x: "100%" }}
                            transition={{ duration: 0.5 }}
                          />
                          {isCreating ? "Create Company" : "Update Company"}
                        </Button>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setIsCreating(false);
                            setEditingCompanyId(undefined);
                          }}
                          className="border-slate-200 hover:bg-slate-50 transition-colors"
                        >
                          Cancel
                        </Button>
                      </motion.div>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
