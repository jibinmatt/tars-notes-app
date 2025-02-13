import { NextResponse } from "next/server";
import { getUserFromToken } from "@/utils/getUserFromToken";
import Connection from "@/database/config";

export async function GET(req) {
  await Connection()
  
  try {
    const token = req.cookies.get("token")?.value;
    // console.log("Token from cookie:", token); // ✅ Debugging

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = getUserFromToken(req);
    if (!userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    return NextResponse.json({ userId }, { status: 200 }); // ✅ Ensure JSON response
  } catch (error) {
    console.error("API Error in /api/auth/me:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
