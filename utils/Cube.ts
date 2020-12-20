import Grid from './Grid';

export default class Cube<T extends string> {
  private grids: Map<number, Grid<T>> = new Map();

  maxX = 0;

  maxY = 0;

  maxZ = 0;

  minX = 0;

  minY = 0;

  minZ = 0;

  set(x: number, y: number, z: number, value: T) {
    if (!this.grids.get(z)) {
      this.grids.set(z, new Grid());
    }
    this.grids.get(z)!.set(x, y, value);
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
  }

  get(x: number, y: number, z: number) {
    return this.grids.get(z)?.get(x, y);
  }

  getGrid(z: number) {
    return this.grids.get(z);
  }

  getAdjacentCells(x: number, y: number, z: number) {
    const cells: (T | undefined)[] = [];
    cells.push(this.get(x, y, z + 1));
    cells.push(this.get(x, y, z - 1));
    if (this.grids.get(z)) {
      cells.push(...this.grids.get(z)!.getAdjacentCells(x, y));
    }
    if (this.grids.get(z - 1)) {
      cells.push(...this.grids.get(z - 1)!.getAdjacentCells(x, y));
    }
    if (this.grids.get(z + 1)) {
      cells.push(...this.grids.get(z + 1)!.getAdjacentCells(x, y));
    }
    return cells;
  }

  getPlanes() {
    return [...this.grids.keys()];
  }
}
