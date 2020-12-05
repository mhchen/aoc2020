import * as fs from 'fs';

const lines = fs.readFileSync('./input', 'utf-8').split('\n');
for (let i = 0; i < lines.length; i += 1) {
  for (let j = i + 1; j < lines.length; j += 1) {
    const iNum = Number(i);
    const jNum = Number(j);
    if (iNum + jNum === 2020) {
      console.log(iNum * jNum);
    }
  }
}
