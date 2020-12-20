import Cube from '../utils/Cube';

import parseLinesFromInputFile from '../utils/parseLinesFromInputFile';

const lines = parseLinesFromInputFile(`${__dirname}/input`);

type Cell = '#' | '.';

let cube = new Cube<Cell>();

lines.forEach((line, y) => {
  const cells = line.split('') as Cell[];

  cells.forEach((cell, x) => {
    cube.set(x, y, 0, cell);
  });
});

for (let i = 0; i < 6; i++) {
  const newCube = new Cube<Cell>();

  for (let x = cube.minX - 1; x <= cube.maxX + 1; x++) {
    for (let y = cube.minY - 1; y <= cube.maxY + 1; y++) {
      for (let z = cube.minZ - 1; z <= cube.maxZ + 1; z++) {
        const currentCell = cube.get(x, y, z);
        const cells = cube.getAdjacentCells(x, y, z);
        const activeAdjacentCount = cells.filter((cell) => cell === '#').length;
        if (currentCell === '#' && [2, 3].includes(activeAdjacentCount)) {
          newCube.set(x, y, z, '#' as const);
        } else if (
          (currentCell === '.' || currentCell === undefined) &&
          activeAdjacentCount === 3
        ) {
          newCube.set(x, y, z, '#' as const);
        } else {
          newCube.set(x, y, z, '.' as const);
        }
      }
    }
  }
  cube = newCube;
}

let activeCount = 0;
for (let x = cube.minX - 1; x <= cube.maxX + 1; x++) {
  for (let y = cube.minY - 1; y <= cube.maxY + 1; y++) {
    for (let z = cube.minZ - 1; z <= cube.maxZ + 1; z++) {
      if (cube.get(x, y, z) === '#') {
        activeCount++;
      }
    }
  }
}

console.log(activeCount);
