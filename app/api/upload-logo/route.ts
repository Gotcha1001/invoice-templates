// import { v2 as cloudinary } from "cloudinary";
// import { NextResponse } from "next/server";

// cloudinary.config({
//   cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// export async function POST(request: Request) {
//   try {
//     const formData = await request.formData();
//     const file = formData.get("file") as File;

//     if (!file) {
//       return NextResponse.json({ error: "No file provided" }, { status: 400 });
//     }

//     const buffer = await file.arrayBuffer();
//     const base64File = Buffer.from(buffer).toString("base64");
//     const dataUri = `data:${file.type};base64,${base64File}`;

//     const response = await cloudinary.uploader.upload(dataUri, {
//       upload_preset: "invoice_logos",
//     });

//     return NextResponse.json({ secure_url: response.secure_url });
//   } catch (error) {
//     console.error("Cloudinary upload error:", error);
//     return NextResponse.json({ error: "Upload failed" }, { status: 500 });
//   }
// }

import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    if (!file)
      return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const buffer = await file.arrayBuffer();
    const base64File = Buffer.from(buffer).toString("base64");
    const dataUri = `data:${file.type};base64,${base64File}`;

    // 🔑 No upload_preset needed
    const result = await cloudinary.uploader.upload(dataUri);
    return NextResponse.json({ secure_url: result.secure_url });
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
