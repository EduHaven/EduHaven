const ToolbarButton = ({ onClick, isActive, icon, title }) => (
  <button
    onClick={onClick}
    title={title}
    className="p-1.5 border-none cursor-pointer flex items-center justify-center transition-all"
    style={{
      backgroundColor: isActive ? "var(--btn)" : "transparent",
      color: isActive ? "white" : "var(--txt)",
      borderRadius: "var(--radius)",
    }}
    onMouseEnter={(e) => {
      if (!isActive) {
        e.target.style.backgroundColor = "";
      }
    }}
    onMouseLeave={(e) => {
      if (!isActive) {
        e.target.style.backgroundColor = "transparent";
      }
    }}
  >
    {icon}
  </button>
);

export default ToolbarButton;
