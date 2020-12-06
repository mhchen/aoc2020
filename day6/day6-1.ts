import parseLinesFromInputFile from '../utils/parseLinesFromInputFile';

const lines = parseLinesFromInputFile(`${__dirname}/input`);

let currentGroupChars: string[] | null = null;
let count = 0;

for (const line of lines) {
  if (line === '' && currentGroupChars) {
    count += new Set(currentGroupChars).size;
    currentGroupChars = null;
    continue;
  }

  if (!currentGroupChars) {
    currentGroupChars = [];
  }
  currentGroupChars.push(...line.split(''));
}

count += new Set(currentGroupChars).size;
console.log(count);
