import parseLinesFromInputFile from '../utils/parseLinesFromInputFile';

const lines = parseLinesFromInputFile(`${__dirname}/input`);

type BagType = string;
type Rule = {
  bagTypes: BagType[];
  canHoldGoldBag: boolean | null;
};

const ruleMap = new Map<BagType, Rule>();

function stripBagText(string: string) {
  return string.replace(/ bags?$/, '') as BagType;
}

function stripQuantity(string: string) {
  return string.replace(/^\d+ /, '') as BagType;
}

lines.forEach((line) => {
  const [outerBagText, innerBagText] = line
    .replace(/\.$/, '')
    .split(' contain ');
  const rule = {
    bagTypes: innerBagText.split(', ').map(stripBagText).map(stripQuantity),
    canHoldGoldBag: null,
  };
  ruleMap.set(stripBagText(outerBagText), rule);
});

function canBagTypeHoldGoldBag(bagType: BagType) {
  const rule = ruleMap.get(bagType);
  if (!rule || !rule?.bagTypes.length) {
    return false;
  }

  if (rule.canHoldGoldBag == null) {
    rule.canHoldGoldBag = rule.bagTypes.some((subBagType) => {
      if (subBagType === 'shiny gold') {
        return true;
      }
      return canBagTypeHoldGoldBag(subBagType);
    });
  }
  return rule.canHoldGoldBag;
}

let count = 0;

for (const bagType of ruleMap.keys()) {
  if (canBagTypeHoldGoldBag(bagType)) {
    count += 1;
  }
}

console.log(count);
