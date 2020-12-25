export default function multiplyArray(array: number[]) {
  return array.reduce((product, value) => product * value, 1);
}
