import { useState, useEffect } from "react";
import { Award, Info } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import axiosInstance from "@/utils/axios";
import { getAllBadges } from "@/utils/badgeSystem";
import { useUserProfile } from "@/contexts/UserProfileContext";
import BadgeModal from "./BadgeModal";
import BadgeTooltip from "./BadgeTooltip";
import { Button } from "@/components/ui/button";

const Badges = () => {
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const { user, fetchUserDetails } = useUserProfile();

  // Get user ID from token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.id);

        // Fetch user details if not already loaded
        if (!user) {
          fetchUserDetails(decoded.id);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [user, fetchUserDetails]);

  useEffect(() => {
    const fetchBadgesFromServer = async () => {
      if (!userId) return;

      try {
        const token = localStorage.getItem("token");
        const response = await axiosInstance.get(`/user/badges`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.badges) {
          setEarnedBadges(response.data.badges);
        }
      } catch (error) {
        console.error("Error fetching badges from server:", error);
        // Fallback to empty array if server fetch fails
        setEarnedBadges([]);
      }
    };

    const initializeBadges = async () => {
      await fetchBadgesFromServer();

      // Mark that initial load is complete
      if (isInitialLoad) {
        setIsInitialLoad(false);
      }
    };

    initializeBadges();
  }, [userId, isInitialLoad]);

  const allBadges = getAllBadges();
  const maxDisplayBadges = 10;

  return (
    <>
      <div className="bg-[var(--bg-sec)] rounded-3xl shadow-md p-6 w-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold flex gap-2 items-center">
              Badges Earned
            </h3>
            {earnedBadges.length > 0 && (
              <p className="text-sm text-[var(--txt-dim)]">
                {earnedBadges.length} / {allBadges.length}
              </p>
            )}
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            variant="transparent"
            size="icon"
            className="hover:bg-[var(--bg-ter)] rounded-lg group"
            title="View all badges"
          >
            <Info className="w-5 h-5 text-[var(--txt-dim)] group-hover:text-[var(--txt)]" />
          </Button>
        </div>

        <div className="grid grid-cols-5 gap-4">
          {/* Display earned badges first */}
          {earnedBadges.slice(0, maxDisplayBadges).map((badge) => (
            <BadgeTooltip key={badge.id} badge={badge}>
              <div className="flex flex-col items-center cursor-help">
                <div className="relative">
                  <img
                    src={badge.icon}
                    alt={badge.name}
                    className="w-12 h-12 object-contain"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                </div>
                <p className="text-xs mt-1 text-center text-[var(--txt)]">
                  {badge.name}
                </p>
              </div>
            </BadgeTooltip>
          ))}

          {/* Fill remaining slots with placeholder badges */}
          {Array.from(
            { length: Math.max(0, maxDisplayBadges - earnedBadges.length) },
            (_, i) => (
              <div
                key={`placeholder-${i}`}
                className="flex flex-col items-center opacity-30"
              >
                <div className="w-12 h-12 bg-[var(--bg-ter)] rounded-full flex items-center justify-center">
                  <Award className="w-5 h-5 text-[var(--txt-dim)]" />
                </div>
                <p className="text-xs mt-1 text-[var(--txt-dim)]">Locked</p>
              </div>
            )
          )}
        </div>
      </div>

      <BadgeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default Badges;
