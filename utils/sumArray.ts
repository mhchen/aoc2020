export default function sumArray(array: number[]) {
  return array.reduce((sum, value) => sum + value, 0);
}
