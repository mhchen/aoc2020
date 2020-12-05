type Row<T> = Map<number, T>;
type GridData<T> = Map<number, Row<T>>;

export default class Grid<T> {
  private data: GridData<T> = new Map();

  maxX = 0;

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
    if (y > this.maxY) {
      this.maxY = y;
    }
  }

  get(x: number, y: number) {
    return this.data.get(x)?.get(y);
  }
}
