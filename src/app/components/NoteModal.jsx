
import { useState } from "react"
import axios from "axios"
import SpeechRecorder from "@/app/components/SpeechRecorder";

const NoteModal = ({ userId, data, isVisible, onClose, onUpdate }) => {
  if (!isVisible) return null

  console.log("noteModal", data)

  const isNewNote = !data; // ✅ Check if creating a new note

  const defaultData = { 
    title: data?.title || "", 
    text: data?.text || "", 
    audio: data?.audio || "", 
    transcript: data?.transcript || "", 
    images: data?.images || [], 
    isFavorite: data?.isFavorite || false, 
    createdAt: data?.createdAt || new Date(),
    updatedAt: data?.updatedAt || new Date()
  };

  const [newData, setNewData] = useState(defaultData)
  const [isFullScreen, setIsFullScreen] = useState(false)

  const onValueChange = (e) => {
    setNewData({ ...newData, [e.target.name]: e.target.value})
  }

  let createdAtTimeStamp = new Date()
  let timeStamp = `${createdAtTimeStamp.toUTCString()}`

  const handleSave = async () => {
    try {
      if (!userId) {
        console.error("❌ Missing userId");
        return;
      }
  
      let res;
      if (isNewNote) {
        res = await axios.post("/api/data", { userId, ...newData });
      } else {
        res = await axios.put("/api/data", { userId, noteId: data._id, ...newData });
      }
  
      console.log("✅ Note Saved:", res.data);
      onClose(); 
      setTimeout(() => onUpdate(), 100); // ✅ Ensure state updates
    } catch (err) {
      console.error("❌ Note saving error:", err.response?.data || err.message);
    }
  };
  
  const handleDelete = async () => {
    try {
      if (!userId || !data?._id) {
        console.error("❌ Missing userId or noteId");
        return;
      }
  
      const res = await axios.delete("/api/data", { data: { userId, noteId: data._id } });
  
      console.log("✅ Note Deleted:", res.data);
      onClose();
      onUpdate();
    } catch (err) {
      console.error("❌ Note delete error:", err.response?.data || err.message);
    }
  };

  const toggleFullScreen = () => {
    setIsFullScreen((prev) => !prev);
  }
  
  const toggleFavorite = () => {
    setNewData({ ...newData, isFavorite: !newData.isFavorite });
  }

  const handleTranscript = (transcriptText) => {
    setNewData((prev) => ({
      ...prev,
      transcript: transcriptText, // ✅ Ensures transcript is always updated
    }));
    console.log("transcript Text", transcriptText)
  };

  const handleAudioUrl = (audioUrl) => {
    setNewData((prev) => ({
      ...prev,
      audio: audioUrl, // ✅ Ensures audio is properly saved
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const res = await axios.post("/api/upload/images", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      if (res.data.imageUrl) {
        setNewData((prev) => ({
          ...prev,
          images: [...prev.images, res.data.imageUrl], // ✅ Add image URL to array
        }));
      }
    } catch (error) {
      console.error("Image upload failed:", error);
    }
  };
  
  // ✅ Remove an image from the list
  const handleRemoveImage = async (index) => {
    const imageUrl = newData.images[index];

    try {
      await axios.post("/api/upload/deleteImage", { imageUrl });

      // Remove image from state
      setNewData((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
      }));

      console.log("✅ Image Deleted:", imageUrl);
    } catch (error) {
      console.error("❌ Image delete failed:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
      <div 
        id="modal-inner" 
        className={`border-[#dddddd] rounded-3xl transition-all duration-500 ease-in-out p-4 
          transform border w-1/2 overflow-y-scroll flex flex-col
        ${isFullScreen ? "w-[90%] h-[90%]" : "w-[50%] h-[50%]"} bg-white`}
      >
        <div className="flex mb-4 w-full justify-between">
          <div>
            <button 
              className="transition-all duration-300 ease-linear hover:bg-[#E1e1e1] w-[40px] h-[40px] rounded-full bg-[#f3f3f3] flex justify-center items-center"
              onClick={toggleFullScreen}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M14.1163 5H12.31V3.75H16.25V7.69H15V5.88375L11.6925 9.1925L10.8075 8.3075L14.1163 5ZM5 14.1163L8.3075 10.8075L9.1925 11.6925L5.88375 15H7.69V16.25H3.75V12.31H5V14.1163Z" fill="black"/>
              </svg>
            </button>
          </div>
          <div className="flex items-center space-x-4">
          {/* Favorite Button */}
          <button 
            className="transition-all duration-300 ease-linear hover:bg-[#E1e1e1] w-[40px] h-[40px] rounded-full bg-[#f3f3f3] flex justify-center items-center"
            onClick={toggleFavorite}
          >
            <svg className="transition-all duration-300 ease-linear" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                className={`${newData.isFavorite ? "fill-yellow-400" : "fill-[#c7c7c7]"}`} 
                d="M11.5409 3.51662C10.9709 2.16162 9.02919 2.16162 8.45919 3.51662L6.99752 6.98912L3.20419 
                7.28995C1.72502 7.40662 1.12502 9.23245 2.25252 10.1874L5.14252 12.6349L4.25919 16.295C3.91502 
                17.7225 5.48585 18.8508 6.75252 18.0858L10 16.1249L13.2475 18.0866C14.5142 18.8516 16.085 17.7233 
                15.7409 16.295L14.8575 12.6366L17.7475 10.1883C18.875 9.23328 18.275 7.40828 16.7959 7.29078L13.0025 
                6.99078L11.5409 3.51662Z"
              />
            </svg>  
          </button>
          <button 
            className="flex justify-center items-center w-[80px] h-[40px] rounded-full bg-purple-100 hover:bg-purple-300 transition-all duration-300 ease-linear"
            onClick={handleSave}
            >
            <p className="text-center font-medium">Save</p>
          </button>
          <button 
            className="flex justify-center items-center w-[80px] h-[40px] rounded-full hover:bg-[#e25252] bg-[#fd6f6f] transition-all duration-300 ease-linear"
            onClick={handleDelete}
            >
            <p className="text-center text-white font-medium">Delete</p>
          </button>
          <button 
            className="transition-all duration-300 ease-linear hover:bg-[#E1e1e1] w-[40px] h-[40px] rounded-full bg-[#f3f3f3] flex justify-center items-center"
            onClick={onClose}
            >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.6667 3.33337L3.33337 16.6667M3.33337 3.33337L16.6667 16.6667"
                stroke="black"
                strokeWidth="3" 
                strokeLinecap="round"
                />
            </svg>
          </button>
        </div>

        </div>
        <div className="flex w-full flex-col">
          <input 
            type="text"
            name="title"
            className="mb-2 hover:text-[#7e7e7e] focus:outline-0 focus:border-[#757575] transition text-2xl mr-5" 
            placeholder="Note Title" 
            value={newData.title} 
            onChange={onValueChange}
            />
          <p className="mb-4 text-lg text-[#c4c4c4] justify-start" >{data?.notes?.createdAt ? data.notes.createdAt : timeStamp}</p>
        </div>
        {data?.audio && 
          <audio controls className="mb-4 w-full ">
            <source src={data.audio} type="audio/webm" />
            Your browser does not support the audio element.
          </audio>
        }
        <div>
          <textarea 
            type="text"
            name="text"
            value={newData.text} 
            onChange={onValueChange}
            className="p-4 border border-[#dddddd] focus:outline-0 rounded-2xl w-full h-full
          "></textarea>
        </div>
        <div>
          <SpeechRecorder onAudioUrl={handleAudioUrl} onTranscript={handleTranscript} />
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Images</h3>
          <div className="flex items-center gap-4 mt-2 overflow-x-auto">
            {/* Display uploaded images */}
            {newData.images.map((img, index) => (
              <div key={index} className="relative w-[100px] h-[100px]">
                <img
                  src={img}
                  alt={`Uploaded ${index}`}
                  className="w-full h-full object-cover rounded-lg shadow-sm"
                />
                <button
                  className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full"
                  onClick={() => handleRemoveImage(index)}
                >
                  ✖
                </button>
              </div>
            ))}

            {/* Upload New Image Button */}
            <label className="w-[100px] h-[100px] flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
              <span className="text-gray-500 text-sm">+ Image</span>
              <input type="file" className="hidden" onChange={handleImageUpload} />
            </label>
          </div>
        </div>

      </div>
    </div>
  )
}

export default NoteModal