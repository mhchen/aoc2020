import parseLinesFromInputFile from '../utils/parseLinesFromInputFile';
import sumArray from '../utils/sumArray';

const lines = parseLinesFromInputFile(`${__dirname}/input`);

type Tokens = (string | Tokens)[];

function evaluateParens(tokens: Tokens): Tokens {
  let parensLevel = 0;
  const newTokens: Tokens = [];
  let currentTokensArray: Tokens = newTokens;
  for (const token of tokens) {
    if (token === '(') {
      parensLevel++;
      const newTokensArray: Tokens = [];
      currentTokensArray.push(newTokensArray);
      currentTokensArray = newTokensArray;
      continue;
    }

    if (token === ')') {
      parensLevel--;
      currentTokensArray = newTokens;
      for (let i = 0; i < parensLevel; i++) {
        currentTokensArray = currentTokensArray[
          currentTokensArray.length - 1
        ] as Tokens;
      }
      continue;
    }

    currentTokensArray!.push(token);
  }
  return currentTokensArray!;
}

function evaluateAddition(tokens: Tokens | string): Tokens | string {
  let isParsingAddition = false;

  if (typeof tokens === 'string') {
    return tokens;
  }

  const newTokens: Tokens = [];
  for (const token of tokens) {
    if (token === '+') {
      isParsingAddition = true;
      continue;
    }

    if (isParsingAddition) {
      isParsingAddition = false;
      const currentOperand = newTokens.pop() as string | Tokens;
      newTokens.push([currentOperand, '+', evaluateAddition(token)]);
      continue;
    }

    newTokens.push(evaluateAddition(token));
  }
  return newTokens;
}

function evaluateTokens(tokens: Tokens | string): number {
  let currentOperand: number | null = null;
  let currentOperator: string | null = null;
  for (const token of tokens) {
    if (token === '*' || token === '+') {
      currentOperator = token;
      continue;
    }

    const value = Array.isArray(token) ? evaluateTokens(token) : Number(token);

    if (currentOperand && currentOperator) {
      if (currentOperator === '+') {
        currentOperand += value;
      } else {
        currentOperand *= value;
      }
    } else {
      currentOperand = value;
    }
    continue;
  }
  return currentOperand!;
}

function evaluateExpression(expression: string) {
  const tokens = evaluateAddition(
    evaluateParens(expression.replace(/ /g, '').split(''))
  );
  return evaluateTokens(tokens);
}

console.log(sumArray(lines.map(evaluateExpression)));
