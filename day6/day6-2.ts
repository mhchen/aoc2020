import parseLinesFromInputFile from '../utils/parseLinesFromInputFile';

const lines = parseLinesFromInputFile(`${__dirname}/input`);

let currentGroupCharCounts: { [key: string]: number } | null = null;
let currentGroupCount = 0;
let count = 0;

function countValidGroupsInCurrentGroup() {
  return Object.values(currentGroupCharCounts).reduce(
    (prevCount, groupCount) => {
      if (groupCount === currentGroupCount) {
        return prevCount + 1;
      }
      return prevCount;
    },
    0
  );
}

for (const line of lines) {
  if (line === '' && currentGroupCharCounts) {
    count += countValidGroupsInCurrentGroup();
    currentGroupCharCounts = null;
    currentGroupCount = 0;
    continue;
  }

  for (const char of line) {
    currentGroupCharCounts = currentGroupCharCounts || {};
    currentGroupCharCounts[char] = currentGroupCharCounts[char] || 0;
    currentGroupCharCounts[char] += 1;
  }
  currentGroupCount += 1;
}
count += countValidGroupsInCurrentGroup();

console.log(count);
