import parseLinesFromInputFile from '../utils/parseLinesFromInputFile';
import Grid from '../utils/Grid';

const rows = parseLinesFromInputFile(`${__dirname}/input`);

type Cell = 'L' | '.' | '#';

type CellGrid = Grid<Cell>;

let grid = new Grid<Cell>();
for (let y = 0; y < rows.length; y++) {
  const row = rows[y];
  const cells = row.split('') as Cell[];
  for (let x = 0; x < cells.length; x++) {
    grid.set(x, y, cells[x]);
  }
}

function areGridsEqual(grid1: CellGrid, grid2: CellGrid) {
  for (let x = 0; x <= grid1.maxX; x++) {
    for (let y = 0; y <= grid1.maxY; y++) {
      if (grid1.get(x, y) !== grid2.get(x, y)) {
        return false;
      }
    }
  }
  return true;
}

const SEATS = ['#', 'L'];

function getVisibleCells(x: number, y: number) {
  const visibleCells: Cell[] = [];

  for (let i = x - 1, j = y - 1; i >= 0 && j >= 0; i--, j--) {
    if (SEATS.includes(grid.get(i, j)!)) {
      visibleCells.push(grid.get(i, j)!);
      break;
    }
  }

  for (let i = x - 1, j = y + 1; i >= 0 && j <= grid.maxY; i--, j++) {
    if (SEATS.includes(grid.get(i, j)!)) {
      visibleCells.push(grid.get(i, j)!);
      break;
    }
  }

  for (let i = x - 1; i >= 0; i--) {
    if (SEATS.includes(grid.get(i, y)!)) {
      visibleCells.push(grid.get(i, y)!);
      break;
    }
  }

  for (let i = x + 1, j = y - 1; i <= grid.maxX && j >= 0; i++, j--) {
    if (SEATS.includes(grid.get(i, j)!)) {
      visibleCells.push(grid.get(i, j)!);
      break;
    }
  }

  for (let i = x + 1, j = y + 1; i <= grid.maxX && j <= grid.maxY; i++, j++) {
    if (SEATS.includes(grid.get(i, j)!)) {
      visibleCells.push(grid.get(i, j)!);
      break;
    }
  }

  for (let j = y - 1; j >= 0; j--) {
    if (SEATS.includes(grid.get(x, j)!)) {
      visibleCells.push(grid.get(x, j)!);
      break;
    }
  }

  for (let j = y + 1; j <= grid.maxY; j++) {
    if (SEATS.includes(grid.get(x, j)!)) {
      visibleCells.push(grid.get(x, j)!);
      break;
    }
  }

  for (let i = x + 1; i <= grid.maxX; i++) {
    if (SEATS.includes(grid.get(i, y)!)) {
      visibleCells.push(grid.get(i, y)!);
      break;
    }
  }
  return visibleCells;
}
while (true) {
  const newGrid = new Grid<Cell>();
  for (let x = 0; x <= grid.maxX; x++) {
    for (let y = 0; y <= grid.maxY; y++) {
      const cells = getVisibleCells(x, y);
      const cell = grid.get(x, y);
      if (cell === 'L' && !cells.includes('#')) {
        newGrid.set(x, y, '#');
      } else if (
        cell === '#' &&
        cells.filter((adjacentCell) => adjacentCell === '#').length >= 5
      ) {
        newGrid.set(x, y, 'L');
      } else {
        newGrid.set(x, y, cell as Cell);
      }
    }
  }
  if (areGridsEqual(grid, newGrid)) {
    break;
  }
  grid = newGrid;
}

let occupiedCount = 0;
for (let x = 0; x <= grid.maxX; x++) {
  for (let y = 0; y <= grid.maxY; y++) {
    if (grid.get(x, y) === '#') {
      occupiedCount++;
    }
  }
}
console.log(occupiedCount);
