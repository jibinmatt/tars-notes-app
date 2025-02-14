import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import axios from "axios";
import image4 from "../assets/image 4.png"


export default function Sidebar({ isHomeView, setIsHomeView, data }) {
  const [showLogoutBtn, setShowLogoutBtn] = useState(false)
  const router = useRouter(); // ✅ Ensure this is inside the component

  const handleLogout = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.get('/api/users/logout');
      if (response.status === 200) {
        router.push("/login"); // ✅ Redirect to login after logout
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  return (
    <aside className="w-1/6 h-[800px] bg-white rounded-3xl border border-[#DDDDDD] flex flex-col justify-between">
      <div className="p-4">
        <h2 className="text-xl text-center font-bold text-purple-700">AI Notes</h2>
        <nav className="mt-6">
          <ul>
            <button 
              onClick={() => {setIsHomeView(true)}}
              className={`flex items-center w-full space-x-2 p-3 rounded-lg
                ${isHomeView ? "bg-purple-100 text-purple-700" : "text-gray-400"}`}
            >
              <svg className="mr-2 transition-all duration-300 ease-linear" width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                  className={`${isHomeView ? "fill-[#6D33AF]" : "fill-[#C7C7C7]" }`}
                  d="M13.2708 2.41667C13.1732 2.30926 13.0542 2.22343 12.9215 2.1647C12.7887 2.10598 12.6452 2.07564 12.5
                  2.07564C12.3548 2.07564 12.2113 2.10598 12.0785 2.1647C11.9458 2.22343 11.8268 2.30926 11.7292 2.41667L2.35417 
                  12.8333C2.21593 12.9824 2.12432 13.1686 2.09064 13.3691C2.05696 13.5696 2.08267 13.7756 2.16462 13.9616C2.24657 
                  14.1476 2.38116 14.3056 2.55181 14.4161C2.72247 14.5266 2.92171 14.5847 3.125 14.5833H5.20833V21.875C5.20833 22.1513 
                  5.31808 22.4162 5.51343 22.6116C5.70878 22.8069 5.97373 22.9167 6.25 22.9167H18.75C19.0263 22.9167 19.2912 
                  22.8069 19.4866 22.6116C19.6819 22.4162 19.7917 22.1513 19.7917 21.875V14.5833H21.875C22.1513 14.5833 22.4162 
                  14.4736 22.6116 14.2782C22.8069 14.0829 22.9167 13.8179 22.9167 13.5417C22.9186 13.2799 22.8219 13.027 22.6458 12.8333L13.2708 2.41667Z" 
                  fill="#6D33AF"/>
              </svg>Home
            </button>
            <button 
              onClick={() => {setIsHomeView(false)}}
              className={`flex items-center w-full space-x-2 p-3 rounded-lg
                ${isHomeView ? "text-gray-400" : "bg-purple-100 text-purple-700"}`}
            >
              <svg className="mr-2 transition-all duration-300 ease-linear" width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                  className={`${isHomeView ? "fill-[#C7C7C7]" : "fill-[#6D33AF]" }`}
                  d="M14.426 4.39583C13.7135 2.70208 11.2865 2.70208 10.574 4.39583L8.74688 8.73646L4.00521 9.1125C2.15625 9.25833
                  1.40625 11.5406 2.81563 12.7344L6.42813 15.7937L5.32396 20.3687C4.89375 22.1531 6.85729 23.5635 8.44063 22.6073L12.5 20.1562L16.5594
                  22.6083C18.1427 23.5646 20.1063 22.1542 19.676 20.3687L18.5719 15.7958L22.1844 12.7354C23.5938 11.5417 22.8438 9.26041 20.9948 
                  9.11354L16.2531 8.73854L14.426 4.39583Z" 
                  fill="#C7C7C7"/>
              </svg>Favourites
            </button>
          </ul>
        </nav>
      </div>
      <div className={`transition-all duration-500 linear bg-gray-200 
          ${showLogoutBtn ? "h-[120px] rounded-xl" : "h-[60px]"} rounded-b-3xl flex flex-col items-center justify-evenly`}>
        <div className="flex justify-center items-center">
          {showLogoutBtn && 
            <div>
              <div className="w-40 border rounded-xl">
                <button 
                  className="transition-all duration-500 linear block bg-purple-400 w-full hover:bg-purple-600 text-white rounded-xl py-2"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </div>
            
            
          }
        </div>
        <div className="w-full flex items-center justify-evenly">
          <span className="w-[30px] h-[30px] bg-gray-500 rounded-full">
            <Image className="rounded-full" src={image4} width={30} height={30} alt="Profile Picture" />
          </span>
          <span className="text-lg text-bold">{data.name}</span>
          <button onClick={() => {setShowLogoutBtn(!showLogoutBtn)} } className="text-purple-400 hover:text-purple-600 text-[20px] dropbtn transition">{ showLogoutBtn ? `▼` : `▲`}</button>
        </div>
      </div>
    </aside>
  )
}
