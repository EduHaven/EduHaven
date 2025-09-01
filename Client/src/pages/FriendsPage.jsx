import { useEffect, useState } from "react";
import TabNavigation from "../components/friendsPage/TabNavigation";
import MainContent from "../components/friendsPage/MainContent";
import NotLogedInPage from "@/components/NotLogedInPage";
import { jwtDecode } from "jwt-decode";
import { useSearchParams } from "react-router-dom";

// Skeleton Components
const TabNavigationSkeleton = () => (
  <div className="w-64 bg-white border-r border-gray-200 p-4">
    <div className="space-y-2">
      {Array.from({ length: 4 }, (_, index) => (
        <div
          key={index}
          className="h-10 bg-gray-200 rounded-lg animate-pulse"
        ></div>
      ))}
    </div>
  </div>
);

const MainContentSkeleton = () => (
  <div className="flex-1 p-6 bg-gray-50">
    {/* Header skeleton */}
    <div className="mb-6">
      <div className="h-8 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
      <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
    </div>

    {/* Content grid skeleton */}
    <div className="flex flex-wrap gap-3 2xl:gap-4">
      {Array.from({ length: 6 }, (_, index) => (
        <div
          key={index}
          className="bg-white rounded-lg border border-gray-200 p-4 w-64 animate-pulse"
        >
          {/* Avatar and name */}
          <div className="flex items-center mb-3">
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div className="ml-3 flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
          
          {/* Content lines */}
          <div className="space-y-2 mb-4">
            <div className="h-3 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-4/5"></div>
          </div>
          
          {/* Button */}
          <div className="h-8 bg-gray-200 rounded w-full"></div>
        </div>
      ))}
    </div>
  </div>
);

const PageSkeleton = () => (
  <div className="flex h-screen overflow-hidden">
    <TabNavigationSkeleton />
    <MainContentSkeleton />
  </div>
);

function FriendsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isInitializing, setIsInitializing] = useState(true);

  const tabs = ["suggested", "friendRequests", "sentRequests", "allFriends"];
  const activeTab = tabs.includes(searchParams.get("tab"))
    ? searchParams.get("tab")
    : "suggested";

  useEffect(() => {
    const initializePage = async () => {
      // Simulate brief initialization time
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (!searchParams.get("tab")) {
        setSearchParams({ tab: "suggested" }, { replace: true });
      }
      
      setIsInitializing(false);
    };

    initializePage();
  }, [searchParams, setSearchParams]);

  const token = localStorage.getItem("token");
  let decodedUser = null;
  try {
    if (token) decodedUser = jwtDecode(token);
  } catch (err) {
    console.error("Invalid token", err);
  }

  // Show skeleton during initialization
  if (isInitializing) {
    return <PageSkeleton />;
  }

  // Show not logged in page if no valid user
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