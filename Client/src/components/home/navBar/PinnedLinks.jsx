import { useState, useEffect } from "react";
import { ExternalLink, Plus, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import PopupContainer from "@/components/ui/Popup";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Helper to get domain from a URL
function getDomain(url) {
  try {
    const { hostname } = new URL(url);
    return hostname;
  } catch {
    return "";
  }
}

// Helper to build a Google S2 favicon URL for a domain
function getFaviconUrl(link) {
  const domain = getDomain(link);
  return `https://www.google.com/s2/favicons?sz=64&domain_url=${domain}`;
}

// Helper to ensure URL has proper protocol
function normalizeUrl(url) {
  if (!url) return url;
  const trimmed = url.trim();
  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

function PinnedLinks() {
  const [showModal, setShowModal] = useState(false);
  const [showPopupBlockerModal, setShowPopupBlockerModal] = useState(false);
  const [editItemId, setEditItemId] = useState(null);
  const [title, setTitle] = useState("");
  const [mainLink, setMainLink] = useState("");
  const [extraLinks, setExtraLinks] = useState([]);
  const [pinnedLinks, setPinnedLinks] = useState([]);
  const [linksToOpen, setLinksToOpen] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    const storedLinks = JSON.parse(localStorage.getItem("pinnedLinks") || "[]");
    setPinnedLinks(storedLinks);
  }, []);

  const saveToLocalStorage = (linksArray) => {
    localStorage.setItem("pinnedLinks", JSON.stringify(linksArray));
  };

  const handleSaveLink = () => {
    if (!title.trim() || !mainLink.trim()) return;

    const normalizedMainLink = normalizeUrl(mainLink);
    const normalizedExtraLinks = extraLinks
      .filter((l) => l.trim())
      .map((link) => normalizeUrl(link));

    if (editItemId) {
      const updated = pinnedLinks.map((item) =>
        item.id === editItemId
          ? {
              ...item,
              title,
              links: [normalizedMainLink, ...normalizedExtraLinks],
            }
          : item
      );
      setPinnedLinks(updated);
      saveToLocalStorage(updated);
    } else {
      const newItem = {
        id: Date.now(),
        title,
        links: [normalizedMainLink, ...normalizedExtraLinks],
      };
      const updated = [...pinnedLinks, newItem];
      setPinnedLinks(updated);
      saveToLocalStorage(updated);
    }

    setTitle("");
    setMainLink("");
    setExtraLinks([]);
    setEditItemId(null);
    setShowModal(false);
  };

  const handleEditLink = (id) => {
    const item = pinnedLinks.find((p) => p.id === id);
    if (!item) return;
    setEditItemId(id);
    setTitle(item.title);
    setMainLink(item.links[0] || "");
    setExtraLinks(item.links.slice(1));
    setShowModal(true);
  };

  const handleDeleteLink = (id) => {
    const updated = pinnedLinks.filter((item) => item.id !== id);
    setPinnedLinks(updated);
    saveToLocalStorage(updated);
  };

  const handleAddAnotherLink = () => setExtraLinks([...extraLinks, ""]);

  const handleExtraLinkChange = (index, value) => {
    const updated = [...extraLinks];
    updated[index] = value;
    setExtraLinks(updated);
  };

  const handleAddNew = () => {
    setEditItemId(null);
    setTitle("");
    setMainLink("");
    setExtraLinks([]);
    setShowModal(true);
    setShowDropdown(false);
  };

  // --- MODIFIED openWorkspace function ---
  const openWorkspace = (links) => {
    // If there's only one link, just open it without the popup check
    if (links.length <= 1) {
      window.open(normalizeUrl(links[0]), "_blank", "noopener,noreferrer");
      return;
    }

    // Attempt to open the first link in a new window as the "popup test".
    // This call must be a direct result of a user click to avoid being blocked.
    const firstLink = normalizeUrl(links[0]);
    const testWindow = window.open(firstLink, "_blank", "noopener,noreferrer");

    if (!testWindow || testWindow.closed || typeof testWindow.closed === "undefined") {
      setLinksToOpen(links);
      setShowPopupBlockerModal(true);
    } else {
      links.slice(1).forEach((link) =>
        window.open(normalizeUrl(link), "_blank", "noopener,noreferrer")
      );
    }
  };

  const handleRetryOpenLinks = () => {
    linksToOpen.forEach((link) =>
      window.open(normalizeUrl(link), "_blank", "noopener,noreferrer")
    );
    setShowPopupBlockerModal(false);
    setLinksToOpen([]);
  };

  return (
    <div className="relative z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="transparent" className="flex gap-2 items-center font-bold text-lg txt">
            <ExternalLink className="w-4 h-4" />
            Links
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="bg-sec min-w-[17rem] border border-gray-300/20 rounded-lg p-2 shadow-md">
          {pinnedLinks.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between px-3 py-2 hover:bg-ter rounded-md transition-all"
            >
              <div
                className="flex items-center gap-2 cursor-pointer flex-1"
                onClick={() => openWorkspace(item.links)}
              >
                <div className="flex items-center gap-1">
                  {item.links.map((link, idx) => (
                    <img
                      key={idx}
                      src={getFaviconUrl(link)}
                      alt="icon"
                      className="w-4 h-4 rounded-sm"
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  ))}
                </div>
                <span>{item.title}</span>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="p-1 hover:bg-ter">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-ter border border-gray-400/10">
                  <DropdownMenuItem onClick={() => handleEditLink(item.id)}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDeleteLink(item.id)}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}

          <Button
            onClick={handleAddNew}
            variant="default"
            className="w-full mt-2 flex items-center gap-2 border-t border-gray-300/20 pt-3"
          >
            <Plus className="w-4 h-4" />
            Add Link
          </Button>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Modal for adding/editing a workspace */}
      {showModal && (
        <PopupContainer
          title={editItemId ? "Edit link" : "Create a link"}
          onClose={() => {
            setShowModal(false);
            setEditItemId(null);
            setTitle("");
            setMainLink("");
            setExtraLinks([]);
          }}
        >
          {/* Title */}
          <label className="block mb-4">
            <span className="text-md font-semibold dark:text-gray-300 tracking-wide">
              Title
            </span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-500 rounded-lg bg-transparent txt placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-current"
              placeholder="e.g. Amazon"
            />
          </label>

          {/* Main link */}
          <label className="block mb-4">
            <span className="text-md font-semibold dark:text-gray-300 tracking-wide">
              Links
            </span>
            <input
              type="text"
              value={mainLink}
              onChange={(e) => setMainLink(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-500 rounded-lg bg-transparent txt placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-current"
              placeholder="e.g. amazon.com (protocol will be added automatically)"
            />
          </label>

          {/* Extra links */}
          {extraLinks.map((linkVal, idx) => (
            <div key={idx} className="mb-2">
              <input
                type="text"
                value={linkVal}
                onChange={(e) => handleExtraLinkChange(idx, e.target.value)}
                className="w-full mt-1 p-2 border border-gray-500 rounded-lg bg-transparent txt placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-current"
                placeholder="Another link..."
              />
            </div>
          ))}

          {/* Add another tab */}
          <Button
            type="button"
            onClick={handleAddAnotherLink}
            variant="link"
            size="default"
            className="text-sm flex font-medium items-center gap-1 mt-2 txt hover:opacity-80 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add another tab
          </Button>

          {/* Save */}
          <div className="flex justify-end mt-6">
            <Button
              onClick={handleSaveLink}
              variant="default"
              size="default"
              className="px-4 py-2 rounded txt btn hover:bg-ter/80"
            >
              {editItemId ? "Save" : "Add"}
            </Button>
          </div>
        </PopupContainer>
      )}

      {/* --- NEW POPUP BLOCKER MODAL --- */}
      {showPopupBlockerModal && (
        <PopupContainer
          title="Popups Blocked"
          onClose={() => setShowPopupBlockerModal(false)}
        >
          <p className="txt mb-4">
            Your browser is blocking the links from opening. Please disable the
            popup blocker for this site and try again.
          </p>
          <Button
            onClick={handleRetryOpenLinks}
            variant="default"
            size="default"
            className="px-4 py-2 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-600 hover:bg-blue-700"
          >
            Got it
          </Button>
        </PopupContainer>
      )}
    </div>
  );
}

export default PinnedLinks;
