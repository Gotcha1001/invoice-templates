// "use client";

// import { useMutation, useQuery } from "convex/react";
// import { api } from "@/convex/_generated/api";
// import { useUser } from "@clerk/nextjs";
// import TemplateDesigner from "@/components/template/TemplateDesigner";
// import { TemplateFormData } from "@/types/template";
// import { useRouter } from "next/navigation";
// import { toast } from "sonner";
// import { Loader2 } from "lucide-react";
// import { Id } from "@/convex/_generated/dataModel";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";

// export default function EditTemplate({
//   params,
// }: {
//   params: { id: Id<"templates"> };
// }) {
//   const { user } = useUser();
//   const router = useRouter();
//   const template = useQuery(api.templates.getTemplate, { id: params.id });
//   const updateTemplate = useMutation(api.templates.updateTemplate);
//   const deleteTemplate = useMutation(api.templates.deleteTemplate);

//   const handleSubmit = async (data: TemplateFormData) => {
//     try {
//       await updateTemplate({ id: params.id, ...data });
//       toast.success("Template updated successfully!");
//       router.push("/dashboard/templates");
//     } catch (error) {
//       console.error("Failed to update template:", error);
//       toast.error("Failed to update template. Please try again.");
//     }
//   };

//   const handleDelete = async () => {
//     try {
//       await deleteTemplate({ id: params.id });
//       toast.success("Template deleted successfully!");
//       router.push("/dashboard/templates");
//     } catch (error) {
//       console.error("Failed to delete template:", error);
//       toast.error("Failed to delete template. Please try again.");
//     }
//   };

//   if (!user || template === undefined) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <Loader2 className="w-8 h-8 animate-spin" />
//       </div>
//     );
//   }

//   if (template === null) {
//     return (
//       <div className="max-w-7xl mx-auto p-6">
//         <p>Template not found or you don&apos;t have access.</p>
//         <Link href="/dashboard/templates">
//           <Button variant="link">Back to Templates</Button>
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold">Edit Template: {template.name}</h1>
//         <Button variant="destructive" onClick={handleDelete}>
//           Delete Template
//         </Button>
//       </div>
//       <TemplateDesigner
//         onSubmit={handleSubmit}
//         defaultValues={{
//           name: template.name,
//           description: template.description,
//           layout: template.layout,
//           isDefault: template.isDefault,
//         }}
//       />
//     </div>
//   );
// }

"use client";

import { use } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import TemplateDesigner from "@/components/template/TemplateDesigner";
import { TemplateFormData } from "@/types/template";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function EditTemplate({
  params,
}: {
  params: Promise<{ id: Id<"templates"> }>;
}) {
  const { id } = use(params);
  const { user } = useUser();
  const router = useRouter();

  const template = useQuery(api.templates.getTemplate, { id });
  const company = useQuery(api.companies.getCompanyByUser, {
    userId: user?.id || "",
  });

  const updateTemplate = useMutation(api.templates.updateTemplate);
  const deleteTemplate = useMutation(api.templates.deleteTemplate);

  const handleSubmit = async (data: TemplateFormData) => {
    if (!company) {
      toast.error("Company not found");
      return;
    }

    try {
      await updateTemplate({
        id,
        ...data,
        companyId: company._id,
      });
      toast.success("Template updated successfully!");
      router.push("/dashboard/templates");
    } catch (error) {
      console.error("Failed to update template:", error);
      toast.error("Failed to update template. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (!company) {
      toast.error("Company not found");
      return;
    }

    try {
      await deleteTemplate({
        id,
        companyId: company._id,
      });
      toast.success("Template deleted successfully!");
      router.push("/dashboard/templates");
    } catch (error) {
      console.error("Failed to delete template:", error);
      toast.error("Failed to delete template. Please try again.");
    }
  };

  if (!user || template === undefined || company === undefined) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (template === null || company === null) {
    return (
      <div className="max-w-7xl mx-auto p-6 mt-20">
        <p>Template not found or you don&apos;t have access.</p>
        <Link href="/dashboard/templates">
          <Button variant="link">Back to Templates</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 mt-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Edit Template: {template.name}</h1>
        <Button variant="destructive" onClick={handleDelete}>
          Delete Template
        </Button>
      </div>
      <TemplateDesigner
        onSubmit={handleSubmit}
        defaultValues={{
          name: template.name,
          description: template.description,
          layout: template.layout,
          isDefault: template.isDefault,
        }}
        companyData={{
          name: company.name,
          address: company.address,
          phone: company.phone,
          email: company.email,
          logoUrl: company.logoUrl,
        }}
      />
    </div>
  );
}
