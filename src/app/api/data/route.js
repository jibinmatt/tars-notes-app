
import Connection from "@/database/config"
import { NextResponse } from "next/server";
import User from "@/models/user";
import cloudinary from "@/utils/cloudinary";

export async function POST(req) {
  await Connection()

  try {
    const body = await req.json();
    console.log("POST request body", body)

    const { userId, title, text, audio, transcript, images, isFavorite } = body

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    if (!title) {
      return NextResponse.json({ error: "Note Title is required" }, { status: 400 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const newNote = { title, text, audio, transcript, images, isFavorite, createdAt: new Date() };
    user.notes.push(newNote);
    await user.save();

    return NextResponse.json({ message: "Note created successfully", note: newNote }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  Connection()

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ data: user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ Update a Note
export async function PUT(req) {
  await Connection();

  try {
    const { userId, noteId, title, text, audio, transcript, images, isFavorite } = await req.json();

    if (!userId || !noteId) {
      return NextResponse.json({ error: "User ID and Note ID are required" }, { status: 400 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const note = user.notes.id(noteId);
    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    // ✅ Update Note Fields
    if (title !== undefined) note.title = title;
    if (text !== undefined) note.text = text;
    if (audio !== undefined) note.audio = audio;
    if (transcript !== undefined) note.transcript = transcript;
    if (images !== undefined) note.images = images;
    if (isFavorite !== undefined) note.isFavorite = isFavorite;
    note.updatedAt = new Date();

    await user.save();

    return NextResponse.json({ message: "Note updated successfully", note }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ Delete a Note
export async function DELETE(req) {
  await Connection();

  try {
    const { userId, noteId } = await req.json();

    if (!userId || !noteId) {
      return NextResponse.json({ error: "User ID and Note ID are required" }, { status: 400 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find note to delete
    const note = user.notes.find((n) => n._id.toString() === noteId);
    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    // ✅ Delete images from Cloudinary
    if (note.images.length > 0) {
      for (const imageUrl of note.images) {
        const publicId = imageUrl.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`note_images/${publicId}`);
      }
    }

    // ✅ Delete audio file from Cloudinary
    if (note.audio) {
      const publicId = note.audio.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`audio_notes/${publicId}`, { resource_type: "video" });
    }

    // ✅ Remove note from MongoDB
    user.notes = user.notes.filter((n) => n._id.toString() !== noteId);
    await user.save();

    return NextResponse.json({ message: "Note deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("❌ API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


