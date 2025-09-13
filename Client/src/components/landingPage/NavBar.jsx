import { LogIn } from "lucide-react";

function NavBar() {
  return (
    <nav className="w-[calc(100vw-80px)] sm:w-[calc(100vw-80px)] pb-0 p-2 sm:p-4 flex justify-between items-center z-50">
      <h1 className="text-xl sm:text-2xl lg:text-3xl txt font-bold">
        EduHaven
      </h1>
      <a
        href="/auth/login"
        className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 text-sm sm:text-base"
        style={{ backgroundColor: "var(--btn)", color: "white" }}
      >
        <LogIn size={16} className="sm:hidden" />
        <LogIn size={18} className="hidden sm:block" />
        <span className="hidden sm:inline">Login / Signup</span>
        <span className="sm:hidden">Login</span>
      </a>
    </nav>
  );
}

export default NavBar;
