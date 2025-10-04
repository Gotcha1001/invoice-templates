// "use client";

// import { useMutation } from "convex/react";
// import { api } from "@/convex/_generated/api";
// import TemplateDesigner from "@/components/template/TemplateDesigner";

// import { useRouter } from "next/navigation";
// import { toast } from "sonner";
// import { TemplateFormData } from "@/types/template";

// export default function CreateTemplate() {
//   const createTemplate = useMutation(api.templates.createTemplate);
//   const router = useRouter();

//   const handleSubmit = async (data: TemplateFormData) => {
//     try {
//       await createTemplate(data);
//       toast("Template created successfully!");
//       router.push("/dashboard/templates"); // Redirect to templates list
//     } catch (error) {
//       console.error("Failed to create template:", error);
//       toast("Failed to create template. Please try again.");
//     }
//   };

//   return (
//     <div className="max-w-7xl mx-auto p-6">
//       <h1 className="text-3xl font-bold mb-6">Create New Template</h1>
//       <TemplateDesigner onSubmit={handleSubmit} />
//     </div>
//   );
// }
"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import TemplateDesigner from "@/components/template/TemplateDesigner";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { TemplateFormData } from "@/types/template";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export default function CreateTemplate() {
  const { user } = useUser();
  const createTemplate = useMutation(api.templates.createTemplate);
  const company = useQuery(api.companies.getCompanyByUser, {
    userId: user?.id || "",
  });
  const templates = useQuery(
    api.templates.getTemplatesByCompany, // Updated to use correct query
    company ? { companyId: company._id } : "skip"
  );
  const router = useRouter();

  const handleSubmit = async (data: TemplateFormData) => {
    if (!company) {
      toast.error("Please set up your company first");
      return;
    }

    try {
      await createTemplate({
        ...data,
        description: data.description || "", // Ensure description is a string
        companyId: company._id,
      });
      toast.success("Template created successfully!");
      router.push("/dashboard/templates");
    } catch (error) {
      console.error("Failed to create template:", error);
      toast.error("Failed to create template. Please try again.");
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
      <div className="max-w-7xl mx-auto p-6">
        <p>Please set up your company first.</p>
        <Link href="/dashboard/settings">
          <Button>Go to Settings</Button>
        </Link>
      </div>
    );
  }

  if (templates && templates.length > 0) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center mb-4">
              Only one template per company is allowed. Edit your existing
              template.
            </p>
            <div className="flex justify-center">
              <Link href={`/dashboard/templates/${templates[0]._id}`}>
                <Button>Edit Template</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create New Template</h1>
      <TemplateDesigner
        onSubmit={handleSubmit}
        companyData={{
          name: company.name,
          address: company.address,
          phone: company.phone,
          email: company.email,
          logoUrl: company.logoUrl,
          bankingDetails: company.bankingDetails, // Include bankingDetails
        }}
      />
    </div>
  );
}
