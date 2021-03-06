import parseLinesFromInputFile from '../utils/parseLinesFromInputFile';

const lines = parseLinesFromInputFile(`${__dirname}/input`);

type RulePair = [RuleIndexes, RuleIndexes];

type RuleIndexes = number[];

type RuleValue = RuleIndexes | RulePair | string;

type Rule = {
  index: number;
  value: RuleValue;
};

const expandedRuleMap = new Map<number, Set<string>>();

const rules = new Map<number, Rule>();

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

function getRuleFromIndex(index: number) {
  return rules.get(index);
}

function expandRuleFromIndex(index: number) {
  // eslint-disable-next-line no-use-before-define
  return expandRule(getRuleFromIndex(index)!);
}

function expandSingleRuleIndexes(indexes: number[]) {
  let strings: string[] = expandRuleFromIndex(indexes[0]);
  for (const ruleIndex of indexes.slice(1)) {
    const newStrings: string[] = [];
    const stringSegments = expandRuleFromIndex(ruleIndex);
    for (const string of strings) {
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

  if (isRulePair(value)) {
    return [
      ...expandSingleRuleIndexes(value[0]),
      ...expandSingleRuleIndexes(value[1]),
    ];
  }
  return expandSingleRuleIndexes(value);
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

const stringSet = new Set(expandRule(rules.get(0)!));

let matchedStrings = 0;
for (const line of lines.slice(emptyLineIndex! + 1)) {
  if (stringSet.has(line)) {
    matchedStrings++;
  }
}
console.log(matchedStrings);
