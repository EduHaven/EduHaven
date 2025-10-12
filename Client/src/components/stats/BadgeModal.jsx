import { getAllBadges } from "@/utils/badgeSystem";
import PopupContainer from "@/components/ui/Popup";

const BadgeModal = ({ isOpen, onClose }) => {
  const allBadges = getAllBadges();

  if (!isOpen) return null;

  return (
    <PopupContainer 
      title="All Badges" 
      onClose={onClose} 
      width="w-11/12 max-w-3xl"
    >
      {/* Content */}
      <div className="px-6 py-4 overflow-y-auto max-h-[65vh] scrollbar-thin scrollbar-thumb-[var(--accent)] scrollbar-track-transparent">
        <p className="text-[var(--txt-dim)] mb-6 leading-relaxed">
          Complete various activities to earn these badges and showcase your
          achievements!
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {allBadges.map((badge) => (
            <div
              key={badge.id}
              className="flex items-start gap-4 p-5 min-h-[120px] bg-[var(--bg-primary)] rounded-xl border border-[var(--border)] hover:border-[var(--accent)] transition-all duration-200 hover:shadow-md"
            >
              <div className="flex-shrink-0 relative">
                <img
                  src={badge.icon}
                  alt={badge.name}
                  className="w-14 h-14 object-contain"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
                <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full items-center justify-center text-white font-bold text-lg hidden absolute top-0 left-0">
                  {badge.name.charAt(0)}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-[var(--txt)] mb-1.5 break-words">
                  {badge.name}
                </h3>
                <p className="text-sm text-[var(--txt-dim)] mb-2.5 break-words leading-relaxed">
                  {badge.description}
                </p>
                <span className="inline-block px-2.5 py-1 bg-[var(--accent)] bg-opacity-20 text-[var(--accent)] text-xs rounded-full">
                  {badge.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-5 border-t border-[var(--border)] bg-[var(--bg-primary)]">
        <p className="text-sm text-[var(--txt-dim)] text-center">
          Keep using EduHaven to unlock more badges!
        </p>
      </div>
    </PopupContainer>
  );
};

export default BadgeModal;
