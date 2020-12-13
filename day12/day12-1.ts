import parseLinesFromInputFile from '../utils/parseLinesFromInputFile';

const lines = parseLinesFromInputFile(`${__dirname}/input`);

type Direction = 'N' | 'E' | 'S' | 'W';
let direction: Direction = 'E';
let x = 0;
let y = 0;

const turnMap = {
  N: {
    L: 'W' as Direction,
    R: 'E' as Direction,
  },
  E: {
    L: 'N' as Direction,
    R: 'S' as Direction,
  },
  S: {
    L: 'E' as Direction,
    R: 'W' as Direction,
  },
  W: {
    R: 'N' as Direction,
    L: 'S' as Direction,
  },
};

function turn(turnDirection: 'L' | 'R', degrees: number) {
  while (degrees > 0) {
    direction = turnMap[direction][turnDirection];
    degrees -= 90;
  }
}

// eslint-disable-next-line no-shadow
function move(direction: Direction, value: number) {
  switch (direction) {
    case 'N': {
      y += value;
      break;
    }
    case 'S': {
      y -= value;
      break;
    }
    case 'E': {
      x += value;
      break;
    }
    case 'W': {
      x -= value;
      break;
    }
    default:
  }
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
      move(direction, value);
      break;
    }
    default:
  }
}

for (const line of lines) {
  executeInstruction(line);
}
console.log(Math.abs(x) + Math.abs(y));
