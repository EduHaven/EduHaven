import { useState } from "react";
import { CheckCircle, ChevronDown } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const data = {
  daily: [
    { name: "Mon", completed: 5, pending: 3 },
    { name: "Tue", completed: 12, pending: 2 },
    { name: "Wed", completed: 8, pending: 4 },
    { name: "Thu", completed: 15, pending: 5 },
    { name: "Fri", completed: 10, pending: 3 },
    { name: "Sat", completed: 18, pending: 1 },
    { name: "Sun", completed: 20, pending: 0 },
  ],
  weekly: [
    { name: "Week 1", completed: 40, pending: 10 },
    { name: "Week 2", completed: 52, pending: 8 },
    { name: "Week 3", completed: 38, pending: 12 },
    { name: "Week 4", completed: 60, pending: 6 },
  ],
  monthly: [
    { name: "Jan", completed: 150, pending: 20 },
    { name: "Feb", completed: 180, pending: 15 },
    { name: "Mar", completed: 120, pending: 25 },
    { name: "Apr", completed: 200, pending: 10 },
  ],
};

const Goals = () => {
  const [view, setView] = useState("weekly");
  const [isOpen, setIsOpen] = useState(false); // Add state to manage dropdown visibility

  const handleDropdownClick = (viewType) => {
    setView(viewType);
    setIsOpen(false); // Close the dropdown when an item is selected
  };

  return (
    <div className="bg-gray-800 p-6 pl-0 rounded-3xl shadow-md text-center w-full">
      <nav className="flex justify-between items-center pl-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-500" /> <strong>13</strong>
          /<strong>135</strong>
          Goals done
        </h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="flex items-center gap-1 hover:bg-gray-700"
              onClick={() => setIsOpen(!isOpen)}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}{" "}
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          {isOpen && (
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleDropdownClick("daily")}>
                Daily
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDropdownClick("weekly")}>
                Weekly
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDropdownClick("monthly")}>
                Monthly
              </DropdownMenuItem>
            </DropdownMenuContent>
          )}
        </DropdownMenu>
      </nav>

      <div className="mt-4 w-full" style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data[view]}>
            <XAxis dataKey="name" stroke="#ddd" />
            <YAxis stroke="#ddd" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="completed"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="pending"
              stroke="#ef4444"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Goals;
