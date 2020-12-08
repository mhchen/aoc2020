import parseLinesFromInputFile from '../utils/parseLinesFromInputFile';

const lines = parseLinesFromInputFile(`${__dirname}/input`);

type Operation = 'nop' | 'acc' | 'jmp';

type Instruction = {
  operation: Operation;
  argument: number;
};

class BootCodeProgram {
  accumulator = 0;

  pointer = 0;

  instructions: Instruction[] = [];

  visitedInstructions = new Set<number>();

  constructor(instructionLines: string[]) {
    this.instructions = instructionLines.map(this.parseInstruction);
  }

  run() {
    while (true) {
      if (this.visitedInstructions.has(this.pointer)) {
        console.log(`Loop found, accumulator=${this.accumulator}`);
        break;
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

  private parseInstruction(instruction: string) {
    const [operation, argument] = instruction.split(' ');
    return {
      operation: operation as Operation,
      argument: Number(argument),
    };
  }
}

const program = new BootCodeProgram(lines);
program.run();
