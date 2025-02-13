"use client"
import { useState } from "react"
import Input from "@/app/components/InputForm"
import Link from "next/link"
import axios from "axios"
import { useRouter } from "next/navigation"

const defaultData = { name: "", username: "", password: "" }

const Register = () => {
  const [data, setData] = useState(defaultData)

  const router = useRouter()

  const onValueChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value})
  }

  const onRegister = async (e) => {
    e.preventDefault()
    
    if (!data.name || !data.username || !data.password) {
      alert("Please fill all required fields")
      return
    }

    // API
    try {
      const res = await axios.post("api/users/register", data)
      setData(defaultData)

      if (res.status === 200) {
        router.push("/login")
      }
      
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="min-h-screen bg-[#c7c7c7] flex justify-center items-center">
      <div className="bg-white px-16 pt-8 pb-16 mb-4 rounded-3xl">
        <h1 className="text-xl mb-4 text-center">Register</h1>
        <form>
          <Input 
            label="Name"
            id="name"
            type="text"
            value={data.name}
            onChange={(e) => onValueChange(e)}
          />
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
            onClick={(e) => onRegister(e)}
          >
            Submit
          </button>
          <p className="text-center">
            Already have an account? {""}
            <Link className="hover:underline text-purple-400 transition hover:text-purple-600 font-semibold" href="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Register