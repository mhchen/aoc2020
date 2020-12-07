import parseLinesFromInputFile from '../utils/parseLinesFromInputFile';

const lines = parseLinesFromInputFile(`${__dirname}/input`);

type BagType = string;
type BagQuantity = {
  type: BagType;
  quantity: number;
};
type Rule = {
  quantities: BagQuantity[];
  totalBags: number | null;
};

const ruleMap = new Map<BagType, Rule>();

function stripBagText(string: string) {
  return string.replace(/ bags?$/, '') as BagType;
}

function parseBagQuantity(bagQuantityString: string): BagQuantity {
  const [quantityString, ...rest] = bagQuantityString.split(' ');
  return {
    quantity: Number(quantityString),
    type: stripBagText(rest.join(' ')),
  };
}

lines.forEach((line) => {
  const [outerBagText, innerBagText] = line
    .replace(/\.$/, '')
    .split(' contain ');

  const rule =
    innerBagText === 'no other bags'
      ? {
          quantities: [],
          totalBags: null,
        }
      : {
          quantities: innerBagText.split(', ').map(parseBagQuantity),
          totalBags: null,
        };
  ruleMap.set(stripBagText(outerBagText), rule);
});

function countBags(bagType: BagType): number {
  const rule = ruleMap.get(bagType);
  if (!rule || !rule?.quantities.length) {
    return 0;
  }
  if (rule.totalBags == null) {
    rule.totalBags = rule.quantities.reduce((count, { quantity, type }) => {
      return count + quantity + quantity * countBags(type);
    }, 0);
  }
  return rule.totalBags;
}
console.log(countBags('shiny gold'));
