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

function evaluateTokens(tokens: Tokens): number {
  const tokensWithoutParens = evaluateParens(tokens);
  let currentOperand: number | null = null;
  let currentOperator: string | null = null;
  for (const token of tokensWithoutParens) {
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
  const tokens = expression.replace(/ /g, '').split('');
  return evaluateTokens(tokens);
}

console.log(sumArray(lines.map(evaluateExpression)));
