import {
  CircleUser,
  CircleUserRound,
  GraduationCap,
  LogIn,
  LogOut,
  Palette,
  Settings2,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ConfirmLogoutModal from "../ConfirmLogoutModal";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/stores/userStore";

const Sidebar = ({ user, activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const { isBasicInfoComplete, isEduSkillsComplete } = useUserStore();

  const tabs = [
    {
      key: "basic-info",
      label: "Basic Info",
      icon: <CircleUser size={24} />,
      incomplete: !isBasicInfoComplete(),
    },
    {
      key: "edu-skills",
      label: "Education & Skills",
      icon: <GraduationCap size={24} />,
      incomplete: !isEduSkillsComplete(),
    },
    { key: "account", label: "Account", icon: <CircleUserRound size={24} /> },
    { key: "friends", label: "Friends", icon: <Users size={24} /> },
    { divider: true },
    { key: "themes", label: "Themes", icon: <Palette size={24} /> },
    {
      key: "time-language",
      label: "Time",
      icon: <Settings2 size={24} />,
    },
  ];

  return (
    <>
      <aside className="w-60 xl:w-72 h-screen bg-sec shadow-md relative">
        <h1 className="px-8 py-4 mt-6 text-xl font-bold pb-0">Settings</h1>
        <nav className="p-2 xl:p-4 space-y-0">
          {tabs.map((tab, idx) =>
            tab.divider ? (
              <div
                key={`divider-${idx}`}
                className="border-t border-gray-400/30 !my-2"
              />
            ) : (
              <Button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                variant={activeTab === tab.key ? "default" : "ghost"}

                className={`group flex items-center justify-between p-3 rounded-lg text-md w-full text-nowrap transition relative ${
                      activeTab === tab.key
                        ? "bg-[var(--btn)] text-white"
                        : "hover:bg-ter"
                    }`} // <-- Removed the "tab.incomplete" red background logic

              >
                <span className="flex items-center gap-1.5">
                  {tab.icon} {tab.label}
                  {tab.incomplete && (
                        // This is the new green dot.
                        // Adjust w-2.5 h-2.5 (width/height) if you want it bigger or smaller.
                        <span className="ml-2 w-2.5 h-2.5 bg-green-500 rounded-full"></span>
                      )}
                </span>
              </Button>
            )
          )}
        </nav>

        <div className="absolute bottom-4 w-full px-4">
          {user ? (
            <Button
              onClick={() => setShowLogoutModal(true)}
              variant="transparent"
              className="m-auto flex items-center justify-center px-4 py-2 text-red-400 hover:bg-red-500 hover:text-white rounded gap-2"
            >
              <LogOut size={16} />
              Logout
            </Button>
          ) : (
            <Button
              onClick={() => navigate("/auth/login")}
              variant="transparent"
              className="m-auto flex items-center justify-center px-5 py-2 text-green-400 hover:bg-green-500 hover:text-white rounded-lg gap-2 border border-green-500"
            >
              <LogIn size={16} />
              Login
            </Button>
          )}
        </div>
      </aside>

      {showLogoutModal && (
        <ConfirmLogoutModal
          onConfirm={() => {
            setShowLogoutModal(false);
            navigate("/signout");
          }}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
