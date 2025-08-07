import { useState, useEffect, useRef } from "react";
import { ExternalLink, Plus, X, MoreVertical } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
      <button
        ref={buttonRef}
        className="flex gap-3 font-bold text-lg items-center txt"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <ExternalLink />
        Links
      </button>

      {/* Dropdown of existing pinned links + add button */}
      <AnimatePresence mode="wait">
        {showDropdown && (
          <motion.div
            initial={{
              opacity: 0,
              height: 0,
              scale: 0.95,
              y: -10
            }}
            animate={{
              opacity: 1,
              height: "auto",
              scale: 1,
              y: 0
            }}
            exit={{
              opacity: 0,
              height: 0,
              scale: 0.95,
              y: -10
            }}
            transition={{
              duration: 0.4,
              ease: [0.4, 0.0, 0.2, 1],
              height: { duration: 0.35 },
              opacity: { duration: 0.25 },
              scale: { duration: 0.3 },
              y: { duration: 0.3 }
            }}
            ref={dropdownRef}
            className="absolute top-full left-0 mt-2 bg-sec shadow-lg rounded-lg p-2 z-10 min-w-[17rem] overflow-hidden backdrop-blur-sm border border-opacity-20 border-gray-300"
            style={{
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
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
                    filter: "blur(4px)"
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    filter: "blur(0px)"
                  }}
                  transition={{
                    delay: 0.1 + (index * 0.05),
                    duration: 0.4,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                  whileHover={{
                    x: 4,
                    transition: { duration: 0.2 }
                  }}
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
                      transition={{ delay: 0.15 + (index * 0.05), duration: 0.3 }}
                    >
                      {item.links.map((link, idx) => (
                        <motion.img
                          key={idx}
                          src={getFaviconUrl(link)}
                          alt="icon"
                          className="w-4 h-4 rounded-sm"
                          initial={{ opacity: 0, rotate: -180 }}
                          animate={{ opacity: 1, rotate: 0 }}
                          transition={{
                            delay: 0.2 + (index * 0.05) + (idx * 0.02),
                            duration: 0.4
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
                      transition={{ delay: 0.2 + (index * 0.05), duration: 0.3 }}
                    >
                      {item.title}
                    </motion.span>
                  </motion.div>

                  <div className="relative">
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === item.id ? null : item.id);
                      }}
                      className="p-1 hover:bg-ter rounded transition-colors duration-200"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <MoreVertical className="w-4 h-4" />
                    </motion.button>

                    <AnimatePresence>
                      {openMenuId === item.id && (
                        <motion.div
                          initial={{
                            opacity: 0,
                            scale: 0.9,
                            y: -5
                          }}
                          animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0
                          }}
                          exit={{
                            opacity: 0,
                            scale: 0.9,
                            y: -5
                          }}
                          transition={{
                            duration: 0.2,
                            ease: [0.25, 0.46, 0.45, 0.94]
                          }}
                          className="absolute right-0 mt-1 bg-ter shadow-lg rounded-md p-1 z-10 min-w-[5rem] border border-opacity-10 border-gray-400"
                        >
                          <motion.button
                            onClick={() => handleEditLink(item.id)}
                            className="block w-full text-left px-2 py-1 hover:bg-sec txt rounded-sm transition-colors duration-150"
                            whileHover={{ x: 2 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            Edit
                          </motion.button>
                          <motion.button
                            onClick={() => handleDeleteLink(item.id)}
                            className="block w-full text-left px-2 py-1 hover:bg-sec txt rounded-sm transition-colors duration-150"
                            whileHover={{ x: 2 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            Delete
                          </motion.button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}

              <motion.button
                onClick={handleAddNew}
                className="block w-full px-4 py-2 txt hover:bg-ter rounded-md mt-2 flex items-center gap-2 transition-colors duration-200 border-t border-opacity-20 border-gray-300 pt-3"
                initial={{
                  opacity: 0,
                  y: 10
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
                transition={{
                  delay: 0.3 + (pinnedLinks.length * 0.05),
                  duration: 0.4
                }}
                whileHover={{
                  x: 4,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  initial={{ rotate: -90, scale: 0.8 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{
                    delay: 0.4 + (pinnedLinks.length * 0.05),
                    duration: 0.3
                  }}
                >
                  <Plus className="w-4 h-4" />
                </motion.div>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    delay: 0.45 + (pinnedLinks.length * 0.05),
                    duration: 0.3
                  }}
                >
                  Add Link
                </motion.span>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditItemId(null);
                    setTitle("");
                    setMainLink("");
                    setExtraLinks([]);
                  }}
                  className="p-1 hover:bg-ter rounded"
                >
                  <X className="w-5 h-5 txt" />
                </button>
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
              <button
                type="button"
                onClick={handleAddAnotherLink}
                className="text-sm flex font-medium items-center gap-1 mt-2 txt hover:opacity-80 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add another tab
              </button>

              {/* Save (Add/Edit) button */}
              <div className="flex justify-end mt-6">
                <button
                  onClick={handleSaveLink}
                  className="px-4 py-2 rounded txt btn hover:bg-ter/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current transition-colors"
                >
                  {editItemId ? "Save" : "Add"}
                </button>
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
            <button
              onClick={handleRetryOpenLinks}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              I've enabled popups
            </button>
            <button
              onClick={() => setShowPopupBlockerModal(false)}
              className="mt-4 block w-full text-center text-sm text-gray-400 hover:text-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PinnedLinks;
