import Cube from '../utils/Cube';

import parseLinesFromInputFile from '../utils/parseLinesFromInputFile';

const lines = parseLinesFromInputFile(`${__dirname}/input`);

type Cell = '#' | '.';

class HyperCube<T extends string> {
  private cubes: Map<number, Cube<T>> = new Map();

  maxX = 0;

  maxY = 0;

  maxZ = 0;

  maxW = 0;

  minX = 0;

  minY = 0;

  minZ = 0;

  minW = 0;

  set(x: number, y: number, z: number, w: number, value: T) {
    if (!this.cubes.get(w)) {
      this.cubes.set(w, new Cube());
    }
    this.cubes.get(w)!.set(x, y, z, value);
    if (x > this.maxX) {
      this.maxX = x;
    }
    if (y > this.maxY) {
      this.maxY = y;
    }
    if (x < this.minX) {
      this.minX = x;
    }
    if (y < this.minY) {
      this.minY = y;
    }
    if (z < this.minZ) {
      this.minZ = z;
    }
    if (z > this.maxZ) {
      this.maxZ = z;
    }
    if (w < this.minW) {
      this.minW = w;
    }
    if (w > this.maxW) {
      this.maxW = w;
    }
  }

  get(x: number, y: number, z: number, w: number) {
    return this.cubes.get(w)?.get(x, y, z);
  }

  getAdjacentCells(x: number, y: number, z: number, w: number) {
    const cells: (T | undefined)[] = [];
    cells.push(this.get(x, y, z, w + 1));
    cells.push(this.get(x, y, z, w - 1));
    if (this.cubes.get(w)) {
      cells.push(...this.cubes.get(w)!.getAdjacentCells(x, y, z));
    }
    if (this.cubes.get(w + 1)) {
      cells.push(...this.cubes.get(w + 1)!.getAdjacentCells(x, y, z));
    }
    if (this.cubes.get(w - 1)) {
      cells.push(...this.cubes.get(w - 1)!.getAdjacentCells(x, y, z));
    }
    return cells;
  }
}

let hypercube = new HyperCube<Cell>();

lines.forEach((line, y) => {
  const cells = line.split('') as Cell[];

  cells.forEach((cell, x) => {
    hypercube.set(x, y, 0, 0, cell);
  });
});

for (let i = 0; i < 6; i++) {
  const newCube = new HyperCube<Cell>();

  for (let x = hypercube.minX - 1; x <= hypercube.maxX + 1; x++) {
    for (let y = hypercube.minY - 1; y <= hypercube.maxY + 1; y++) {
      for (let z = hypercube.minZ - 1; z <= hypercube.maxZ + 1; z++) {
        for (let w = hypercube.minW - 1; w <= hypercube.maxW + 1; w++) {
          const currentCell = hypercube.get(x, y, z, w);
          const cells = hypercube.getAdjacentCells(x, y, z, w);
          const activeAdjacentCount = cells.filter((cell) => cell === '#')
            .length;
          if (currentCell === '#' && [2, 3].includes(activeAdjacentCount)) {
            newCube.set(x, y, z, w, '#' as const);
          } else if (
            (currentCell === '.' || currentCell === undefined) &&
            activeAdjacentCount === 3
          ) {
            newCube.set(x, y, z, w, '#' as const);
          } else {
            newCube.set(x, y, z, w, '.' as const);
          }
        }
      }
    }
  }
  hypercube = newCube;
}

let activeCount = 0;
for (let x = hypercube.minX - 1; x <= hypercube.maxX + 1; x++) {
  for (let y = hypercube.minY - 1; y <= hypercube.maxY + 1; y++) {
    for (let z = hypercube.minZ - 1; z <= hypercube.maxZ + 1; z++) {
      for (let w = hypercube.minW - 1; w <= hypercube.maxW + 1; w++) {
        if (hypercube.get(x, y, z, w) === '#') {
          activeCount++;
        }
      }
    }
  }
}

console.log(activeCount);
