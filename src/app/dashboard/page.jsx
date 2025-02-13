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

        <div className=" rounded-3xl flex sm:flex-col md:flex-col lg:flex-row h-full max-w-[1440px] m-auto bg-white">
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
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center justify-evenly bg-purple-400 p-3 rounded-full shadow-lg border border-[#DDDDDDD] w-[200px]">
            <button onClick={() => openNoteModal(null)}  className="p-4 bg-white hover:bg-purple-200 rounded-full">✏️ Add a new Note</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
