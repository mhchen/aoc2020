/* eslint-disable no-labels */

import Grid from '../utils/Grid';
import parseLinesFromInputFile from '../utils/parseLinesFromInputFile';

const lines = parseLinesFromInputFile(`${__dirname}/input`);

type Cell = '.' | '#';

type CellGrid = Grid<Cell>;

class Node {
  edges: Node[] = [];

  grid: CellGrid;

  id: number;

  constructor(grid: CellGrid, id: number) {
    this.grid = grid;
    this.id = id;
  }

  addEdge(node: Node) {
    this.edges.push(node);
  }
}
type Tile = {
  id: number;
  grid: Grid<Cell>;
};

const tiles: Tile[] = [];
const nodeMap = new Map<number, Node>();

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
      nodeMap.set(currentTileId!, new Node(currentTile!, currentTileId!));
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
    currentGrid = rotate(currentGrid);
    grids.push(currentGrid);
  }
  currentGrid = flipX(grid);
  grids.push(currentGrid);
  for (let i = 0; i < 3; i++) {
    currentGrid = rotate(currentGrid);
    grids.push(currentGrid);
  }
  currentGrid = flipY(grid);
  grids.push(currentGrid);
  for (let i = 0; i < 3; i++) {
    currentGrid = rotate(currentGrid);
    grids.push(currentGrid);
  }
  currentGrid = flipX(flipY(grid));
  grids.push(currentGrid);
  for (let i = 0; i < 3; i++) {
    currentGrid = rotate(currentGrid);
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

function checkRightEdge(grid1: Grid<Cell>, grid2: Grid<Cell>) {
  const coordinateRange = [...Array(grid1.maxX + 1).keys()];

  return coordinateRange.every(
    (y) => grid1.get(grid1.maxX, y)! === grid2.get(grid2.minX, y)!,
  );
}

function checkBottomEdge(grid1: Grid<Cell>, grid2: Grid<Cell>) {
  const coordinateRange = [...Array(grid1.maxX + 1).keys()];

  return coordinateRange.every(
    (x) => grid1.get(x, grid1.maxY)! === grid2.get(x, grid2.minY)!,
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
      const node1 = nodeMap.get(tile1.id)!;
      const node2 = nodeMap.get(tile2.id)!;
      node1.addEdge(node2);
      node2.addEdge(node1);
      const tile1Count = (matchesCount.get(tile1.id) || 0) + 1;
      const tile2Count = (matchesCount.get(tile2.id) || 0) + 1;
      matchesCount.set(tile1.id, tile1Count);
      matchesCount.set(tile2.id, tile2Count);
    }
  }
}

let cornerTileId: number;
for (const [id, count] of matchesCount.entries()) {
  if (count === 2) {
    cornerTileId = id;
    break;
  }
}

const tileGrid: Grid<Tile> = new Grid();
// Populate top left with 2 cells
(() => {
  const node = nodeMap.get(cornerTileId!)!;

  const rotated1Grids = generateRotatedGrids(node.grid);
  const [rightNode, bottomNode] = node.edges;
  const rotatedRightGrids = generateRotatedGrids(rightNode.grid);
  const rotatedBottomGrids = generateRotatedGrids(bottomNode.grid);

  outer: for (const rotated1Grid of rotated1Grids) {
    for (const rotatedRightGrid of rotatedRightGrids) {
      for (const rotatedBottomGrid of rotatedBottomGrids) {
        if (
          checkRightEdge(rotated1Grid, rotatedRightGrid) &&
          checkBottomEdge(rotated1Grid, rotatedBottomGrid)
        ) {
          tileGrid.set(0, 0, {
            id: cornerTileId!,
            grid: rotated1Grid,
          });
          tileGrid.set(1, 0, {
            id: rightNode.id,
            grid: rotatedRightGrid,
          });
          break outer;
        }
      }
    }
  }
})();

function isNormalPiece(node: Node) {
  return node.edges.length === 4;
}

function isEdgePiece(node: Node) {
  return node.edges.length === 3;
}

function isCornerPiece(node: Node) {
  return node.edges.length === 2;
}

