import { useState } from "react";
import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const DropdownMenu = ({ children }) => {
  return <div className="relative inline-block text-left">{children}</div>;
};

const DropdownMenuTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <Button
    ref={ref}
    className={cn("flex items-center gap-1", className)}
    {...props}
  />
));
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

const DropdownMenuContent = ({ children, align = "end" }) => {
  return (
    <div
      className={cn(
        "absolute mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50",
        align === "end" ? "right-0" : "left-0"
      )}
    >
      <div className="py-1">{children}</div>
    </div>
  );
};

const DropdownMenuItem = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="block w-full px-4 py-2 text-left text-sm text-gray-200 hover:bg-gray-700"
    >
      {children}
    </button>
  );
};

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem };
