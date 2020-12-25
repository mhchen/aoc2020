const input = '784235916';

const cups = input.split('').map(Number);
let maxCup = Math.max(...cups);
const minCup = Math.min(...cups);

for (let i = maxCup + 1; i <= 1000000; i++) {
  cups.push(i);
}
maxCup = 1000000;

class CupNode {
  value: number;

  next: CupNode | null = null;

  constructor(value: number) {
    this.value = value;
  }
}

const cupNodeMap = new Map<number, CupNode>();

let lastCupNode: CupNode | null = null;
let currentCupNode: CupNode | null = null;

for (const cup of cups) {
  const node = new CupNode(cup);
  cupNodeMap.set(cup, node);
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
  return cupNodeMap.get(value)!;
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

for (let i = 0; i < 10000000; i++) {
  doMove();
}

function getOutput() {
  const oneNode = findCupNode(1);
  const firstNode = oneNode.next!;
  const secondNode = oneNode.next!.next!;

  return firstNode.value * secondNode.value;
}

console.log(getOutput());
