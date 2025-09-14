import { useState, useEffect, useRef } from "react";
import { ExternalLink, Plus, X, MoreVertical } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
        <motion.div
          initial={{
            opacity: 0,
            height: 0,
            scale: 0.95,
            y: -8,
          }}
          animate={{
            opacity: 1,
            height: "auto",
            scale: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            height: 0,
            scale: 0.95,
            y: -8,
          }}
          transition={{
            duration: 0.15,
            ease: [0.25, 0.1, 0.25, 1],
            // height: { duration: 0.35 },
            // opacity: { duration: 0.25 },
            // scale: { duration: 0.3 },
            // y: { duration: 0.3 },
          }}
          ref={dropdownRef}
          className="absolute top-full left-0 mt-2 bg-sec shadow-lg rounded-lg p-2 z-10 min-w-[17rem] overflow-hidden backdrop-blur-sm border border-opacity-20 border-gray-300"
          style={{
            boxShadow:
              "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            {pinnedLinks.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{
                  opacity: 0,
                  x: -20,
                  filter: "blur(4px)",
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                  filter: "blur(0px)",
                }}
                transition={{
                  delay: index * 0.05,
                  duration: 0.2,
                  ease: [0.15, 0.05, 0.15, 1],
                }}
                whileHover={{ scale: 1.02 }}
                className="flex items-center justify-between px-4 py-2 txt hover:bg-ter rounded-md transition-colors duration-200"
              >
                <motion.div
                  className="flex items-center gap-2 cursor-pointer flex-1"
                  onClick={() => openWorkspace(item.links)}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    className="flex items-center gap-1"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.05, duration: 0.2 }}
                  >
                    {item.links.map((link, idx) => (
                      <motion.img
                        key={idx}
                        src={getFaviconUrl(link)}
                        alt="icon"
                        className="w-4 h-4 rounded-sm"
                        initial={{ opacity: 0, rotate: -90 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        transition={{
                          delay: index * 0.05 + idx * 0.02,
                          duration: 0.4,
                        }}
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ))}
                  </motion.div>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    {item.title}
                  </motion.span>
                </motion.div>

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

                  <AnimatePresence>
                    {openMenuId === item.id && (
                      <motion.div
                        initial={{
                          opacity: 0,
                          scale: 0.9,
                          y: -5,
                        }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                          y: 0,
                        }}
                        exit={{
                          opacity: 0,
                          scale: 0.9,
                          y: -5,
                        }}
                        transition={{
                          duration: 0.2,
                          ease: [0.25, 0.46, 0.45, 0.94],
                        }}
                        className="absolute right-0 mt-1 bg-ter shadow-lg rounded-md p-1 z-10 min-w-[5rem] border border-opacity-10 border-gray-400"
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
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}

            <Button
              onClick={handleAddNew}
              variant="default"
              size="default"
              className="block w-full px-4 py-2 txt hover:bg-ter rounded-md mt-2 flex items-center gap-2 transition-colors duration-200 border-t border-opacity-20 border-gray-300 pt-3"
            >
              <motion.div
                initial={{ rotate: -90, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{
                  delay: 0.45 + pinnedLinks.length * 0.05,
                  duration: 0.2,
                }}
              >
                <Plus className="w-4 h-4" />
              </motion.div>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  delay: 0.2 + pinnedLinks.length * 0.05,
                  duration: 0.2,
                }}
              >
                Add Link
              </motion.span>
            </Button>
          </motion.div>
        </motion.div>
      )}
      {/* </AnimatePresence> */}

      {/* Modal for adding/editing a workspace */}
      {showModal && (
        <AnimatePresence>
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-50 backdrop-blur-sm bg-black/40 flex items-center justify-center transition-colors"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="bg-sec backdrop-blur-xl border border-white/20 p-6 rounded-2xl shadow-2xl max-w-sm w-full "
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
                <span className="text-md  font-semibold  dark:text-gray-300  tracking-wide ">
                  Title
                </span>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full mt-1 p-2 border border-gray-500 rounded-lg 
               bg-transparent txt placeholder:text-sm
               focus:outline-none focus:ring-2 focus:ring-current"
                  placeholder="e.g. Amazon"
                />
              </label>

              {/* Main link */}
              <label className="block mb-4">
                <span className="text-md  font-semibold  dark:text-gray-300 tracking-wide">
                  Links
                </span>
                <input
                  type="text"
                  value={mainLink}
                  onChange={(e) => setMainLink(e.target.value)}
                  className="w-full mt-1 p-2 border border-gray-500 rounded-lg 
               bg-transparent txt placeholder:text-sm
               focus:outline-none focus:ring-2 focus:ring-current"
                  placeholder="e.g. amazon.com (protocol will be added automatically)"
                />
              </label>

              {/* Additional tabs/links */}
              {extraLinks.map((linkVal, idx) => (
                <div key={idx} className="mb-2">
                  <input
                    type="text"
                    value={linkVal}
                    onChange={(e) => handleExtraLinkChange(idx, e.target.value)}
                    className="w-full mt-1 p-2 border border-gray-500 rounded-lg 
               bg-transparent txt placeholder:text-sm
               focus:outline-none focus:ring-2 focus:ring-current"
                    placeholder="Another link..."
                  />
                </div>
              ))}

              {/* "Add another tab" button */}
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

              {/* Save (Add/Edit) button */}
              <div className="flex justify-end mt-6">
                <Button
                  onClick={handleSaveLink}
                  variant="default"
                  size="default"
                  className="px-4 py-2 rounded txt btn hover:bg-ter/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current transition-colors"
                >
                  {editItemId ? "Save" : "Add"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
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
