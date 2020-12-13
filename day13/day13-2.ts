import parseLinesFromInputFile from '../utils/parseLinesFromInputFile';

const lines = parseLinesFromInputFile(`${__dirname}/input`);

const busIds = lines[1].split(',').map(Number);

const maxBusId = Math.max(...busIds.filter((x) => !!x));
const maxBusIdIndex = busIds.findIndex((id) => id === maxBusId)!;

let currentTimestamp = maxBusId;

while (true) {
  const testTimestamp = currentTimestamp - maxBusIdIndex;
  let isValidTimestamp = true;
  for (let i = 0; i < busIds.length; i++) {
    const id = busIds[i];
    if (Number.isNaN(id)) {
      continue;
    }
    if (!Number.isInteger((testTimestamp + i) / id)) {
      isValidTimestamp = false;
      break;
    }
  }
  if (isValidTimestamp) {
    break;
  }
  currentTimestamp += maxBusId;
}

console.log(currentTimestamp - maxBusIdIndex);
