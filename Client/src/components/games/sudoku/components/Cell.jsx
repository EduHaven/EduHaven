export default function Cell({
  r,
  c,
  value,
  fixed,
  selected,
  sameRow,
  sameCol,
  sameBox,
  onClick,
}) {
  const base = "sudoku-cell";
  const classes = [
    base,
    selected ? "is-selected" : "",
    fixed ? "is-fixed" : "",
    !fixed && value === 0 ? "is-empty" : "",
    !selected && (sameRow || sameCol || sameBox) ? "is-related" : "",
  ].join(" ");

  return (
    <button aria-label={`cell-${r}-${c}`} className={classes} onClick={onClick}>
      {value !== 0 ? value : ""}
    </button>
  );
}
