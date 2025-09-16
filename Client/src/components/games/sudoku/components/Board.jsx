import Cell from "./Cell";

export default function Board({ board, fixed, selected, onSelect }) {
  return (
    <div className="sudoku-wrap mx-auto w-full max-w-xl select-none">
      <div className="sudoku-board">
        {board.map((row, r) => (
          <div className="sudoku-row" key={r}>
            {row.map((val, c) => (
              <Cell
                key={`${r}-${c}`}
                r={r}
                c={c}
                value={val}
                fixed={fixed[r][c]}
                selected={selected.r === r && selected.c === c}
                sameRow={selected.r === r}
                sameCol={selected.c === c}
                sameBox={
                  Math.floor(selected.r / 3) === Math.floor(r / 3) &&
                  Math.floor(selected.c / 3) === Math.floor(c / 3)
                }
                onClick={() => onSelect({ r, c })}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
