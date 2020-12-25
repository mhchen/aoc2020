import { deserialize } from 'v8';
import parseLinesFromInputFile from '../utils/parseLinesFromInputFile';

const lines = parseLinesFromInputFile(`${__dirname}/input`);

type Color = 'W' | 'B';

type CoordinateMap = Map<string, Color>;

const initialMap: CoordinateMap = new Map();

type Coordinate = {
  x: number;
  y: number;
  z: number;
};

const ALL_DIRECTIONS = ['e', 'se', 'sw', 'w', 'nw', 'ne'];

function serializeCoordinate({ x, y, z }: Coordinate) {
  return `${x}|${y}|${z}`;
}

function deserializeCoordinate(serialized: string) {
  const [x, y, z] = serialized.split('|');
  return { x: Number(x), y: Number(y), z: Number(z) };
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

function getAdjacentCoordinates(coordinate: Coordinate) {
  return ALL_DIRECTIONS.map((direction) =>
    getNewCoordinate(direction, coordinate),
  );
}

function executeLine(line: string) {
  const directions = parseDirections(line);
  let currentCoordinate: Coordinate = { x: 0, y: 0, z: 0 };
  for (const direction of directions) {
    currentCoordinate = getNewCoordinate(direction, currentCoordinate);
  }
  const serialized = serializeCoordinate(currentCoordinate);
  let color = initialMap.get(serialized) || 'W';
  color = color === 'W' ? 'B' : 'W';
  initialMap.set(serialized, color);
}

lines.forEach(executeLine);

function calculateNewColor(
  coordinateMap: CoordinateMap,
  coordinate: Coordinate,
) {
  const adjacentCoordinates = getAdjacentCoordinates(coordinate);
  const currentColor =
    coordinateMap.get(serializeCoordinate(coordinate)) || 'W';
  let blackTileCount = 0;
  for (const adjacentCoordinate of adjacentCoordinates) {
    const tileColor = coordinateMap.get(
      serializeCoordinate(adjacentCoordinate),
    );
    if (tileColor === 'B') {
      blackTileCount++;
    }
  }
  if (currentColor === 'B' && (blackTileCount === 0 || blackTileCount > 2)) {
    return 'W';
  }
  if (currentColor === 'W' && blackTileCount === 2) {
    return 'B';
  }
  return currentColor;
}

function countBlackTiles(coordinateMap: CoordinateMap) {
  let count = 0;

  for (const color of coordinateMap.values()) {
    if (color === 'B') {
      count++;
    }
  }
  return count;
}

let currentCoordinateMap = initialMap;

for (let i = 0; i < 100; i++) {
  const newMap: CoordinateMap = new Map();
  const serializedCoordinates = [...currentCoordinateMap.keys()];
  const coordinates = serializedCoordinates.map(deserializeCoordinate);

  for (const coordinate of coordinates) {
    const adjacentCoordinates = getAdjacentCoordinates(coordinate);
    serializedCoordinates.push(...adjacentCoordinates.map(serializeCoordinate));
  }

  for (const serializedCoordinate of new Set(serializedCoordinates)) {
    newMap.set(
      serializedCoordinate,
      calculateNewColor(
        currentCoordinateMap,
        deserializeCoordinate(serializedCoordinate),
      ),
    );
  }

  currentCoordinateMap = newMap;
  console.log(countBlackTiles(currentCoordinateMap));
}
