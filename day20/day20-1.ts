import Grid from '../utils/Grid';
import multiplyArray from '../utils/multiplyArray';
import parseLinesFromInputFile from '../utils/parseLinesFromInputFile';

const lines = parseLinesFromInputFile(`${__dirname}/input`);

type Cell = '.' | '#';

type Tile = {
  id: number;
  grid: Grid<Cell>;
};

const tiles: Tile[] = [];

(() => {
  let currentTileId: number | null = null;
  let y: number | null = null;
  let currentTile: Grid<Cell> | null = null;
  for (const [i, line] of lines.entries()) {
    if (line.startsWith('Tile')) {
      currentTileId = Number(line.replace(/Tile (\d+):/, '$1'));
      currentTile = new Grid<Cell>();
      y = 0;
      continue;
    }
    if (line) {
      for (const [x, char] of line.split('').entries()) {
        currentTile!.set(x, y!, char as Cell);
      }
      y!++;
    }

    if (!line || i === lines.length - 1) {
      tiles.push({
        grid: currentTile!,
        id: currentTileId!,
      });
      currentTileId = null;
      y = null;
      currentTile = null;
      continue;
    }
  }
})();

function rotate(grid: Grid<Cell>) {
  const rotated = new Grid<Cell>();
  for (let x = grid.minX; x <= grid.maxX; x++) {
    for (let y = grid.minY; y <= grid.maxY; y++) {
      rotated.set(grid.maxY - y, x, grid.get(x, y)!);
    }
  }
  return rotated;
}

function flipX(grid: Grid<Cell>) {
  const flipped = new Grid<Cell>();
  for (let x = grid.minX; x <= grid.maxX; x++) {
    for (let y = grid.minY; y <= grid.maxY; y++) {
      flipped.set(grid.maxX - x, y, grid.get(x, y)!);
    }
  }
  return flipped;
}

function flipY(grid: Grid<Cell>) {
  const flipped = new Grid<Cell>();
  for (let x = grid.minX; x <= grid.maxX; x++) {
    for (let y = grid.minY; y <= grid.maxY; y++) {
      flipped.set(x, grid.maxY - y, grid.get(x, y)!);
    }
  }
  return flipped;
}

function generateRotatedGrids(grid: Grid<Cell>) {
  const grids = [grid];
  let currentGrid = grid;
  for (let i = 0; i < 3; i++) {
    currentGrid = rotate(grid);
    grids.push(currentGrid);
  }
  currentGrid = flipX(grid);
  grids.push(currentGrid);
  for (let i = 0; i < 3; i++) {
    currentGrid = rotate(grid);
    grids.push(currentGrid);
  }
  currentGrid = flipY(grid);
  grids.push(currentGrid);
  for (let i = 0; i < 3; i++) {
    currentGrid = rotate(grid);
    grids.push(currentGrid);
  }
  return grids;
}

function checkEdges(grid1: Grid<Cell>, grid2: Grid<Cell>) {
  const coordinateRange = [...Array(grid1.maxX + 1).keys()];

  return (
    coordinateRange.every(
      (x) => grid1.get(x, grid1.minY)! === grid2.get(x, grid2.maxY)!,
    ) ||
    coordinateRange.every(
      (x) => grid1.get(x, grid1.maxY)! === grid2.get(x, grid2.minY)!,
    ) ||
    coordinateRange.every(
      (y) => grid1.get(grid1.minX, y)! === grid2.get(grid2.maxX, y)!,
    ) ||
    coordinateRange.every(
      (y) => grid1.get(grid1.maxX, y)! === grid2.get(grid2.minX, y)!,
    )
  );
}

const matchesCount = new Map<number, number>();

for (const [i, tile1] of tiles.entries()) {
  const rotated1Grids = generateRotatedGrids(tile1.grid);
  for (const tile2 of tiles.slice(i + 1)) {
    const rotated2Grids = generateRotatedGrids(tile2.grid);
    let match = false;
    for (const rotated1Grid of rotated1Grids) {
      match = rotated2Grids.some((rotated2Grid) =>
        checkEdges(rotated1Grid, rotated2Grid),
      );
      if (match) {
        break;
      }
    }

    if (match) {
      const tile1Count = (matchesCount.get(tile1.id) || 0) + 1;
      const tile2Count = (matchesCount.get(tile2.id) || 0) + 1;
      matchesCount.set(tile1.id, tile1Count);
      matchesCount.set(tile2.id, tile2Count);
    }
  }
}

const cornerTileIds: number[] = [];
for (const [id, count] of matchesCount.entries()) {
  if (count === 2) {
    cornerTileIds.push(id);
  }
}

console.log(multiplyArray(cornerTileIds));
