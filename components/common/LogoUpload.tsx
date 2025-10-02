// // components/common/LogoUpload.tsx
// "use client";

// import { useState } from "react";
// import { uploadImage } from "@/lib/cloudinary";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Loader2 } from "lucide-react";

// interface LogoUploadProps {
//   onUpload: (url: string) => void;
// }

// export default function LogoUpload({ onUpload }: LogoUploadProps) {
//   const [file, setFile] = useState<File | null>(null);
//   const [uploading, setUploading] = useState(false);

//   const handleUpload = async () => {
//     if (!file) return;
//     setUploading(true);
//     try {
//       const { secure_url } = await uploadImage(file);
//       onUpload(secure_url);
//     } catch (error) {
//       console.error("Upload failed", error);
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <div className="flex items-center space-x-2">
//       <Input
//         type="file"
//         accept="image/*"
//         onChange={(e) => setFile(e.target.files?.[0] || null)}
//       />
//       <Button onClick={handleUpload} disabled={!file || uploading}>
//         {uploading ? (
//           <Loader2 className="w-4 h-4 animate-spin" />
//         ) : (
//           "Upload Logo"
//         )}
//       </Button>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface LogoUploadProps {
  onUpload: (url: string) => void; // Callback to pass the uploaded URL to parent
}

export default function LogoUpload({ onUpload }: LogoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload-logo", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      onUpload(data.secure_url); // Pass the URL to the parent component
    } catch (err) {
      setError("Failed to upload logo. Please try again.");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        disabled={isUploading}
      />
      {isUploading && (
        <div className="flex items-center space-x-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Uploading...</span>
        </div>
      )}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
