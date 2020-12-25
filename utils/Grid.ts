type Row<T> = Map<number, T>;
type GridData<T> = Map<number, Row<T>>;

export default class Grid<T> {
  private data: GridData<T> = new Map();

  minX = 0;

  maxX = 0;

  minY = 0;

  maxY = 0;

  set(x: number, y: number, value: T) {
    let row = this.data.get(x);
    if (!row) {
      row = new Map<number, T>();
      this.data.set(x, row);
    }
    row.set(y, value);

    if (x > this.maxX) {
      this.maxX = x;
    }
    if (x < this.minX) {
      this.minX = x;
    }
    if (y > this.maxY) {
      this.maxY = y;
    }
    if (y < this.minY) {
      this.minY = y;
    }
  }

  get(x: number, y: number) {
    return this.data.get(x)?.get(y);
  }

  getAdjacentCells(x: number, y: number) {
    const cells: (T | undefined)[] = [];
    cells.push(this.get(x - 1, y - 1));
    cells.push(this.get(x - 1, y));
    cells.push(this.get(x - 1, y + 1));
    cells.push(this.get(x, y - 1));
    cells.push(this.get(x, y + 1));
    cells.push(this.get(x + 1, y - 1));
    cells.push(this.get(x + 1, y));
    cells.push(this.get(x + 1, y + 1));
    return cells;
  }

  print() {
    for (let y = this.minY; y <= this.maxY; y++) {
      for (let x = this.minX; x <= this.maxX; x++) {
        process.stdout.write(String(this.get(x, y)) || '.');
      }
      process.stdout.write('\n');
    }
  }
}
