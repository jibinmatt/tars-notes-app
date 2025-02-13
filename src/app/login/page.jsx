"use client"
import { useState } from "react"
import Input from "@/app/components/InputForm"
import Link from "next/link"
import axios from "axios"
import { useRouter } from "next/navigation"

const defaultData = { username: "", password: "" }

const Login = () => {
  const [data, setData] = useState(defaultData)
  const router = useRouter()

  const onValueChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value})
  }

  const onLogin = async (e) => {
    e.preventDefault()
    
    if (!data.username || !data.password) {
      alert("Please fill all required fields")
      return
    }

    // API
    try {
      const res = await axios.post("api/users/login", data)
      setData(defaultData)

      if (res.status === 200) {
        router.push("/dashboard")
      }
      
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="min-h-screen bg-[#c7c7c7] flex justify-center items-center">
      <div className="bg-white px-16 pt-8 pb-16 mb-4 rounded-3xl">
        <h1 className="text-xl mb-4 text-center">Login</h1>
        <form>
          <Input 
            label="Username"
            id="username"
            type="text"
            value={data.username}
            onChange={(e) => onValueChange(e)}
          />
          <Input 
            label="Password"
            id="password"
            type="password"
            value={data.password}
            onChange={(e) => onValueChange(e)}
          />
          <button 
            className="w-full bg-purple-400 hover:bg-purple-600 text-white transition rounded-xl p-2 my-4"
            onClick={(e) => onLogin(e)}
          >
            Submit
          </button>
          <p className="text-center">
            Don't have an account? {""}
            <Link className="hover:underline transition text-purple-400  hover:text-purple-600 font-semibold" href="/register">Register</Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login