import User from "@/models/user"
import bcryptjs from "bcryptjs"
import Connection from "@/database/config"
import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"


export const POST = async (req) => {
  await Connection()

  try {
    const { username, password } = await req.json()

    if (!username ||!password) {
      return NextResponse.json({ error: "username and password is required"}, { status: 401 })
    }

    const user = await User.findOne({ username })
    if (!user) {
      return NextResponse.json({error: "Username does not exist"}, { status: 400 })
    }

    const validPassword = await bcryptjs.compare(password, user.password)
    if (!validPassword) {
      return NextResponse.json({ error: "Incorrect Password"}, { status: 400 })
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRETKEY, { expiresIn: 900 });
    const response = NextResponse.json({ message: "Login successfull" });
    response.cookies.set("token", token, { httpOnly: true, sameSite: "strict" });
    
    return response;
  } catch (err) {
    console.log(err)
    return NextResponse.json({ error: "Something went wrong"}, { status: 500 })
  }
}