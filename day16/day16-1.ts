import parseLinesFromInputFile from '../utils/parseLinesFromInputFile';
import sumArray from '../utils/sumArray';

const lines = parseLinesFromInputFile(`${__dirname}/input`);

type Rule = (numberToCheck: number) => boolean;

const rules: Rule[] = [];
let myTicketNext = false;

const invalidFields: number[] = [];

for (const line of lines) {
  const ruleMatches = line.match(/(.*): (\d+)-(\d+) or (\d+)-(\d+)/);
  if (ruleMatches) {
    const [min1, max1, min2, max2] = ruleMatches.slice(2).map(Number);

    rules.push((numberToCheck) => {
      return (
        (numberToCheck >= min1 && numberToCheck <= max1) ||
        (numberToCheck >= min2 && numberToCheck <= max2)
      );
    });
    continue;
  }
  if (line === '') {
    continue;
  }

  if (line === 'your ticket:') {
    myTicketNext = true;
    continue;
  }

  if (myTicketNext) {
    myTicketNext = false;
    continue;
  }

  if (line === 'nearby tickets:') {
    continue;
  }

  const fields = line.split(',').map(Number);
  for (const field of fields) {
    const valid = rules.some((rule) => rule(field));
    if (!valid) {
      invalidFields.push(field);
    }
  }
}

console.log(sumArray(invalidFields));
