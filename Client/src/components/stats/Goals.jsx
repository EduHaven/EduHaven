import { useEffect, useState } from "react";
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
import axiosInstance from "@/utils/axios";
import { useParams } from "react-router-dom";

const Goals = ({ isCurrentUser = false }) => {
  const { userId } = useParams();

  const [view, setView] = useState("weekly");
  const [isOpen, setIsOpen] = useState(false);
  const [chartData, setChartData] = useState({
    daily: [],
    weekly: [],
    monthly: [],
  });
  const [totalStats, setTotalStats] = useState({ completed: 0, total: 0 });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        let response;
        if (isCurrentUser) {
          response = await axiosInstance.get(`/todo?view=${view}`);
        } else {
          response = await axiosInstance.get(
            `/todo/user/${userId}?view=${view}`
          );
        }

        // console.log(response.data);

        setChartData((prev) => ({ ...prev, [view]: response.data.chartData }));
        setTotalStats({
          completed: response.data.completed,
          total: response.data.total,
        });
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [view, isCurrentUser, userId]);

  const handleDropdownClick = (viewType) => {
    setView(viewType);
    setIsOpen(false);
  };

  return (
    <div className="bg-[var(--bg-sec)] p-6 pl-0 rounded-3xl shadow-md text-center w-full">
      <nav className="flex justify-between items-center pl-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />{" "}
          <strong>{totalStats.completed}</strong>/
          <strong>{totalStats.total}</strong>
          Goals done
        </h3>
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="transparent">
              {view.charAt(0).toUpperCase() + view.slice(1)}
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
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
        </DropdownMenu>
      </nav>

      <div className="mt-4 w-full" style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData[view]}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              contentStyle={{
                background: "var(--bg-ter)",
                color: "var(--txt)",
                border: "none",
                borderRadius: "0.5rem",
                boxShadow:
                  "0 4px 6px -1px rgba(var(--shadow-rgb), 0.1), 0 2px 4px -1px rgba(var(--shadow-rgb), 0.06)",
              }}
            />
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
