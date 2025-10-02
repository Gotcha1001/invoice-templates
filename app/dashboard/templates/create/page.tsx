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

export default function CreateTemplate() {
  const { user } = useUser();
  const createTemplate = useMutation(api.templates.createTemplate);
  const company = useQuery(api.companies.getCompanyByUser, {
    userId: user?.id || "",
  });
  const router = useRouter();

  const handleSubmit = async (data: TemplateFormData) => {
    if (!company) {
      toast.error("Please set up your company first");
      return;
    }

    try {
      await createTemplate({
        ...data,
        companyId: company._id,
      });
      toast.success("Template created successfully!");
      router.push("/dashboard/templates");
    } catch (error) {
      console.error("Failed to create template:", error);
      toast.error("Failed to create template. Please try again.");
    }
  };

  if (!user || company === undefined) {
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
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create New Template</h1>
      <TemplateDesigner onSubmit={handleSubmit} />
    </div>
  );
}
