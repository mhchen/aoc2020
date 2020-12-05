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

function getTreeCountForSlope(deltaX: number, deltaY: number) {
  let x = deltaX;
  let y = deltaY;
  let treeCount = 0;

  while (y <= grid.maxY) {
    if (grid.get(x, y) === '#') {
      treeCount += 1;
    }

    x = (x + deltaX) % (grid.maxX + 1);
    y += deltaY;
  }

  return treeCount;
}

console.log(
  getTreeCountForSlope(1, 1) *
    getTreeCountForSlope(3, 1) *
    getTreeCountForSlope(5, 1) *
    getTreeCountForSlope(7, 1) *
    getTreeCountForSlope(1, 2),
);
