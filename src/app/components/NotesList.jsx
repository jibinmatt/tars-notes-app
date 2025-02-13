import PropTypes from "prop-types";
import ImgIcon from "@/app/assets/img-icon.png"
import Image from "next/image";
import { Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast";

const NotesList = ({ isHomeView, notes, openNoteModal, searchQuery, sortOrder }) => {
  const { toast } = useToast()
  let filteredNotes = isHomeView ? notes : notes.filter((note) => note.isFavorite);

  if (searchQuery.trim() !== "") {
    filteredNotes = filteredNotes.filter((note) =>
      (note.title && note.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (note.text && note.text.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (note.transcript && note.transcript.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }

  filteredNotes.sort((a, b) => {
    if (sortOrder === "oldest") {
      return new Date(a.createdAt) - new Date(b.createdAt);
    } else {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      console.log("Copied Note")
      toast({
        description: "Copied text to Clipboard",
      })
    } catch (err) {
      console.error("Failed to copy note text", err)
    }
  }
  
  return (
    <div className="overflow-y-scroll h-[716px] ">
      {filteredNotes.length === 0 ? (
        <p className="transition w-1/5 mr-2 hover:bg-[#dddddd] hover:cursor-pointer border border-[#dddddd] p-4 rounded-3xl h-[350px]">No notes found.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {filteredNotes.map((note) => (
            <li
              className="flex flex-col transition mr-2 hover:bg-[#f7f7f7] hover:cursor-pointer border border-[#dddddd] p-4 rounded-3xl h-[350px]" 
              key={note._id}>
              <div onClick={() => {openNoteModal(note)}} >
                <div className="flex justify-between items-center">
                  {note.createdAt && <p className="text-bold text-sm text-[#c7c7c7]">
                    {dateParser(note.createdAt).map((dateSlug) => (`${dateSlug} `))}
                  </p>}
                </div>
                
                {note.title && <p className="text-extrabold text-2xl truncate mb-2">{note.title}</p>}
                {note.text && <p className="text-sm truncate mb-2">{note.text}</p>}
                {note.audio && <audio controls className="rounded-full border flex items-center justify-center border-[#d7d7d7] mb-2 w-full h-[40px]">
                    <source src={note.audio} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>}
                {note.transcript && (
                  <p className="mb-2 h-min truncate bg-[#fefefe] rounded-xl border border-[#eeeeee] p-2 " >"{note.transcript}"</p>
                )}
                {note.images.length > 0 && (
                  <div className="bg-[#EEEEEE] rounded-full w-[100px] p-1 mb-2 flex justify-center items-center space-x-2 text-gray-600 text-sm font-bold">
                    <Image src={ImgIcon} alt="image-icon" size={16} className="text-gray-500" />
                    <p>{note.images.length} {note.images.length === 1 ? "Image" : "Images"}</p>
                </div>
                )}
              </div>
              {note.text && (
                <div className="rounded-full flex justify-end mt-auto ">
                  <button 
                    className="w-10 border hover:bg-white border-[#DDDDDD] h-10 flex justify-center items-center rounded-full"
                    onClick={() => {copyText(note.text)}}
                    ><Copy size={18} className="text-black" />
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function dateParser(date) {
  let parsedDate = new Date(date)
  parsedDate = parsedDate.toUTCString().split(" ")
  return parsedDate.splice(1, 3)
}

NotesList.propTypes = {
  notes: PropTypes.array.isRequired
};

export default NotesList