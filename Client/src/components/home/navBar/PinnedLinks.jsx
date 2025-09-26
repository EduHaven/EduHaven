import { useState, useEffect, useRef } from "react";
import { ExternalLink, Plus, X, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showPopupBlockerModal, setShowPopupBlockerModal] = useState(false);
  const [editItemId, setEditItemId] = useState(null);
  const [title, setTitle] = useState("");
  const [mainLink, setMainLink] = useState("");

  const [pinnedLinks, setPinnedLinks] = useState([]);
  const [extraLinks, setExtraLinks] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [linksToOpen, setLinksToOpen] = useState([]);

  // Refs for click outside detection
  const dropdownRef = useRef(null);
  const modalRef = useRef(null);
  const buttonRef = useRef(null);
  const popupBlockerModalRef = useRef(null);

  // Load from localStorage on mount
  useEffect(() => {
    const storedLinks = JSON.parse(localStorage.getItem("pinnedLinks") || "[]");
    setPinnedLinks(storedLinks);
  }, []);

  const saveToLocalStorage = (linksArray) => {
    localStorage.setItem("pinnedLinks", JSON.stringify(linksArray));
  };

  // Handle clicks outside dropdown and modals
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        showDropdown &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
        setOpenMenuId(null);
      }

      if (
        showModal &&
        modalRef.current &&
        !modalRef.current.contains(event.target)
      ) {
        setShowModal(false);
        setEditItemId(null);
        setTitle("");
        setMainLink("");
        setExtraLinks([]);
      }

      if (
        showPopupBlockerModal &&
        popupBlockerModalRef.current &&
        !popupBlockerModalRef.current.contains(event.target)
      ) {
        setShowPopupBlockerModal(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown, showModal, showPopupBlockerModal]);

  const handleSaveLink = () => {
    if (!title.trim() || !mainLink.trim()) return;

    const normalizedMainLink = normalizeUrl(mainLink);
    const normalizedExtraLinks = extraLinks
      .filter((l) => l.trim())
      .map((link) => normalizeUrl(link));

    if (editItemId) {
      const updated = pinnedLinks.map((item) => {
        if (item.id === editItemId) {
          return {
            ...item,
            title,
            links: [normalizedMainLink, ...normalizedExtraLinks],
          };
        }
        return item;
      });
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

    // Reset inputs and close modal
    setTitle("");
    setMainLink("");
    setExtraLinks([]);
    setEditItemId(null);
    setShowModal(false);
  };

  const handleAddNew = () => {
    setEditItemId(null);
    setTitle("");
    setMainLink("");
    setExtraLinks([]);
    setShowModal(true);
    setShowDropdown(false);
  };

  const handleEditLink = (id) => {
    const item = pinnedLinks.find((p) => p.id === id);
    if (!item) return;

    setEditItemId(id);
    setTitle(item.title);
    setMainLink(item.links[0] || "");
    setExtraLinks(item.links.slice(1));
    setShowModal(true);
    setOpenMenuId(null);
  };

  const handleDeleteLink = (id) => {
    const updated = pinnedLinks.filter((item) => item.id !== id);
    setPinnedLinks(updated);
    saveToLocalStorage(updated);
    setOpenMenuId(null);
  };

  const handleAddAnotherLink = () => {
    setExtraLinks([...extraLinks, ""]);
  };

  const handleExtraLinkChange = (index, value) => {
    const updated = [...extraLinks];
    updated[index] = value;
    setExtraLinks(updated);
  };

  // --- MODIFIED openWorkspace function ---
  const openWorkspace = (links) => {
    // If there's only one link, just open it without the popup check
    if (links.length <= 1) {
      window.open(normalizeUrl(links[0]), "_blank", "noopener,noreferrer");
      setShowDropdown(false);
      return;
    }

    // Attempt to open the first link in a new window as the "popup test".
    // This call must be a direct result of a user click to avoid being blocked.
    const firstLink = normalizeUrl(links[0]);
    const testWindow = window.open(firstLink, "_blank", "noopener,noreferrer");

    // Check if the popup was blocked
    if (
      !testWindow ||
      testWindow.closed ||
      typeof testWindow.closed === "undefined"
    ) {
      // Popups were blocked, show the modal.
      setLinksToOpen(links);
      setShowPopupBlockerModal(true);
    } else {
      // Popups are enabled. Now open the rest of the links, starting from the second one.
      links.slice(1).forEach((link) => {
        const normalizedLink = normalizeUrl(link);
        window.open(normalizedLink, "_blank", "noopener,noreferrer");
      });
    }

    setShowDropdown(false);
  };

  const handleRetryOpenLinks = () => {
    linksToOpen.forEach((link) => {
      const normalizedLink = normalizeUrl(link);
      window.open(normalizedLink, "_blank", "noopener,noreferrer");
    });
    setShowPopupBlockerModal(false);
    setLinksToOpen([]);
  };

  return (
    <div className="relative z-50">
      <Button
        variant="transparent"
        size="default"
        ref={buttonRef}
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex gap-3 font-bold text-lg items-center txt"
      >
        <ExternalLink />
        Links
      </Button>

      {/* Dropdown of existing pinned links + add button */}
      {/* <AnimatePresence mode="wait"> */}
      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 mt-2 bg-sec shadow-lg rounded-lg p-2 z-10 min-w-[17rem] overflow-hidden backdrop-blur-sm border border-opacity-20 border-gray-300
          transition-all duration-200 ease-out transform origin-top
          opacity-100 scale-100"
        >
          {pinnedLinks.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between px-4 py-2 txt hover:bg-ter rounded-md transition-colors duration-200"
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

              <div className="relative">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuId(openMenuId === item.id ? null : item.id);
                  }}
                  variant="transparent"
                  size="icon"
                  className="p-1 rounded hover:bg-ter transition-colors duration-200"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>

                {openMenuId === item.id && (
                  <div
                    className="absolute right-0 mt-1 bg-ter shadow-lg rounded-md p-1 z-10 min-w-[5rem] border border-opacity-10 border-gray-400
                    transition-all duration-200 transform origin-top opacity-100 scale-100"
                  >
                    <Button
                      onClick={() => handleEditLink(item.id)}
                      variant="secondary"
                      size="default"
                      className="block w-full text-left px-2 py-1 rounded-sm txt hover:bg-sec transition-colors duration-150"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDeleteLink(item.id)}
                      variant="destructive"
                      size="default"
                      className="block w-full text-left px-2 py-1 rounded-sm txt hover:bg-sec transition-colors duration-150"
                    >
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}

          <Button
            onClick={handleAddNew}
            variant="default"
            size="default"
            className="w-full px-4 py-2 txt hover:bg-ter rounded-md mt-2 flex items-center gap-2 transition-colors duration-200 border-t border-opacity-20 border-gray-300 pt-3"
          >
            <Plus className="w-4 h-4" />
            <span>Add Link</span>
          </Button>
        </div>
      )}

      {/* Modal for adding/editing a workspace */}
      {showModal && (
        <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black/40 flex items-center justify-center transition-opacity">
          <div
            ref={modalRef}
            className="bg-sec backdrop-blur-xl border border-white/20 p-6 rounded-2xl shadow-2xl max-w-sm w-full transform transition-all duration-200 ease-out scale-100 opacity-100"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold txt">
                {editItemId ? "Edit link" : "Create a link"}
              </h2>
              <Button
                onClick={() => {
                  setShowModal(false);
                  setEditItemId(null);
                  setTitle("");
                  setMainLink("");
                  setExtraLinks([]);
                }}
                variant="transparent"
                size="icon"
                className="p-1 hover:bg-ter rounded"
              >
                <X className="w-5 h-5 txt" />
              </Button>
            </div>

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
                placeholder="e.g. amazon.com"
              />
            </label>

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

            <Button
              type="button"
              onClick={handleAddAnotherLink}
              variant="link"
              size="default"
              className="text-sm flex font-medium items-center gap-1 mt-2 txt hover:opacity-80 transition"
            >
              <Plus className="w-4 h-4" />
              Add another tab
            </Button>

            <div className="flex justify-end mt-6">
              <Button
                onClick={handleSaveLink}
                variant="default"
                size="default"
                className="px-4 py-2 rounded txt btn hover:bg-ter/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current transition"
              >
                {editItemId ? "Save" : "Add"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* --- NEW POPUP BLOCKER MODAL --- */}
      {showPopupBlockerModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30">
          <div
            ref={popupBlockerModalRef}
            className="bg-sec p-6 rounded-lg shadow-lg w-full max-w-sm text-center"
          >
            <h3 className="text-xl font-bold txt mb-4">Popups Blocked</h3>
            <p className="txt mb-4">
              Your browser is blocking the links from opening. Please disable
              the popup blocker for this site and try again.
            </p>
            <Button
              onClick={handleRetryOpenLinks}
              variant="default"
              size="default"
              className="px-4 py-2 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-600 hover:bg-blue-700"
            >
              I have enabled popups
            </Button>
            <Button
              onClick={() => setShowPopupBlockerModal(false)}
              variant="link"
              size="default"
              className="mt-4 block w-full text-center text-sm text-gray-400 hover:text-gray-200"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PinnedLinks;
