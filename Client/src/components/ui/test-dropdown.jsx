import React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown";

export default function TestDropdown() {
  const handleSelect = (action) => {
    console.log("Selected:", action);
    alert(`You selected: ${action}`);
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Dropdown Test</h1>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <button
            style={{
              padding: "8px 16px",
              background: "#0070f3",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            Open Menu
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => handleSelect("Option 1")}>
            Option 1
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSelect("Option 2")}>
            Option 2
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSelect("Option 3")}>
            Option 3
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
