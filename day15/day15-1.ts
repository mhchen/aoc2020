import parseLinesFromInputFile from '../utils/parseLinesFromInputFile';

const numbers = parseLinesFromInputFile(`${__dirname}/input`)[0]
  .split(',')
  .map(Number);

const previousIndexes = new Map<number, number>();

for (let i = 0; i < numbers.length - 1; i++) {
  previousIndexes.set(numbers[i], i);
}
function calculateNextNumber() {
  const lastIndex = numbers.length - 1;
  const lastNumber = numbers[lastIndex];
  const previousIndex = previousIndexes.get(lastNumber);
  previousIndexes.set(lastNumber, lastIndex);
  if (previousIndex == null) {
    return 0;
  }

  return lastIndex + 1 - (previousIndex + 1);
}

while (numbers.length < 30000000) {
  const nextNumber = calculateNextNumber();
  numbers.push(nextNumber);
}

console.log(numbers.pop());
