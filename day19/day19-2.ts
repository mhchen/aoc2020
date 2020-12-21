import parseLinesFromInputFile from '../utils/parseLinesFromInputFile';

const lines = parseLinesFromInputFile(`${__dirname}/input`);

type RuleIndexes = number[];

type RulePair = [RuleIndexes, RuleIndexes];

type RuleValue = RuleIndexes | RulePair | string;

type Rule = {
  index: number;
  value: RuleValue;
};

let maxLineLength = 0;

const rules = new Map<number, Rule>();

const expandedRules = new Map<number, string[]>();

function parseRuleString(ruleString: string, index: number): Rule {
  const tokens = ruleString.split(' ');
  const pipeIndex = tokens.indexOf('|');
  if (pipeIndex > -1) {
    return {
      index,
      value: [
        tokens.slice(0, pipeIndex).map(Number) as RuleIndexes,
        tokens.slice(pipeIndex + 1).map(Number) as RuleIndexes,
      ],
    };
  }
  if (tokens[0].includes('"')) {
    return {
      index,
      value: tokens[0].replace(/"/g, ''),
    };
  }
  return {
    index,
    value: tokens.map(Number) as RuleIndexes,
  };
}

function expandRuleFromIndex(index: number) {
  // eslint-disable-next-line no-use-before-define
  return expandRule(rules.get(index)!);
}

function expandSingleRuleIndexes(indexes: number[]) {
  let strings: string[] = expandRuleFromIndex(indexes[0]);
  for (const ruleIndex of indexes.slice(1)) {
    const newStrings: string[] = [];
    for (const string of strings) {
      if (string.length >= maxLineLength) {
        continue;
      }
      const stringSegments = expandRuleFromIndex(ruleIndex);
      for (const stringSegment of stringSegments) {
        newStrings.push(string.concat(stringSegment));
      }
    }
    strings = newStrings;
  }
  return strings;
}

function isRulePair(ruleValue: RuleValue): ruleValue is RulePair {
  return Array.isArray(ruleValue[0]) && Array.isArray(ruleValue[1]);
}

function expandRule({ index, value }: Rule): string[] {
  if (typeof value === 'string') {
    return [value];
  }

  if (expandedRules.has(index)) {
    return expandedRules.get(index)!;
  }

  const strings = isRulePair(value)
    ? [
        ...expandSingleRuleIndexes(value[0]),
        ...expandSingleRuleIndexes(value[1]),
      ]
    : expandSingleRuleIndexes(value);

  expandedRules.set(index, strings);
  return strings;
}

let emptyLineIndex: number | null = null;

for (const [i, line] of lines.entries()) {
  if (line.trim() === '') {
    emptyLineIndex = i;
    break;
  }

  const [, indexString, ruleString] = line.match(/(\d+): (.*)/)!;
  rules.set(
    Number(indexString),
    parseRuleString(ruleString, Number(indexString)),
  );
  continue;
}

for (const line of lines.slice(emptyLineIndex! + 1)) {
  if (line.length > maxLineLength) {
    maxLineLength = line.length;
  }
}

const stringSet = new Set(expandRule(rules.get(0)!));

const stringSet42 = new Set(expandRule(rules.get(42)!));

const stringSet31 = new Set(expandRule(rules.get(31)!));

let matchedStrings = 0;
for (const line of lines.slice(emptyLineIndex! + 1)) {
  let transformedLine = line;
  let removed42s = 0;
  let removed31s = 0;
  while (true) {
    let removed = false;
    for (const string42 of stringSet42) {
      if (transformedLine.startsWith(string42)) {
        transformedLine = transformedLine.replace(
          new RegExp(`^${string42}`),
          '',
        );
        removed42s++;
        removed = true;
      }
    }
    if (!removed) {
      break;
    }
  }
  while (true) {
    let removed = false;
    for (const string31 of stringSet31) {
      if (transformedLine.endsWith(string31)) {
        transformedLine = transformedLine.replace(
          new RegExp(`${string31}$`),
          '',
        );
        removed31s++;
        removed = true;
      }
    }
    if (!removed) {
      break;
    }
  }
  if (transformedLine) {
    continue;
  }
  if (removed42s < 2 || removed31s < 1) {
    continue;
  }
  if (removed31s >= removed42s) {
    continue;
  }
  matchedStrings++;
}
console.log(matchedStrings);
