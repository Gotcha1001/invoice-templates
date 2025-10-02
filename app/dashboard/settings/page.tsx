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
import { Loader2, Trash2, Edit2 } from "lucide-react";
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

const companySchema = z.object({
  name: z.string().min(1, "Company name is required"),
  address: z.string().min(1, "Address is required"),
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email address"),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  logoUrl: z.string().optional(),
});

type CompanyFormData = z.infer<typeof companySchema>;

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
  const [editingCompanyId, setEditingCompanyId] =
    useState<Id<"companies"> | null>(null);
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
    },
  });

  useEffect(() => {
    if (editingCompanyId !== null && companies) {
      const companyToEdit = companies.find((c) => c._id === editingCompanyId);
      if (companyToEdit) {
        reset({
          name: companyToEdit.name,
          address: companyToEdit.address,
          phone: companyToEdit.phone,
          email: companyToEdit.email,
          website: companyToEdit.website || "",
          logoUrl: companyToEdit.logoUrl || "",
        });
        setLogoUrl(companyToEdit.logoUrl || null);
        setLogoPreview(companyToEdit.logoUrl || "");
      } else {
        reset({
          name: "",
          address: "",
          phone: "",
          email: "",
          website: "",
          logoUrl: "",
        });
        setLogoUrl(null);
        setLogoPreview("");
      }
    }
  }, [editingCompanyId, companies, reset]);

  const onSubmit = async (data: CompanyFormData) => {
    if (!user) return;

    try {
      if (editingCompanyId) {
        await updateCompany({
          id: editingCompanyId,
          name: data.name,
          address: data.address,
          phone: data.phone,
          email: data.email,
          website: data.website,
          logoUrl: logoUrl || data.logoUrl,
          userId: user.id,
        });
        toast.success("Company updated successfully!");
      } else {
        await createCompany({
          name: data.name,
          address: data.address,
          phone: data.phone,
          email: data.email,
          website: data.website,
          logoUrl: logoUrl || data.logoUrl,
          userId: user.id,
        });
        toast.success("Company created successfully!");
      }
      setEditingCompanyId(null);
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
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 pt-24">
      {/* Added pt-24 to fix potential navbar overlap */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Company Settings</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {companies.length === 0 && editingCompanyId === null && (
            <p className="text-gray-600 mb-4">
              No companies found. Create one to get started!
            </p>
          )}
          {companies.map((company) => (
            <Card key={company._id} className="mb-6">
              <CardHeader>
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                  {company.logoUrl && (
                    <img
                      src={company.logoUrl}
                      alt={`${company.name} logo`}
                      className="h-16 w-16 object-contain border rounded-lg p-1"
                    />
                  )}
                  <div>
                    <CardTitle>{company.name}</CardTitle>
                    <p className="text-sm text-gray-600">{company.email}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>
                  <strong>Address:</strong> {company.address}
                </p>
                <p>
                  <strong>Phone:</strong> {company.phone}
                </p>
                {company.website && (
                  <p>
                    <strong>Website:</strong>{" "}
                    <a
                      href={company.website}
                      className="text-blue-500 hover:underline"
                    >
                      {company.website}
                    </a>
                  </p>
                )}
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setEditingCompanyId(company._id)}
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete the company and all
                          associated templates. This action cannot be undone.
                          Make sure you don't have any invoices before deleting.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(company._id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          disabled={isDeleting === company._id}
                        >
                          {isDeleting === company._id ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Deleting...
                            </>
                          ) : (
                            "Delete"
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
          <Button onClick={() => setEditingCompanyId(null)} className="mt-4">
            Create New Company
          </Button>
          {editingCompanyId !== undefined && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
              <div>
                <Label>Company Logo</Label>
                <LogoUpload onUpload={handleLogoUpload} />
                {logoPreview && (
                  <div className="mt-2">
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="h-24 w-24 object-contain border rounded-lg p-2"
                    />
                  </div>
                )}
                <Input type="hidden" {...register("logoUrl")} />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Company Name
                </label>
                <Input {...register("name")} />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium">Address</label>
                <Textarea {...register("address")} rows={3} />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.address.message}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Phone</label>
                  <Input {...register("phone")} />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium">Email</label>
                  <Input {...register("email")} type="email" />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Website (Optional)
                </label>
                <Input
                  {...register("website")}
                  placeholder="https://example.com"
                />
                {errors.website && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.website.message}
                  </p>
                )}
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="submit">
                  {editingCompanyId ? "Update Company" : "Create Company"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingCompanyId(null)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
