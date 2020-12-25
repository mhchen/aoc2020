const input = '784235916';

const cups = input.split('').map(Number);

class CupNode {
  value: number;

  next: CupNode | null = null;

  constructor(value: number) {
    this.value = value;
  }
}

const maxCup = Math.max(...cups);
const minCup = Math.min(...cups);

let lastCupNode: CupNode | null = null;
let currentCupNode: CupNode | null = null;

for (const cup of cups) {
  const node = new CupNode(cup);
  if (!currentCupNode) {
    currentCupNode = node;
  }
  if (lastCupNode) {
    lastCupNode.next = node;
  }
  lastCupNode = node;
}

lastCupNode!.next = currentCupNode;

function findCupNode(value: number) {
  let node = currentCupNode!;
  while (true) {
    if (node.value === value) {
      return node;
    }
    node = node.next!;
  }
}

function printList(currentNode: CupNode) {
  const output = [currentNode.value];
  let node = currentNode.next;
  while (node && node !== currentNode) {
    output.push(node.value);
    node = node.next;
  }
  return output;
}

function doMove() {
  if (!currentCupNode) {
    throw new Error('No current cup node');
  }
  const currentCup = currentCupNode.value;
  let lastPickedUpNode = currentCupNode.next!;
  const firstPickedUpNode = lastPickedUpNode;
  const pickedUpCups: number[] = [];
  for (let i = 0; i < 2; i++) {
    pickedUpCups.push(lastPickedUpNode.value);
    lastPickedUpNode = lastPickedUpNode.next!;
  }
  pickedUpCups.push(lastPickedUpNode.value);
  currentCupNode.next = lastPickedUpNode.next;
  let destinationCup = currentCup - 1;
  while (pickedUpCups.includes(destinationCup) || destinationCup < minCup) {
    destinationCup--;
    if (destinationCup < minCup) {
      destinationCup = maxCup;
    }
  }
  const destinationCupNode = findCupNode(destinationCup);
  lastPickedUpNode.next = destinationCupNode.next;
  destinationCupNode.next = firstPickedUpNode;
  currentCupNode = currentCupNode.next!;
}

for (let i = 0; i < 100; i++) {
  doMove();
}

function getOutput() {
  const oneNode = findCupNode(1);
  let node = oneNode.next!;

  const outputCups: number[] = [];

  while (node !== oneNode) {
    outputCups.push(node.value);
    node = node.next!;
  }
  return outputCups.join('');
}

console.log(getOutput());
