import { X, Info } from "lucide-react";
import { getAllBadges } from "@/utils/badgeSystem";
import { Button } from "@/components/ui/button";

const BadgeModal = ({ isOpen, onClose }) => {
  const allBadges = getAllBadges();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--bg-sec)] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <Info className="w-6 h-6 text-[var(--txt)]" />
            <h2 className="text-2xl font-bold text-[var(--txt)]">All Badges</h2>
          </div>
          <Button
            onClick={onClose}
            variant="transparent"
            size="icon"
            className="hover:bg-[var(--bg-ter)] rounded-lg"
          >
            <X className="w-5 h-5 text-[var(--txt)]" />
          </Button>
        </div>

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
                <div className="flex-shrink-0">
                  <img
                    src={badge.icon}
                    alt={badge.name}
                    className="w-12 h-12 object-contain"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full items-center justify-center text-white font-bold text-lg hidden">
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
      </div>
    </div>
  );
};

export default BadgeModal;
