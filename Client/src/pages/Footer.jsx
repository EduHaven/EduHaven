import { FaGraduationCap } from "react-icons/fa"; // Example Eduhaven icon (instead of GitHub logo)

export default function Footer() {
  return (
    <footer className="bg-[#161b22] border-t border-gray-800 py-6">
      <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center items-center gap-6 text-sm text-gray-400">
        
        {/* Left Icon */}
        <FaGraduationCap className="text-xl text-gray-400" />

        {/* Inline Links + Text */}
        <span>© 2025 Eduhaven, Inc.</span>
        <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
        <a href="#" className="hover:text-white transition-colors">Terms</a>
        <a href="#" className="hover:text-white transition-colors">Contact</a>
      </div>
    </footer>
  );
}
