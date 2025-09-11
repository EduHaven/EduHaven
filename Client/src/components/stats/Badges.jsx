import React, { useState, useEffect } from "react";
import { Award, Info } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import apiClient from "@/utils/apiClient";
import { toast } from "react-toastify";
import { useUserProfile } from '@/contexts/UserProfileContext';
import BadgeModal from './BadgeModal';
import BadgeTooltip from './BadgeTooltip';

const backendUrl = import.meta.env.VITE_API_URL;

const Badges = () => {
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [availableBadges, setAvailableBadges] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userId, setUserId] = useState(null);
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

  // Fetch user badges from backend
  useEffect(() => {
    const fetchBadges = async () => {
      if (!userId) return;

      try {
        const response = await apiClient.get('/user/badges');
        const { badges, newBadges, availableBadges } = response.data;
        
        setEarnedBadges(badges || []);
        setAvailableBadges(availableBadges || []);
        
        // Show notifications for newly earned badges
      
      } catch (error) {
        console.error("Error fetching badges:", error);
        setEarnedBadges([]);
        setAvailableBadges([]);
      }
    };

    fetchBadges();
  }, [userId]);

  // Refetch badges when user profile changes (for potential new badges)
  useEffect(() => {
    if (user && userId) {
      const refetchBadges = async () => {
        try {
          const response = await apiClient.get('/user/badges');
          const { badges, newBadges } = response.data;
          
          setEarnedBadges(badges || []);
          
         
        } catch (error) {
          console.error("Error refetching badges:", error);
        }
      };

      // Debounce the refetch to avoid too many API calls
      const timeoutId = setTimeout(refetchBadges, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [user, userId]);

  const allBadges = availableBadges;
  const maxDisplayBadges = 10;

  return (
    <>
      <div className="bg-[var(--bg-sec)] rounded-3xl shadow-lg p-6 w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-center flex-1">
            Badges Earned
          </h3>
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-2 hover:bg-[var(--bg-ter)] rounded-lg transition-colors group"
            title="View all badges"
          >
            <Info className="w-5 h-5 text-[var(--txt-dim)] group-hover:text-[var(--txt)]" />
          </button>
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
                    className="w-8 h-8 object-contain"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full items-center justify-center text-white font-bold text-xs hidden">
                    {badge.name.charAt(0)}
                  </div>
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
                <div className="w-8 h-8 bg-[var(--bg-ter)] rounded-full flex items-center justify-center">
                  <Award className="w-5 h-5 text-[var(--txt-dim)]" />
                </div>
                <p className="text-xs mt-1 text-[var(--txt-dim)]">Locked</p>
              </div>
            )
          )}
        </div>

        {earnedBadges.length > 0 && (
          <div className="mt-4 text-center">
            <p className="text-sm text-[var(--txt-dim)]">
              {earnedBadges.length} of {allBadges.length} badges earned
            </p>
          </div>
        )}
      </div>

      <BadgeModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        allBadges={allBadges}
      />
    </>
  );
};

export default Badges;
