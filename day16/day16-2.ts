import parseLinesFromInputFile from '../utils/parseLinesFromInputFile';
import sumArray from '../utils/sumArray';

const lines = parseLinesFromInputFile(`${__dirname}/input`);

type Checker = (numberToCheck: number) => boolean;

const rules: Map<string, Checker> = new Map();
let myTicketNext = false;

const otherTickets: number[][] = [];
let myTicket: number[];

function parseTicket(line: string) {
  return line.split(',').map(Number);
}

for (const line of lines) {
  const ruleMatches = line.match(/(.*): (\d+)-(\d+) or (\d+)-(\d+)/);
  if (ruleMatches) {
    const [min1, max1, min2, max2] = ruleMatches.slice(2).map(Number);

    rules.set(ruleMatches[1], (numberToCheck) => {
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
    myTicket = parseTicket(line);
    myTicketNext = false;
    continue;
  }

  if (line === 'nearby tickets:') {
    continue;
  }

  const ticket = parseTicket(line);
  for (const field of ticket) {
    const valid = [...rules.values()].some((checker) => checker(field));
    if (valid) {
      otherTickets.push(ticket);
    }
  }
}
const ruleNames = [...rules.keys()];
const fieldsByIndex: Map<number, string> = new Map();
const potentialFieldsByIndex: Map<number, Set<string>> = new Map();
for (let i = 0; i < rules.size; i++) {
  potentialFieldsByIndex.set(i, new Set(ruleNames));
}

function setFieldByIndex(index: number, field: string) {
  fieldsByIndex.set(index, field);
  for (const potentialFields of potentialFieldsByIndex.values()) {
    potentialFields.delete(field);
  }
}

const checkers = [...rules.values()];
const validTickets = otherTickets.filter((ticket) =>
  ticket.every((field) => checkers.some((checker) => checker(field)))
);

for (const ticket of validTickets) {
  for (let i = 0; i < ticket.length; i++) {
    const field = ticket[i];
    const potentialFields = potentialFieldsByIndex.get(i)!;
    if (potentialFields.size === 1) {
      setFieldByIndex(i, [...potentialFields.values()][0]);
      continue;
    }

    for (const potentialField of potentialFields) {
      const checker = rules.get(potentialField)!;
      if (!checker(field)) {
        potentialFields.delete(potentialField);

        if (potentialFields.size === 1) {
          setFieldByIndex(i, [...potentialFields.values()][0]);
        }
      }
    }
  }
}

const departureFields: number[] = [];
for (const [index, field] of fieldsByIndex) {
  if (field.startsWith('departure')) {
    departureFields.push(myTicket![index]);
  }
}

console.log(departureFields.reduce((product, value) => product * value, 1));
