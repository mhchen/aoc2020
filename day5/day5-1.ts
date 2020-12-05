import parseLinesFromInputFile from '../utils/parseLinesFromInputFile';

const lines = parseLinesFromInputFile(`${__dirname}/input`);

function binaryFromLine(line: string) {
  const binaryString = line
    .split('')
    .map((char) => (['F', 'L'].includes(char) ? 0 : 1))
    .join('');
  return parseInt(binaryString, 2);
}

const seatIds = lines.map(binaryFromLine);
console.log(Math.max(...seatIds));
