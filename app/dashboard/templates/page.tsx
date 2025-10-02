"use client";

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
import { Loader2, Plus, Edit, Trash2 } from "lucide-react";
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

export default function TemplatesList() {
  const { user } = useUser();

  // First get the company
  const company = useQuery(api.companies.getCompanyByUser, {
    userId: user?.id || "",
  });

  // Then get templates using companyId
  const templates = useQuery(
    api.templates.getTemplates,
    company?._id ? { companyId: company._id } : "skip"
  );

  const deleteTemplate = useMutation(api.templates.deleteTemplate);

  const handleDelete = async (id: Id<"templates">) => {
    if (!company) return;
    try {
      await deleteTemplate({ id, companyId: company._id });
      toast.success("Template deleted successfully!");
    } catch (error) {
      console.error("Failed to delete template:", error);
      toast.error("Failed to delete template. Please try again.");
    }
  };

  if (!user || company === undefined || templates === undefined) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (company === null) {
    return (
      <div className="max-w-7xl mx-auto p-6 mt-20">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center mb-4">
              Please set up your company first.
            </p>
            <div className="flex justify-center">
              <Link href="/dashboard/settings">
                <Button>Go to Settings</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 mt-20">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Invoice Templates</h1>
          <p className="text-gray-600 mt-2">
            Customize your invoice designs and create new templates
          </p>
        </div>
        <Link href="/dashboard/templates/create">
          <Button size="lg" className="flex items-center gap-2">
            <Plus size={20} />
            Create New Template
          </Button>
        </Link>
      </div>

      {templates.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus size={32} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Templates Yet</h3>
              <p className="text-gray-600 mb-6">
                Create your first invoice template to get started!
              </p>
              <Link href="/dashboard/templates/create">
                <Button size="lg" className="flex items-center gap-2 mx-auto">
                  <Plus size={20} />
                  Create Your First Template
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Header Style</TableHead>
                  <TableHead>Logo Position</TableHead>
                  <TableHead>Default</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {templates.map((template) => (
                  <TableRow key={template._id}>
                    <TableCell className="font-medium">
                      {template.name}
                    </TableCell>
                    <TableCell>
                      {template.description || "No description"}
                    </TableCell>
                    <TableCell className="capitalize">
                      {template.layout.headerStyle}
                    </TableCell>
                    <TableCell className="capitalize">
                      {template.layout.logoPosition}
                    </TableCell>
                    <TableCell>
                      {template.isDefault ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Default
                        </span>
                      ) : (
                        <span className="text-gray-400">No</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end space-x-2">
                        <Link href={`/dashboard/templates/${template._id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                          >
                            <Edit size={14} />
                            Edit
                          </Button>
                        </Link>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="flex items-center gap-1"
                            >
                              <Trash2 size={14} />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete the template "
                                {template.name}". This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(template._id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
