import parseLinesFromInputFile from '../utils/parseLinesFromInputFile';

const lines = parseLinesFromInputFile(`${__dirname}/input`);

type Direction = 'N' | 'E' | 'S' | 'W';
let x = 0;
let y = 0;
let waypointX = 10;
let waypointY = 1;

function turn(turnDirection: 'L' | 'R', degrees: number) {
  let relativeX = waypointX - x;
  let relativeY = waypointY - y;
  while (degrees > 0) {
    if (turnDirection === 'R') {
      [relativeX, relativeY] = [relativeY, -relativeX];
    } else {
      [relativeX, relativeY] = [-relativeY, relativeX];
    }
    degrees -= 90;
  }
  waypointX = x + relativeX;
  waypointY = y + relativeY;
}

// eslint-disable-next-line no-shadow
function move(direction: Direction, value: number) {
  switch (direction) {
    case 'N': {
      waypointY += value;
      break;
    }
    case 'S': {
      waypointY -= value;
      break;
    }
    case 'E': {
      waypointX += value;
      break;
    }
    case 'W': {
      waypointX -= value;
      break;
    }
    default:
  }
}

function forwardMove(value: number) {
  const relativeX = waypointX - x;
  const relativeY = waypointY - y;
  x += value * relativeX;
  y += value * relativeY;
  waypointX = x + relativeX;
  waypointY = y + relativeY;
}

function executeInstruction(instruction: string) {
  const [, action, valueString] = instruction.match(
    /(\w)(\d+)/,
  ) as RegExpMatchArray;
  const value = Number(valueString);

  switch (action) {
    case 'N':
    case 'S':
    case 'E':
    case 'W':
      move(action, value);
      break;
    case 'L':
    case 'R':
      turn(action, value);
      break;
    case 'F': {
      forwardMove(value);
      break;
    }
    default:
  }
}

for (const line of lines) {
  executeInstruction(line);
}
console.log(Math.abs(x) + Math.abs(y));
