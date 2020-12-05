import * as fs from 'fs';

function countCharacters(
  character: string,
  password: string,
  positions: number[],
) {
  let count = 0;
  for (const position of positions) {
    if (character === password[position - 1]) {
      count += 1;
    }
  }
  return count;
}

function maybeCountPassword(line: string) {
  const [positionString, characterWithColon, password] = line.split(' ');

  const positions = positionString.split('-').map(Number);
  const count = countCharacters(
    characterWithColon.replace(':', ''),
    password,
    positions,
  );

  return count === 1 ? 1 : 0;
}

const validPasswordCount = fs
  .readFileSync(`${__dirname}/input`, 'utf-8')
  .split('\n')
  .reduce((count, line) => maybeCountPassword(line) + count, 0);

console.log(validPasswordCount);
