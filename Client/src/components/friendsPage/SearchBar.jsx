import { useState } from "react";
import { Search } from "lucide-react";
import PropTypes from "prop-types";
import { Button } from "@/components/ui/button";

function SearchBar({ onSearch, placeholder = "Search friends..." }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div className="relative mb-0 w-full max-w-2xl xl:max-w-xl lg:max-w-lg">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="w-5 h-5 txt-dim" />
      </div>
      <input
        type="text"
        className="bg-ter border-none txt text-sm rounded-xl focus:ring-[var(--btn)] focus:border-[var(--btn)] block w-full pl-10 p-3"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleSearch}
      />
      {searchTerm && (
        <Button
          variant="transparent"
          size="icon"
          className="absolute inset-y-0 right-0 pr-3 txt-dim hover:text-[var(--btn)] transition-colors"
          onClick={() => {
            setSearchTerm("");
            onSearch("");
          }}
        >
          ✕
        </Button>
      )}
    </div>
  );
}
SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

export default SearchBar;
