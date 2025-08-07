import { Outlet, useLocation } from "react-router-dom";

import { motion } from "framer-motion";
import Sidebar from "./Sidebar.jsx";
import UseSocketContext from "@/context/SocketContext.jsx";

function Layout() {
  const location = useLocation();
  UseSocketContext();
  return (
    <div className="flex min-h-screen bg-primary txt !transition-colors !duration-500">
      <Sidebar />

      <main className="flex-1 ml-[70px]">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
}

export default Layout;
