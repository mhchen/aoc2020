import parseLinesFromInputFile from '../utils/parseLinesFromInputFile';
import Grid from '../utils/Grid';

type MapUnit = '#' | '.';

const lines = parseLinesFromInputFile(`${__dirname}/input`);
const grid = new Grid<MapUnit>();

for (let y = 0; y < lines.length; y += 1) {
  const line = lines[y];
  const chars = line.split('');
  for (let x = 0; x < chars.length; x += 1) {
    grid.set(x, y, chars[x] as MapUnit);
  }
}

const X_DELTA = 3;
const Y_DELTA = 1;

let x = X_DELTA;
let y = Y_DELTA;
let treeCount = 0;

console.log(grid.maxY);

while (y <= grid.maxY) {
  console.log({ x, y, value: grid.get(x, y) });
  if (grid.get(x, y) === '#') {
    treeCount += 1;
  }

  x = (x + X_DELTA) % (grid.maxX + 1);
  y += Y_DELTA;
}

console.log(treeCount);
