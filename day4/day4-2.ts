import parseLinesFromInputFile from '../utils/parseLinesFromInputFile';

const lines = parseLinesFromInputFile(`${__dirname}/input`);
const passports = [];

const EYE_COLORS = new Set(['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth']);

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

function checkValidBirthYear(value: string) {
  const birthYear = Number(value);
  return birthYear >= 1920 && birthYear <= 2002;
}

function checkValidIssueYear(value: string) {
  const issueYear = Number(value);
  return issueYear >= 2010 && issueYear <= 2020;
}

function checkValidExpirationYear(value: string) {
  const expirationYear = Number(value);
  return expirationYear >= 2020 && expirationYear <= 2030;
}

function checkValidHeight(value: string) {
  const matches = value?.match(/(\d{2,3})(cm|in)/);
  if (!matches) {
    return false;
  }

  const [, numberString, unit] = matches;
  const number = Number(numberString);
  if (unit === 'cm') {
    return number >= 150 && number <= 193;
  }
  return number >= 59 && number <= 76;
}
function checkValidHairColor(value: string) {
  return /#[0-9a-f]{6}/.test(value);
}

function checkValidEyeColor(value: string) {
  return EYE_COLORS.has(value);
}

function checkValidPassportId(value: string) {
  return !!Number(value) && value?.length === 9;
}

function checkValidPassport(passport: Passport) {
  return (
    checkValidBirthYear(passport.byr) &&
    checkValidIssueYear(passport.iyr) &&
    checkValidExpirationYear(passport.eyr) &&
    checkValidHeight(passport.hgt) &&
    checkValidHairColor(passport.hcl) &&
    checkValidEyeColor(passport.ecl) &&
    checkValidPassportId(passport.pid)
  );
}

let count = 0;
for (const passport of passports) {
  if (checkValidPassport(passport)) {
    count += 1;
  }
}

console.log(count);
