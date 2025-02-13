"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import NotesList from "../components/NotesList";
import Sidebar from "../components/Sidebar";
import NoteModal from "../components/NoteModal";
import SortButton from "../components/SortButton";

const Dashboard = () => {
  const [userId, setUserId] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isHomeView, setIsHomeView] = useState(true)
  const [data, setData] = useState({});
  const [showModal, setShowModal] = useState(false)
  const [refresh, setRefresh] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("oldest");

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const res = await axios.get("/api/auth/me", { withCredentials: true });
        console.log("API Response:", res.data);
        setUserId(res.data.userId);
      } catch (error) {
        console.error("Error fetching user ID:", error.response?.data || error.message);
      }
    };
  
    fetchUserId();
  }, []);
  
  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/data?userId=${userId}`, { withCredentials: true });
        setData(res.data.data);
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };
    
    fetchData();
  }, [userId, refresh]);

  const openNoteModal = (note = null) => {
    setSelectedNote(note);
    setShowModal(true);
  };

  const handleUpdate = () => {
    console.log("✅ Refreshing Notes...");
    setRefresh((prev) => !prev); // ✅ Toggle refresh state to reload NotesList
  };


  return (
    <div className="border border-red border-solid min-h-screen bg-[#ffffff] flex justify-center items-center">
      <div className=" bg-white w-4/5 rounded-3xl">

        <div className=" rounded-3xl flex h-full max-w-[1440px] m-auto bg-white">
          <Sidebar isHomeView={isHomeView} setIsHomeView={setIsHomeView} data={data} />
          {/* Main Content */}
          <main className="rounded-3xl flex px-6 w-full flex-col">
            {/* Search & Sort */}
            <div className="flex justify-between mb-6">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="transition focus:outline-0 focus:border-[#757575] border border-[#DDDDDD] h-[60px] w-full px-4 py-2 rounded-full mr-6"
              />
              {/* <button className="hover:bg-[#DDDDDD] py-[18px] px-[29px] h-[60px] w-[128px] bg-gray-200 rounded-full flex items-center justify-evenly text-[16px] text-extrabold">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 5C8.73478 5 8.48043 5.10536 8.29289 5.29289C8.10536 5.48043 8 5.73478 8 6C8 6.26522 8.10536 6.51957 8.29289 6.70711C8.48043 6.89464 8.73478 7 9 7C9.26522 7 9.51957 6.89464 9.70711 6.70711C9.89464 6.51957 10 6.26522 10 6C10 5.73478 9.89464 5.48043 9.70711 5.29289C9.51957 5.10536 9.26522 5 9 5ZM6.17 5C6.3766 4.41447 6.75974 3.90744 7.2666 3.54879C7.77346 3.19015 8.37909 2.99755 9 2.99755C9.62091 2.99755 10.2265 3.19015 10.7334 3.54879C11.2403 3.90744 11.6234 4.41447 11.83 5H19C19.2652 5 19.5196 5.10536 19.7071 5.29289C19.8946 5.48043 20 5.73478 20 6C20 6.26522 19.8946 6.51957 19.7071 6.70711C19.5196 6.89464 19.2652 7 19 7H11.83C11.6234 7.58553 11.2403 8.09257 10.7334 8.45121C10.2265 8.80986 9.62091 9.00245 9 9.00245C8.37909 9.00245 7.77346 8.80986 7.2666 8.45121C6.75974 8.09257 6.3766 7.58553 6.17 7H5C4.73478 7 4.48043 6.89464 4.29289 6.70711C4.10536 6.51957 4 6.26522 4 6C4 5.73478 4.10536 5.48043 4.29289 5.29289C4.48043 5.10536 4.73478 5 5 5H6.17ZM15 11C14.7348 11 14.4804 11.1054 14.2929 11.2929C14.1054 11.4804 14 11.7348 14 12C14 12.2652 14.1054 12.5196 14.2929 12.7071C14.4804 12.8946 14.7348 13 15 13C15.2652 13 15.5196 12.8946 15.7071 12.7071C15.8946 12.5196 16 12.2652 16 12C16 11.7348 15.8946 11.4804 15.7071 11.2929C15.5196 11.1054 15.2652 11 15 11ZM12.17 11C12.3766 10.4145 12.7597 9.90743 13.2666 9.54879C13.7735 9.19015 14.3791 8.99755 15 8.99755C15.6209 8.99755 16.2265 9.19015 16.7334 9.54879C17.2403 9.90743 17.6234 10.4145 17.83 11H19C19.2652 11 19.5196 11.1054 19.7071 11.2929C19.8946 11.4804 20 11.7348 20 12C20 12.2652 19.8946 12.5196 19.7071 12.7071C19.5196 12.8946 19.2652 13 19 13H17.83C17.6234 13.5855 17.2403 14.0926 16.7334 14.4512C16.2265 14.8099 15.6209 15.0025 15 15.0025C14.3791 15.0025 13.7735 14.8099 13.2666 14.4512C12.7597 14.0926 12.3766 13.5855 12.17 13H5C4.73478 13 4.48043 12.8946 4.29289 12.7071C4.10536 12.5196 4 12.2652 4 12C4 11.7348 4.10536 11.4804 4.29289 11.2929C4.48043 11.1054 4.73478 11 5 11H12.17ZM9 17C8.73478 17 8.48043 17.1054 8.29289 17.2929C8.10536 17.4804 8 17.7348 8 18C8 18.2652 8.10536 18.5196 8.29289 18.7071C8.48043 18.8946 8.73478 19 9 19C9.26522 19 9.51957 18.8946 9.70711 18.7071C9.89464 18.5196 10 18.2652 10 18C10 17.7348 9.89464 17.4804 9.70711 17.2929C9.51957 17.1054 9.26522 17 9 17ZM6.17 17C6.3766 16.4145 6.75974 15.9074 7.2666 15.5488C7.77346 15.1901 8.37909 14.9976 9 14.9976C9.62091 14.9976 10.2265 15.1901 10.7334 15.5488C11.2403 15.9074 11.6234 16.4145 11.83 17H19C19.2652 17 19.5196 17.1054 19.7071 17.2929C19.8946 17.4804 20 17.7348 20 18C20 18.2652 19.8946 18.5196 19.7071 18.7071C19.5196 18.8946 19.2652 19 19 19H11.83C11.6234 19.5855 11.2403 20.0926 10.7334 20.4512C10.2265 20.8099 9.62091 21.0025 9 21.0025C8.37909 21.0025 7.77346 20.8099 7.2666 20.4512C6.75974 20.0926 6.3766 19.5855 6.17 19H5C4.73478 19 4.48043 18.8946 4.29289 18.7071C4.10536 18.5196 4 18.2652 4 18C4 17.7348 4.10536 17.4804 4.29289 17.2929C4.48043 17.1054 4.73478 17 5 17H6.17Z" fill="black"/>
                </svg>Sort
              </button> */}
              <SortButton sortOrder={sortOrder} setSortOrder={setSortOrder} />
            </div>

            {/* Notes Grid */}
            <NotesList 
              userId={userId} 
              refresh={refresh}
              openNoteModal={openNoteModal} 
              isHomeView={isHomeView} 
              notes={data?.notes ? data.notes : []}
              searchQuery={searchQuery}
              sortOrder={sortOrder}
            />
          </main>

          {showModal && (
            <NoteModal
              userId={userId}
              data={selectedNote}
              isVisible={showModal}
              onClose={() => setShowModal(false)}
              onUpdate={handleUpdate}
            />
          )}

          {/* Bottom Action Bar */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center justify-evenly bg-white p-3 rounded-full border border-[#DDDDDDD] w-[300px]">
            <button onClick={() => openNoteModal(null)}  className="p-2 bg-gray-200 rounded-full">✏️</button>
            <button onClick={() => openNoteModal(null)}  className="p-2 bg-gray-200 rounded-full">🖼️</button>
            <button onClick={() => openNoteModal(null)}  className="p-3 bg-red-500 text-white rounded-full">▶ Start Recording</button>
          </div>
        </div>
        {/*  */}
       
      </div>
    </div>
  );
};

export default Dashboard;
