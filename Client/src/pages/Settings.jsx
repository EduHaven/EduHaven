import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useUserProfile } from "@/contexts/UserProfileContext";
import Sidebar from "@/components/settings/Sidebar";
import BasicInfo from "@/components/settings/BasicInfo";
import Account from "@/components/settings/Account";
import Friends from "@/components/settings/Friends";
import Themes from "@/components/settings/Themes";
import EducationAndSkills from "@/components/settings/EducationAndSkills";
import TimeLanguage from "@/components/settings/TimeLanguage";
import NotLogedInPage from "@/components/NotLogedInPage";
import { useSearchParams } from "react-router-dom";

const Settings = () => {
  const { user, fetchUserDetails } = useUserProfile();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        fetchUserDetails(decoded.id);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [fetchUserDetails]);

  const validTabs = [
    "basic-info",
    "edu-skills",
    "account",
    "friends",
    "themes",
    "time-language",
  ];

  const activeTab = validTabs.includes(searchParams.get("tab"))
    ? searchParams.get("tab")
    : "basic-info";

  useEffect(() => {
    if (!searchParams.get("tab")) {
      setSearchParams({ tab: "basic-info" }, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const renderActiveTab = () => {
    const protectedTabs = ["basic-info", "edu-skills", "account", "friends"];
    if (!user && protectedTabs.includes(activeTab)) {
      return <NotLogedInPage />;
    }

    switch (activeTab) {
      case "basic-info":
        return <BasicInfo />;
      case "edu-skills":
        return <EducationAndSkills />;
      case "account":
        return <Account />;
      case "friends":
        return <Friends />;
      case "themes":
        return <Themes />;
      case "time-language":
        return <TimeLanguage />;
      default:
        return null;
    }
  };

  return (
    <div className="flex w-[calc(100vw-70px)] overflow-hidden m-auto">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => setSearchParams({ tab }, { replace: true })}
        user={user}
      />
      <main className="p-6 py-10 bg-primary w-full h-screen overflow-y-auto">
        {renderActiveTab()}
      </main>
    </div>
  );
};

export default Settings;
