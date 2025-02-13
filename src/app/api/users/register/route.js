import User from "@/models/user"
import bcryptjs from "bcryptjs"
import Connection from "@/database/config"


export const POST = async (NextRequest) => {
  await Connection()
  try {
    const { name, username, password } = await NextRequest.json()

    if (!name || !username ||!password) {
      return new Response("name, username and password is required", { status: 401 })
    }

    const user = await User.findOne({ username })
    if (user) {
      return new Response("Username already exists", { status: 400 })
    }

    const salt = await bcryptjs.genSalt(12)
    const hashedPassword = await bcryptjs.hash(password, salt)
    const newUser = new User({ name, username, password: hashedPassword })
    await newUser.save()
    
    return new Response("User saved successfully", { status: 200 })
  } catch (err) {
    console.log(err)
    return new Response("Something went wrong", { status: 500 })
  }
}