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
seatIds.sort();

for (let i = 0; i < seatIds.length; i += 1) {
  const seatId = seatIds[i];
  if (seatIds[i + 1] !== seatId + 1) {
    console.log(seatId + 1);
    break;
  }
}
