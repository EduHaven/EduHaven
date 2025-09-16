import { useEffect } from "react";
import TabNavigation from "../components/friendsPage/TabNavigation";
import MainContent from "../components/friendsPage/MainContent";
import NotLogedInPage from "@/components/NotLogedInPage";
import { jwtDecode } from "jwt-decode";
import { useSearchParams } from "react-router-dom";
import { useUserProfile } from "@/contexts/UserProfileContext";

function FriendsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const tabs = ["suggested", "friendRequests", "sentRequests", "allFriends"];
  const activeTab = tabs.includes(searchParams.get("tab"))
    ? searchParams.get("tab")
    : "suggested";

  useEffect(() => {
    if (!searchParams.get("tab")) {
      setSearchParams({ tab: "suggested" }, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const { token } = useUserProfile();
  let decodedUser = null;
  try {
    if (token) decodedUser = jwtDecode(token);
  } catch (err) {
    console.error("Invalid token", err);
  }

  if (!decodedUser) return <NotLogedInPage />;

  return (
    <div className="flex h-screen overflow-hidden">
      <TabNavigation
        activeTab={activeTab}
        onTabChange={(tab) => setSearchParams({ tab }, { replace: true })}
      />
      <MainContent selectedTab={activeTab} />
    </div>
  );
}

export default FriendsPage;
