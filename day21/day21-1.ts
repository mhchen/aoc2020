import parseLinesFromInputFile from '../utils/parseLinesFromInputFile';

const lines = parseLinesFromInputFile(`${__dirname}/input`);

type AllergenMap = Map<string, string[]>;

const allIngredients: string[] = [];

const potentialAllergenMap: AllergenMap = new Map();

type PotentialAllergen = {
  allergen: string;
  ingredients: string[];
};

type IngredientListEntry = {
  allergens: string[];
  ingredientsSet: Set<string>;
};
const ingredientsList: IngredientListEntry[] = [];

function parseLine(line: string) {
  const [, ingredientsString, allergensString] = line.match(
    /^(.*) \(contains (.*)\)$/,
  )!;

  const ingredients = ingredientsString.split(' ');
  const allergens = allergensString.split(', ');
  allIngredients.push(...ingredients);

  ingredientsList.push({
    ingredientsSet: new Set(ingredients),
    allergens,
  });

  for (const allergen of allergens) {
    let ingredientsForAllergen = potentialAllergenMap.get(allergen) || [];
    ingredientsForAllergen = [
      ...new Set([...ingredientsForAllergen, ...ingredients]),
    ];
    potentialAllergenMap.set(allergen, ingredientsForAllergen);
  }
}
lines.forEach(parseLine);

const noAllergens = new Set<string>(allIngredients);

const initialPotentialAllergens = [
  ...potentialAllergenMap.entries(),
].map(([allergen, ingredients]) => ({ allergen, ingredients }));

function tryAllergens(
  potentialAllergens: PotentialAllergen[],
  currentAllergenMap = new Map<string, string>(),
) {
  if (!potentialAllergens.length) {
    for (const ingredient of currentAllergenMap.values()) {
      noAllergens.delete(ingredient);
    }
    return;
  }
  const potentialAllergensClone = [...potentialAllergens];
  const { allergen, ingredients } = potentialAllergensClone.pop()!;
  for (const ingredient of ingredients) {
    if ([...currentAllergenMap.values()].includes(ingredient)) {
      continue;
    }
    const currentAllergenMapClone = new Map(currentAllergenMap);
    currentAllergenMapClone.set(allergen, ingredient);

    const isValidCurrentAllergenMap = ingredientsList.every(
      ({ allergens, ingredientsSet }) => {
        const ingredientsFromAllergens = allergens
          .map((allergen) => currentAllergenMapClone.get(allergen))
          .filter((x) => x);
        return ingredientsFromAllergens.every((ingredient) =>
          ingredientsSet.has(ingredient!),
        );
      },
    );
    if (!isValidCurrentAllergenMap) {
      continue;
    }
    tryAllergens(potentialAllergensClone, currentAllergenMapClone);
  }
}

tryAllergens(initialPotentialAllergens);

let count = 0;

for (const { ingredientsSet } of ingredientsList) {
  for (const ingredient of ingredientsSet) {
    if (noAllergens.has(ingredient)) {
      count++;
    }
  }
}

console.log(count);
