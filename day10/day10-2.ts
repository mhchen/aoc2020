import parseLinesFromInputFile from '../utils/parseLinesFromInputFile';

const joltages = parseLinesFromInputFile(`${__dirname}/input`).map(Number);

joltages.sort((a, b) => a - b);
joltages.unshift(0);
const outletJoltage = joltages[joltages.length - 1] + 3;
joltages.push(outletJoltage);

const cache = new Map<number, number>();

function countConfigurations(currentJoltageIndex: number) {
  if (joltages[currentJoltageIndex] === outletJoltage) {
    return 1;
  }

  if (cache.get(currentJoltageIndex) != null) {
    return cache.get(currentJoltageIndex)!;
  }

  const joltage = joltages[currentJoltageIndex];
  let count = 0;
  for (let i = currentJoltageIndex + 1; i < joltages.length; i++) {
    const difference = joltages[i] - joltage;
    if (difference <= 3) {
      count += countConfigurations(i);
    } else {
      break;
    }
  }
  cache.set(currentJoltageIndex, count);
  return count;
}

console.log(countConfigurations(0));
