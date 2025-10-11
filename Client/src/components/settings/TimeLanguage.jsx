import { Clock, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function TimeLanguage() {
  const [clockFormat, setClockFormat] = useState("12-hour");

  useEffect(() => {
    const sc = localStorage.getItem("clock-format");
    if (sc) setClockFormat(sc);
  }, []);

  const onClockChange = (value) => {
    setClockFormat(value);
    localStorage.setItem("clock-format", value);
  };

  const options = [
    { value: "12-hour", label: "12-hour (2:30 PM)" },
    { value: "24-hour", label: "24-hour (14:30)" },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-[1080px] mx-auto">
      {/* Clock Format */}
      <section className=" p-6">
        <div className="flex items-center gap-3 mb-4">
          <Clock className="w-5 h-5 text-[var(--btn)]" />
          <h3 className="text-xl font-semibold txt">Clock Format</h3>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between px-4 py-3 bg-[var(--bg-sec)] border border-transparent rounded-xl text-[var(--txt)] hover:bg-[var(--bg-ter)] focus:ring-2 focus:ring-[var(--btn)] focus:border-transparent transition-all"
            >
              {options.find((o) => o.value === clockFormat)?.label ||
                "Select format"}
              <ChevronDown className="w-6 h-6 opacity-70" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="start"
            className="w-96 bg-[var(--bg-sec)] border border-gray-700/30 rounded-md shadow-lg"
          >
            {options.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => onClockChange(option.value)}
                className={`cursor-pointer hover:bg-[var(--bg-ter)] ${
                  clockFormat === option.value
                    ? "bg-[var(--btn)] text-white"
                    : "text-[var(--txt)]"
                }`}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </section>
    </div>
  );
}

export default TimeLanguage;
