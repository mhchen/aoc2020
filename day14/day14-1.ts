import parseLinesFromInputFile from '../utils/parseLinesFromInputFile';

const lines = parseLinesFromInputFile(`${__dirname}/input`);

type BitmaskValue = {
  bit: number;
  value: string;
};

let bitmask: BitmaskValue[];

function createBitmask(line: string) {
  const mask = line.replace('mask = ', '');
  const bits = mask.split('').reverse().join('');
  bitmask = [];
  for (let i = 0; i < bits.length; i++) {
    const value = bits[i];

    if (value === 'X') {
      continue;
    }
    bitmask.push({
      bit: i,
      value,
    });
  }
}

const memory = new Map<number, number>();

function applyMask(value: number) {
  const binaryChars = value.toString(2).split('').reverse();
  for (const { bit, value: bitmaskValue } of bitmask) {
    binaryChars[bit] = bitmaskValue;
  }
  for (let i = 0; i < binaryChars.length; i++) {
    binaryChars[i] = binaryChars[i] || '0';
  }
  return parseInt(binaryChars.reverse().join(''), 2);
}

function assignValue(line: string) {
  const [, addressString, valueString] = line.match(/mem\[(\d+)\] = (\d+)/)!;
  memory.set(Number(addressString), applyMask(Number(valueString)));
}

for (const line of lines) {
  if (line.startsWith('mask')) {
    createBitmask(line);
    continue;
  }
  assignValue(line);
}

console.log([...memory.values()].reduce((sum, value) => sum + value, 0));
