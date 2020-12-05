import parseLinesFromInputFile from '../utils/parseLinesFromInputFile';

const lines = parseLinesFromInputFile(`${__dirname}/input`);
const passports = [];

const REQUIRED_PROPERTIES = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid'];

type Passport = {
  [key: string]: string;
};

function parsePassportLine(line: string) {
  return line.split(' ').reduce((hash, keyValue) => {
    const [key, value] = keyValue.split(':');
    hash[key] = value;
    return hash;
  }, {});
}

let currentPassport: Passport | null = null;

for (const line of lines) {
  if (line === '') {
    passports.push(currentPassport);
    currentPassport = null;
    continue;
  }

  if (!currentPassport) {
    currentPassport = {};
  }
  Object.assign(currentPassport, parsePassportLine(line));
}

if (currentPassport) {
  passports.push(currentPassport);
}

function checkValidPassport(passport: Passport) {
  return REQUIRED_PROPERTIES.every((property) => !!passport[property]);
}

let count = 0;
for (const passport of passports) {
  if (checkValidPassport(passport)) {
    count += 1;
  }
}

console.log(count);
