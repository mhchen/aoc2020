import * as fs from 'fs';

const lines = fs.readFileSync('./input', 'utf-8').split('\n');
for (let i = 0; i < lines.length; i += 1) {
  for (let j = i + 1; j < lines.length; j += 1) {
    for (let k = j + 1; k < lines.length; k += 1) {
      const iNum = Number(lines[i]);
      const jNum = Number(lines[j]);
      const kNum = Number(lines[k]);
      if (iNum + jNum + kNum === 2020) {
        console.log(iNum * jNum * kNum);
        break;
      }
    }
  }
}
