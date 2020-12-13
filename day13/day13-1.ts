import parseLinesFromInputFile from '../utils/parseLinesFromInputFile';

const lines = parseLinesFromInputFile(`${__dirname}/input`);

const timestamp = Number(lines[0]);
const busIds = lines[1]
  .split(',')
  .map(Number)
  .filter((x) => !!x);

let minTimestamp = Infinity;
let minBusId = null;
for (const busId of busIds) {
  let earliestTime = timestamp / busId;
  const earliestTimeFloor = Math.floor(earliestTime);
  if (earliestTime !== earliestTimeFloor) {
    earliestTime = (earliestTimeFloor + 1) * busId;
  }
  if (earliestTime < minTimestamp) {
    minTimestamp = earliestTime;
    minBusId = busId;
  }
}

console.log(minBusId! * (minTimestamp - timestamp));
