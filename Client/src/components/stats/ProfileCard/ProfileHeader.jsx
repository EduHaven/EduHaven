import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Share2, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const ProfileHeader = ({ user, profilelink, isCurrentUser }) => {
  const handleCopyLink = () => {
    if (!profilelink) return;
    navigator.clipboard
      .writeText(profilelink)
      .then(() => toast.success("Copied profile link!"))
      .catch(() => toast.error("Failed to copy link"));
  };

  return (
    <div className="flex items-center justify-end px-6 mb-4">

      <div className="flex items-center gap-3">
        {isCurrentUser && (
          <Link to="/settings/">
            <Edit3 className="h-6 w-6 text-[var(--text-secondary)] hover:text-[var(--text-primary)]" />
          </Link>
        )}

        {/* Dropdown for sharing profile link */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex px-0 items-center space-x-2 text-sm"
            >
              <Share2 className="w-6 h-6" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={handleCopyLink}>
              Copy Profile Link
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ProfileHeader;
