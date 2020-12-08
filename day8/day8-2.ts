import parseLinesFromInputFile from '../utils/parseLinesFromInputFile';

const lines = parseLinesFromInputFile(`${__dirname}/input`);

type Operation = 'nop' | 'acc' | 'jmp';

type Instruction = {
  operation: Operation;
  argument: number;
};

function parseInstruction(instruction: string) {
  const [operation, argument] = instruction.split(' ');
  return {
    operation: operation as Operation,
    argument: Number(argument),
  };
}

class BootCodeProgram {
  accumulator = 0;

  pointer = 0;

  instructions: Instruction[];

  visitedInstructions = new Set<number>();

  constructor(instructions: Instruction[]) {
    this.instructions = instructions;
  }

  run() {
    while (true) {
      if (this.visitedInstructions.has(this.pointer)) {
        return null;
      }
      if (this.pointer === this.instructions.length) {
        return this.accumulator;
      }
      this.visitedInstructions.add(this.pointer);
      this.step();
    }
  }

  step() {
    const { operation, argument } = this.instructions[this.pointer];
    switch (operation) {
      case 'nop': {
        this.pointer += 1;
        break;
      }
      case 'acc': {
        this.accumulator += argument;
        this.pointer += 1;
        break;
      }
      case 'jmp': {
        this.pointer += argument;
        break;
      }
      default: {
        throw new Error(`Unrecognized operation ${operation}`);
      }
    }
  }
}

const originalInstructions = lines.map(parseInstruction);
function swapOperation(index: number) {
  const instruction = originalInstructions[index];
  const newInstruction = {
    ...instruction,
    operation: (instruction.operation === 'jmp' ? 'nop' : 'jmp') as Operation,
  };
  return [
    ...originalInstructions.slice(0, index),
    newInstruction,
    ...originalInstructions.slice(index + 1),
  ];
}

for (let i = 0; i < originalInstructions.length; i += 1) {
  if (!['nop', 'jmp'].includes(originalInstructions[i].operation)) {
    continue;
  }
  const program = new BootCodeProgram(swapOperation(i));
  const result = program.run();
  if (result != null) {
    console.log(result);
    break;
  }
}
