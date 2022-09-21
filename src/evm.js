export class EVM {
  stack = [];
  memory = "";
  return = "";

  run(bytecode) {
    this.stack = [];
    this.memory = "";
    this.return = "";

    const opcodes = bytecode.match(/.{2}/g);
    for (let i = 0; i < opcodes.length; ++i) {
      switch (opcodes[i]) {
        case "00": // STOP
          break;

        case "01": // ADD
          if (this.stack.length < 2) {
            break;
          }
          this.stack.push(this.stack.pop() + this.stack.pop());
          break;

        case "02": // MUL
          if (this.stack.length < 2) {
            break;
          }
          this.stack.push(this.stack.pop() * this.stack.pop());
          break;

        case "03": //SUB
          if (this.stack.length < 2) {
            break;
          }
          this.stack.push(this.stack.pop() - this.stack.pop());
          break;

        case "04": // DIV
          if (this.stack.length < 2) {
            break;
          }
          this.stack.push(Math.floor(this.stack.pop() / this.stack.pop()));
          break;

        default:
          break;
      }
    }

    return this.return;
  }
}
