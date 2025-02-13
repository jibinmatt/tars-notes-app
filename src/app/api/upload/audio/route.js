import { NextResponse } from "next/server";
import cloudinary from "@/utils/cloudinary";

export async function POST(req) {
  console.log("📌 API Route Hit: /api/upload/audio");

  try {
    const formData = await req.formData();
    console.log("📌 Received FormData:", formData);

    const file = formData.get("file");

    if (!file) {
      console.error("📌 No file uploaded");
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    console.log("📌 Uploading file to Cloudinary...");

    // ✅ Convert file to Base64
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64String = buffer.toString("base64");
    const dataURI = `data:audio/webm;base64,${base64String}`;

    console.log("📌 Uploading Base64 to Cloudinary...");

    // ✅ Upload to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(dataURI, {
      resource_type: "video", // ✅ Cloudinary treats audio as "video"
      folder: "audio_notes",
      format: "mp3",
    });

    console.log("📌 Cloudinary Upload Successful:", uploadResponse);

    return NextResponse.json({ audioUrl: uploadResponse.secure_url }, { status: 200 });

  } catch (error) {
    console.error("📌 Cloudinary Upload Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ Fix: Ensure Next.js recognizes this API route
export const config = {
  api: {
    bodyParser: false,
  },
};
