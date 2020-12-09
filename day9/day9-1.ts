import parseLinesFromInputFile from '../utils/parseLinesFromInputFile';

const numbers = parseLinesFromInputFile(`${__dirname}/input`).map(Number);

const PREAMBLE_LENGTH = 25;

for (let i = PREAMBLE_LENGTH; i < numbers.length; i++) {
  let validNumber = false;

  for (let j = i - PREAMBLE_LENGTH; j < i; j++) {
    if (validNumber) {
      break;
    }
    for (let k = j + 1; k < i; k++) {
      if (numbers[j] + numbers[k] === numbers[i]) {
        validNumber = true;
        break;
      }
    }
  }
  if (!validNumber) {
    console.log(numbers[i]);
    process.exit(0);
  }
}
