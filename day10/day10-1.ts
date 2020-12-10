import parseLinesFromInputFile from '../utils/parseLinesFromInputFile';

const joltages = parseLinesFromInputFile(`${__dirname}/input`).map(Number);

joltages.sort((a, b) => a - b);
joltages.unshift(0);
joltages.push(joltages[joltages.length - 1] + 3);

let oneDifferenceCount = 0;
let threeDifferenceCount = 0;

for (let i = 0; i < joltages.length; i++) {
  const joltage = joltages[i];
  const nextJoltage = joltages[i + 1];
  const difference = nextJoltage - joltage;
  if (difference === 1) {
    oneDifferenceCount++;
  } else if (difference === 3) {
    threeDifferenceCount++;
  }
}
console.log(oneDifferenceCount * threeDifferenceCount);
