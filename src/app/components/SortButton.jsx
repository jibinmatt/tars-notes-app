import { useState } from "react";
import { SlidersHorizontal } from "lucide-react"; // ✅ Using Lucide React for icon

const SortButton = ({ sortOrder, setSortOrder }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="relative">
      {/* ✅ Sort Button */}
      <button 
        className="hover:bg-[#DDDDDD] py-[18px] px-[29px] h-[60px] w-[128px] bg-gray-200 rounded-full flex items-center justify-evenly text-[16px] text-extrabold"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <SlidersHorizontal size={18} className="text-black" />
        <span className="text-black text-extrabold font-medium">Sort</span>
      </button>

      {/* ✅ Dropdown Menu */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-36 bg-white border rounded-lg shadow-lg">
          <button
            className={`block w-full text-left px-4 py-2 text-sm ${sortOrder === "newest" ? "bg-gray-100 font-semibold" : ""}`}
            onClick={() => { setSortOrder("newest"); setShowDropdown(false); }}
          >
            Newest First
          </button>
          <button
            className={`block w-full text-left px-4 py-2 text-sm ${sortOrder === "oldest" ? "bg-gray-100 font-semibold" : ""}`}
            onClick={() => { setSortOrder("oldest"); setShowDropdown(false); }}
          >
            Oldest First
          </button>
        </div>
      )}
    </div>
  );
};

export default SortButton;
