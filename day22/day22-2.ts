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

function serializeDecks(deck1: number[], deck2: number[]) {
  return `${deck1.join(',')}|${deck2.join(',')}`;
}

function playGame(deck1: number[], deck2: number[]): number {
  const decksSeen = new Set<string>();

  while (deck1.length !== 0 && deck2.length !== 0) {
    const serialized = serializeDecks(deck1, deck2);
    if (decksSeen.has(serialized)) {
      return 1;
    }
    decksSeen.add(serialized);
    const player1Value = deck1.shift()!;
    const player2Value = deck2.shift()!;
    let player1Wins = false;
    if (deck1.length >= player1Value && deck2.length >= player2Value) {
      player1Wins =
        playGame(deck1.slice(0, player1Value), deck2.slice(0, player2Value)) ===
        1;
    } else {
      player1Wins = player1Value > player2Value;
    }
    const winningDeck = player1Wins ? deck1 : deck2;
    const firstValue = player1Wins ? player1Value : player2Value;
    const secondValue = player1Wins ? player2Value : player1Value;
    winningDeck.push(firstValue, secondValue);
  }

  if (deck1.length) {
    return 1;
  }
  return 2;
}

function calculateScore(deck: number[]) {
  return [...deck]
    .reverse()
    .reduce((sum, value, i) => sum + value * (i + 1), 0);
}

const winner = playGame(player1Deck, player2Deck);

const winningDeck = winner === 1 ? player1Deck : player2Deck;
console.log(calculateScore(winningDeck));
