import { getAllBadges } from "@/utils/badgeSystem";
import PopupContainer from "@/components/ui/Popup";

const BadgeModal = ({ isOpen, onClose }) => {
  const allBadges = getAllBadges();

  if (!isOpen) return null;

  return (
    <PopupContainer title="All Badges" onClose={onClose}>
      {/* Content */}
      <div className="p-6 overflow-y-auto max-h-[60vh]">
        <p className="text-[var(--txt-dim)] mb-6">
          Complete various activities to earn these badges and showcase your
          achievements!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allBadges.map((badge) => (
            <div
              key={badge.id}
              className="flex items-start gap-4 p-4 bg-[var(--bg-primary)] rounded-xl border border-[var(--border)] hover:border-[var(--accent)] transition-colors"
            >
              <div className="flex-shrink-0 relative">
                <img
                  src={badge.icon}
                  alt={badge.name}
                  className="w-12 h-12 object-contain"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full items-center justify-center text-white font-bold text-lg hidden absolute top-0 left-0">
                  {badge.name.charAt(0)}
                </div>
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-[var(--txt)] mb-1">
                  {badge.name}
                </h3>
                <p className="text-sm text-[var(--txt-dim)] mb-2">
                  {badge.description}
                </p>
                <span className="inline-block px-2 py-1 bg-[var(--accent)] bg-opacity-20 text-[var(--accent)] text-xs rounded-full">
                  {badge.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-[var(--border)] bg-[var(--bg-primary)]">
        <p className="text-sm text-[var(--txt-dim)] text-center">
          Keep using EduHaven to unlock more badges!
        </p>
      </div>
    </PopupContainer>
  );
};

export default BadgeModal;
