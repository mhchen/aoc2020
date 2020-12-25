import parseLinesFromInputFile from '../utils/parseLinesFromInputFile';

const lines = parseLinesFromInputFile(`${__dirname}/input`);

type Color = 'W' | 'B';

const coordinateMap = new Map<string, Color>();

type Coordinate = {
  x: number;
  y: number;
  z: number;
};

const ALL_DIRECTIONS = ['e', 'se', 'sw', 'w', 'nw', 'ne'];

function serializeCoordinate({ x, y, z }: Coordinate) {
  return `${x}|${y}|${z}`;
}

function parseDirections(line: string) {
  let currentLine = line;
  const directions: string[] = [];
  while (currentLine) {
    for (const direction of ALL_DIRECTIONS) {
      if (currentLine.startsWith(direction)) {
        directions.push(direction);
        currentLine = currentLine.replace(direction, '');
      }
    }
  }
  return directions;
}

function getNewCoordinate(direction: string, { x, y, z }: Coordinate) {
  switch (direction) {
    case 'e':
      return {
        x: x + 1,
        y: y - 1,
        z,
      };
    case 'se':
      return {
        x,
        y: y - 1,
        z: z + 1,
      };
    case 'sw':
      return {
        x: x - 1,
        y,
        z: z + 1,
      };
    case 'w':
      return {
        x: x - 1,
        y: y + 1,
        z,
      };
    case 'nw':
      return {
        x,
        y: y + 1,
        z: z - 1,
      };
    case 'ne':
      return {
        x: x + 1,
        y,
        z: z - 1,
      };
    default:
      throw new Error(`Unrecognized direction ${direction}`);
  }
}

function executeLine(line: string) {
  const directions = parseDirections(line);
  let currentCoordinate: Coordinate = { x: 0, y: 0, z: 0 };
  for (const direction of directions) {
    currentCoordinate = getNewCoordinate(direction, currentCoordinate);
  }
  const serialized = serializeCoordinate(currentCoordinate);
  let color = coordinateMap.get(serialized) || 'W';
  color = color === 'W' ? 'B' : 'W';
  coordinateMap.set(serialized, color);
}

lines.forEach(executeLine);
let count = 0;
for (const color of coordinateMap.values()) {
  if (color === 'B') {
    count++;
  }
}

console.log(count);
