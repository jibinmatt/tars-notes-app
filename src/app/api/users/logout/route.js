
import Connection from "@/database/config"
import { NextResponse } from "next/server"


export const GET = async () => {
  await Connection()
  try {
    const response = NextResponse.json({ message: "Logout successfull", success: true });
    response.cookies.set("token", "", { httpOnly: true, expires: new Date(0) });
    return response;
  } catch (err) {
    console.log(err)
    return new Response("Something went wrong", { status: 500 })
  }
}