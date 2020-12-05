import * as fs from 'fs';

function countCharacters(character: string, password: string) {
  let count = 0;
  for (const passwordCharacter of password) {
    if (character === passwordCharacter) {
      count += 1;
    }
  }
  return count;
}

function maybeCountPassword(line: string) {
  const [minMax, characterWithColon, password] = line.split(' ');

  const [min, max] = minMax.split('-').map(Number);
  const count = countCharacters(characterWithColon.replace(':', ''), password);

  return count >= min && count <= max ? 1 : 0;
}

const validPasswordCount = fs
  .readFileSync(`${__dirname}/input`, 'utf-8')
  .split('\n')
  .reduce((count, line) => maybeCountPassword(line) + count, 0);

console.log(validPasswordCount);
