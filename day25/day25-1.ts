const cardPublicKey = 3469259;
const doorPublicKey = 13170438;

function executeLoop(subjectNumber: number, value: number) {
  return (subjectNumber * value) % 20201227;
}

function executeLoops(loopCount: number, subjectNumber: number) {
  let value = 1;
  for (let i = 0; i < loopCount; i++) {
    value = executeLoop(subjectNumber, value);
  }
  return value;
}

function calculateLoopCount(publicKey: number) {
  let value = 1;
  let loopCount = 0;
  while (value !== publicKey) {
    value = executeLoop(7, value);
    loopCount++;
  }
  return loopCount;
}
const cardLoopCount = calculateLoopCount(cardPublicKey);
const doorLoopCount = calculateLoopCount(doorPublicKey);

console.log(executeLoops(cardLoopCount, doorPublicKey));
console.log(executeLoops(doorLoopCount, cardPublicKey));
