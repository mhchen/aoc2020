import * as fs from 'fs';

export default function parseLinesFromInputFile(filePath: string) {
  return fs.readFileSync(filePath, 'utf-8').trim().split('\n');
};
