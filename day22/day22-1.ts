import parseLinesFromInputFile from '../utils/parseLinesFromInputFile';

const lines = parseLinesFromInputFile(`${__dirname}/input`);

const player1Deck: number[] = [];
const player2Deck: number[] = [];

let fillingDeck1 = true;
for (const line of lines) {
  if (line === 'Player 2:') {
    fillingDeck1 = false;
  }
  if (line === '') {
    continue;
  }
  const value = Number(line);
  if (Number.isNaN(value)) {
    continue;
  }

  if (fillingDeck1) {
    player1Deck.push(value);
  } else {
    player2Deck.push(value);
  }
}

while (player1Deck.length !== 0 && player2Deck.length !== 0) {
  const player1Value = player1Deck.shift()!;
  const player2Value = player2Deck.shift()!;
  const player1Wins = player1Value > player2Value;
  const winningDeck = player1Wins ? player1Deck : player2Deck;
  const greaterValue = player1Wins ? player1Value : player2Value;
  const lesserValue = player1Wins ? player2Value : player1Value;
  winningDeck.push(greaterValue, lesserValue);
}

function calculateScore(deck: number[]) {
  return [...deck]
    .reverse()
    .reduce((sum, value, i) => sum + value * (i + 1), 0);
}

const winningDeck = player1Deck.length ? player1Deck : player2Deck;
console.log(calculateScore(winningDeck));