(() => {
  let x = 2;
  let y = 0;
  let currentTile = tileGrid.get(1, 0)!;

  root: while (true) {
    const node = nodeMap.get(currentTile!.id)!;
    let matched = false;

    outer: for (const node2 of node.edges) {
      const rotated2Grids = generateRotatedGrids(node2.grid);
      for (const rotated2Grid of rotated2Grids) {
        if (
          (x === 0 && checkBottomEdge(currentTile.grid, rotated2Grid)) ||
          (x !== 0 && checkRightEdge(currentTile.grid, rotated2Grid))
        ) {
          matched = true;
          const newTile = {
            id: node2.id,
            grid: rotated2Grid,
          };
          tileGrid.set(x, y, newTile);
          currentTile = newTile;

          const endOfEdge = isEdgePiece(node) && isCornerPiece(node2) && x > 0;
          if (endOfEdge && y > 0) {
            break root;
          }

          if (endOfEdge || (isNormalPiece(node) && isEdgePiece(node2))) {
            currentTile = tileGrid.get(0, y)!;
            y++;
            x = 0;
          } else {
            x++;
          }
          break outer;
        }
      }
    }
    if (!matched) {
      throw new Error('No match found');
    }
  }
})();

// Create the final pixel grid
const finalGrid: CellGrid = new Grid();
(() => {
  for (let gx = tileGrid.minX; gx <= tileGrid.maxX; gx++) {
    for (let gy = tileGrid.minY; gy <= tileGrid.maxY; gy++) {
      const { grid } = tileGrid.get(gx, gy)!;
      for (let x = grid.minX + 1; x <= grid.maxX - 1; x++) {
        for (let y = grid.minY + 1; y <= grid.maxY - 1; y++) {
          const finalX = gx * (grid.maxX - 1) + (x - 1);
          const finalY = gy * (grid.maxY - 1) + (y - 1);
          if (finalGrid.get(finalX, finalY)) {
            throw new Error(
              `finalX=${finalX} finalY=${finalY} already occupied`,
            );
          }
          finalGrid.set(finalX, finalY, grid.get(x, y)!);
        }
      }
    }
  }
})();

type Coordinate = {
  x: number;
  y: number;
};

const offsets: Coordinate[] = [
  {
    x: 18,
    y: 0,
  },
  {
    x: 0,
    y: 1,
  },
  {
    x: 5,
    y: 1,
  },
  {
    x: 6,
    y: 1,
  },
  {
    x: 11,
    y: 1,
  },
  {
    x: 12,
    y: 1,
  },
  {
    x: 17,
    y: 1,
  },
  {
    x: 18,
    y: 1,
  },
  {
    x: 19,
    y: 1,
  },
  {
    x: 1,
    y: 2,
  },
  {
    x: 4,
    y: 2,
  },
  {
    x: 7,
    y: 2,
  },
  {
    x: 10,
    y: 2,
  },
  {
    x: 13,
    y: 2,
  },
  {
    x: 16,
    y: 2,
  },
];

const monsterCoordinates: Map<string, true> = new Map();

// Scan for monsters
function scanWindow(grid: CellGrid, startingX: number, startingY: number) {
  const found = offsets.every(({ x, y }) => {
    return grid.get(startingX + x, startingY + y) === '#';
  });
  if (found) {
    offsets.forEach(({ x, y }) => {
      monsterCoordinates.set(`${startingX + x}-${startingY + y}`, true);
    });
  }
  return found;
}

function countNonMonsterCoordinates(grid: CellGrid) {
  let count = 0;
  for (let x = grid.minX; x <= grid.maxX; x++) {
    for (let y = grid.minY; y <= grid.maxY; y++) {
      if (grid.get(x, y) === '#' && !monsterCoordinates.get(`${x}-${y}`)) {
        count++;
      }
    }
  }
  return count;
}

(() => {
  let found = false;

  const rotatedGrids = generateRotatedGrids(finalGrid);
  for (const grid of rotatedGrids) {
    for (let x = grid.minX; x <= grid.maxX; x++) {
      for (let y = grid.minY; y <= grid.maxY; y++) {
        if (scanWindow(grid, x, y)) {
          found = true;
        }
      }
    }
    if (found) {
      console.log(countNonMonsterCoordinates(grid));
      break;
    }
  }
})();
