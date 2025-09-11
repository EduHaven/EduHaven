const Game2048Icon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    width={props.size || 40}
    height={props.size || 40}
    fill="none"
    {...props}
  >
    <rect
      x="24"
      y="5.5"
      width="18.5"
      height="18.5"
      rx="4"
      style={{ stroke: "var(--accent)", strokeWidth: 2, fill: "var(--bg-ter)" }}
    />
    <rect
      x="5.5"
      y="24"
      width="18.5"
      height="18.5"
      rx="4"
      style={{ stroke: "var(--accent)", strokeWidth: 2, fill: "var(--bg-ter)" }}
    />
    <rect
      x="24"
      y="24"
      width="18.5"
      height="18.5"
      rx="4"
      style={{ stroke: "var(--accent)", strokeWidth: 2, fill: "var(--bg-ter)" }}
    />
    <rect
      x="5.5"
      y="5.5"
      width="18.5"
      height="18.5"
      rx="4"
      style={{ stroke: "var(--accent)", strokeWidth: 2, fill: "var(--bg-ter)" }}
    />
    <polyline
      points="16.805 38.25 16.804 28.25 11.438 34.967 18.063 34.967"
      style={{
        stroke: "var(--txt)",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        fill: "none",
      }}
    />
    <path
      d="M29.9375,16.4375a3.3125,3.3125,0,0,0,6.625,0v-3.375a3.3125,3.3125,0,0,0-6.625,0Z"
      style={{
        stroke: "var(--txt)",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        fill: "none",
      }}
    />
    <path
      d="M11.4375,13.0625a3.3125,3.3125,0,0,1,6.625,0,3.0905,3.0905,0,0,1-.97,2.3423c-1.34,1.176-5.6548,4.3452-5.6548,4.3452h6.625"
      style={{
        stroke: "var(--txt)",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        fill: "none",
      }}
    />
    <path
      d="M32.4375,33.25a2.5,2.5,0,0,0-2.5,2.5h0a2.5,2.5,0,0,0,2.5,2.5h1.625a2.5,2.5,0,0,0,2.5-2.5h0a2.5,2.5,0,0,0-2.5-2.5"
      style={{
        stroke: "var(--txt)",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        fill: "none",
      }}
    />
    <path
      d="M34.0625,33.25a2.5,2.5,0,0,0,2.5-2.5h0a2.5,2.5,0,0,0-2.5-2.5h-1.625a2.5,2.5,0,0,0-2.5,2.5h0a2.5,2.5,0,0,0,2.5,2.5"
      style={{
        stroke: "var(--txt)",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        fill: "none",
      }}
    />
    <line
      x1="32.4375"
      y1="33.25"
      x2="34.0625"
      y2="33.25"
      style={{
        stroke: "var(--txt)",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round",
      }}
    />
  </svg>
);

export default Game2048Icon;
