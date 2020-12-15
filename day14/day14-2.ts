import parseLinesFromInputFile from '../utils/parseLinesFromInputFile';

const lines = parseLinesFromInputFile(`${__dirname}/input`);

let bitmasks: string[];

function replaceCharAt(mask: string, index: number, bitChar: '0' | '1') {
  return `${mask.substring(0, index)}${bitChar}${mask.substring(index + 1)}`;
}

function resolveFloatingBitmask(mask: string): string[] {
  const xIndex = mask.indexOf('X');
  if (xIndex === -1) {
    return [mask];
  }

  return [
    ...resolveFloatingBitmask(replaceCharAt(mask, xIndex, '0')),
    ...resolveFloatingBitmask(replaceCharAt(mask, xIndex, '1')),
  ];
}

function createBitmask(line: string) {
  const mask = line.replace('mask = ', '').replace(/0/g, '-');
  bitmasks = resolveFloatingBitmask(mask);
}

const memory = new Map<number, number>();

function applyMasks(value: number) {
  return bitmasks.map((bitmask) => {
    const binaryChars = value.toString(2).padStart(36, '0').split('');
    for (let i = 0; i < bitmask.length; i++) {
      const newBit = bitmask[i];
      if (newBit !== '-') {
        binaryChars[i] = bitmask[i];
      }
    }
    return parseInt(binaryChars.join(''), 2);
  });
}

function assignValue(line: string) {
  const [, addressString, valueString] = line.match(/mem\[(\d+)\] = (\d+)/)!;
  const addresses = applyMasks(Number(addressString));
  for (const address of addresses) {
    memory.set(address, Number(valueString));
  }
}

for (const line of lines) {
  if (line.startsWith('mask')) {
    createBitmask(line);
    continue;
  }
  assignValue(line);
}

console.log([...memory.values()].reduce((sum, value) => sum + value, 0));
