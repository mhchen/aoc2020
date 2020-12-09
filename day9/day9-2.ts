import parseLinesFromInputFile from '../utils/parseLinesFromInputFile';

const numbers = parseLinesFromInputFile(`${__dirname}/input`).map(Number);

const INVALID_NUMBER = 552655238;

for (let i = 0; i < numbers.length; i++) {
  let sum = 0;
  const sumNumbers: number[] = [];
  for (let j = i; j < numbers.length && sum < INVALID_NUMBER; j++) {
    const currentNumber = numbers[j];
    sum += currentNumber;
    sumNumbers.push(currentNumber);
  }

  if (sum === INVALID_NUMBER) {
    const min = Math.min(...sumNumbers);
    const max = Math.max(...sumNumbers);
    console.log(min + max);
    process.exit(0);
  }
}
