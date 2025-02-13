import { NextResponse } from "next/server";
import cloudinary from "@/utils/cloudinary";

export async function POST(req) {
  try {
    const { imageUrl } = await req.json();
    if (!imageUrl) {
      return NextResponse.json({ error: "No image URL provided" }, { status: 400 });
    }

    // Extract public ID from URL
    const publicId = imageUrl.split("/").pop().split(".")[0];

    // Delete from Cloudinary
    const deleteResponse = await cloudinary.uploader.destroy(`note_images/${publicId}`);

    return NextResponse.json({ message: "Image deleted", result: deleteResponse }, { status: 200 });
  } catch (error) {
    console.error("Image Delete Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
