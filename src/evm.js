export class EVM {
  stack = [];
  memory = "";
  return = "";
  reverted = false;

  run(bytecode) {
    bytecode = bytecode.toUpperCase();
    this.stack = [];
    this.memory = "";
    this.return = "";

    // regex to split the bytecode into 2 character opcodes
    const opcodes = bytecode.match(/.{2}/g);
    for (let pc = 0; pc < opcodes.length; ++pc) {
      if (this.reverted) {
        break;
      }

      let shift, offset, destOffset, size, value, jumpDest, b;

      switch (opcodes[pc]) {
        case "00": // STOP
          return;

        case "01": // ADD
          if (this.stack.length < 2) {
            this.reverted = true;
            break;
          }
          this.stack.push(this.stack.pop() + this.stack.pop());
          break;

        case "02": // MUL
          if (this.stack.length < 2) {
            this.reverted = true;
            break;
          }
          this.stack.push(this.stack.pop() * this.stack.pop());
          break;

        case "03": // SUB
          if (this.stack.length < 2) {
            this.reverted = true;
            break;
          }
          this.stack.push(this.stack.pop() - this.stack.pop());
          break;

        case "04": // DIV
          if (this.stack.length < 2) {
            this.reverted = true;
            break;
          }
          this.stack.push(Math.floor(this.stack.pop() / this.stack.pop()));
          break;

        case "05": // TODO: SDIV
          this.reverted = true;
          break;

        case "06": // MOD
          if (this.stack.length < 2) {
            this.reverted = true;
            break;
          }
          this.stack.push(this.stack.pop() % this.stack.pop());
          break;

        case "07": // TODO: SMOD
          this.reverted = true;
          break;

        case "08": // ADDMOD
          if (this.stack.length < 3) {
            this.reverted = true;
            break;
          }
          this.stack.push(
            (this.stack.pop() + this.stack.pop()) % this.stack.pop()
          );
          break;

        case "09": // MULMOD
          if (this.stack.length < 3) {
            this.reverted = true;
            break;
          }
          this.stack.push(
            (this.stack.pop() * this.stack.pop()) % this.stack.pop()
          );
          break;

        case "0A": // EXP
          if (this.stack.length < 2) {
            this.reverted = true;
            break;
          }
          this.stack.push(this.stack.pop() ** this.stack.pop());
          break;

        case "0B": // TODO: SIGNEXTEND
          this.reverted = true;
          break;

        case "10": // LT
          if (this.stack.length < 2) {
            this.reverted = true;
            break;
          }
          this.stack.push(this.stack.pop() < this.stack.pop() ? 1 : 0);
          break;

        case "11": // GT
          if (this.stack.length < 2) {
            this.reverted = true;
            break;
          }
          this.stack.push(this.stack.pop() > this.stack.pop() ? 1 : 0);
          break;

        case "12": // TODO: SLT
          this.reverted = true;
          break;

        case "13": // TODO: SGT
          this.reverted = true;
          break;

        case "14": // EQ
          if (this.stack.length < 2) {
            this.reverted = true;
            break;
          }
          this.stack.push(this.stack.pop() === this.stack.pop() ? 1 : 0);
          break;

        case "15": // ISZERO
          if (this.stack.length < 1) {
            this.reverted = true;
            break;
          }
          this.stack.push(this.stack.pop() === 0 ? 1 : 0);
          break;

        case "16": // AND
          if (this.stack.length < 2) {
            this.reverted = true;
            break;
          }
          this.stack.push(this.stack.pop() & this.stack.pop());
          break;

        case "17": // OR
          if (this.stack.length < 2) {
            this.reverted = true;
            break;
          }
          this.stack.push(this.stack.pop() | this.stack.pop());
          break;

        case "18": // XOR
          if (this.stack.length < 2) {
            this.reverted = true;
            break;
          }
          this.stack.push(this.stack.pop() ^ this.stack.pop());
          break;

        case "19": // NOT
          if (this.stack.length < 1) {
            this.reverted = true;
            break;
          }
          this.stack.push(~this.stack.pop());
          break;

        case "1A": // BYTE
          if (this.stack.length < 2) {
            this.reverted = true;
            break;
          }
          this.stack.push((0xff << (31 - this.stack.pop())) & this.stack.pop());
          break;

        case "1B": // SHL
          if (this.stack.length < 2) {
            this.reverted = true;
            break;
          }
          shift = this.stack.pop();
          this.stack.push(this.stack.pop() << shift);
          break;

        case "1C": // SHR
          if (this.stack.length < 2) {
            this.reverted = true;
            break;
          }
          shift = this.stack.pop();
          this.stack.push(this.stack.pop() >> shift);
          break;

        case "1D": // TODO: SAR
          this.reverted = true;
          break;

        case "20": // TODO: SHA3
          this.reverted = true;
          break;

        case "30": // TODO: ADDRESS
          this.reverted = true;
          break;

        case "31": // TODO: BALANCE
          this.reverted = true;
          break;

        case "32": // TODO: ORIGIN
          this.reverted = true;
          break;

        case "33": // TODO: CALLER
          this.reverted = true;
          break;

        case "34": // TODO: CALLVALUE
          this.reverted = true;
          break;

        case "35": // TODO: CALLDATALOAD
          this.reverted = true;
          break;

        case "36": // TODO: CALLDATASIZE
          this.reverted = true;
          break;

        case "37": // TODO: CALLDATACOPY
          this.reverted = true;
          break;

        case "38": // CODESIZE
          this.stack.push(bytecode.length / 2);
          break;

        case "39": // CODECOPY
          if (this.stack.length < 3) {
            this.reverted = true;
            break;
          }
          destOffset = this.stack.pop();
          offset = this.stack.pop();
          size = this.stack.pop();
          this.insertToMemory(
            destOffset,
            bytecode.slice(offset * 2, offset * 2 + size * 2)
          );
          break;

        case "3A": // TODO: GASPRICE
          this.reverted = true;
          break;

        case "3B": // TODO: EXTCODESIZE
          this.reverted = true;
          break;

        case "3C": // TODO: EXTCODECOPY
          this.reverted = true;
          break;

        case "3D": // RETURNDATASIZE
          this.stack.push(this.return.length / 2);
          break;

        case "3E": // RETURNDATACOPY
          destOffset = this.stack.pop();
          offset = this.stack.pop();
          size = this.stack.pop();
          this.insertToMemory(
            destOffset,
            this.return.slice(offset, offset + size * 2)
          );
          break;

        case "3F": // TODO: EXTCODEHASH
          this.reverted = true;
          break;

        case "40": // TODO: BLOCKHASH
          this.reverted = true;
          break;

        case "41": // TODO: COINBASE
          this.reverted = true;
          break;

        case "42": // TODO: TIMESTAMP
          this.reverted = true;
          break;

        case "43": // TODO: NUMBER
          this.reverted = true;
          break;

        case "44": // TODO: DIFFICULTY
          this.reverted = true;
          break;

        case "45": // TODO: GASLIMIT
          this.reverted = true;
          break;

        case "46": // TODO: CHAINID
          this.reverted = true;
          break;

        case "47": // TODO: SELFBALANCE
          this.reverted = true;
          break;

        case "48": // TODO: BASEFEE
          this.reverted = true;
          break;

        case "50": // POP
          if (this.stack.length < 1) {
            this.reverted = true;
            break;
          }
          this.stack.pop();
          break;

        case "51": // MLOAD
          if (this.stack.length < 1) {
            this.reverted = true;
            break;
          }
          offset = this.stack.pop();
          this.stack.push("0x" + this.memory.slice(offset, offset + 64));
          break;

        case "52": // MSTORE
          if (this.stack.length < 2) {
            this.reverted = true;
            break;
          }
          offset = this.stack.pop();
          value = this.stack.pop();
          this.insertToMemory(offset, String(value).padStart(32, "0"));
          break;

        case "53": // MSTORE8
          if (this.stack.length < 2) {
            this.reverted = true;
            break;
          }
          offset = this.stack.pop();
          value = this.stack.pop();
          this.insertToMemory(offset, String(value).padStart(8, "0"));
          break;

        case "54": // TODO: SLOAD
          this.reverted = true;
          break;

        case "55": // TODO: SSTORE
          this.reverted = true;
          break;

        case "56": // JUMP
          if (this.stack.length < 1) {
            this.reverted = true;
            break;
          }
          jumpDest = this.stack.pop();
          if (bytecode.length < jumpDest) {
            this.reverted = true;
            break;
          }
          if (bytecode.slice(jumpDest * 2, jumpDest * 2 + 2) != "5B") {
            this.reverted = true;
            break;
          }
          pc = jumpDest;
          break;

        case "57": // JUMPI
          if (this.stack.length < 2) {
            this.reverted = true;
            break;
          }
          jumpDest = this.stack.pop();
          b = this.stack.pop();
          if (b !== 1) {
            break;
          }
          if (bytecode.length < jumpDest) {
            this.reverted = true;
            break;
          }
          if (bytecode.slice(jumpDest * 2, jumpDest * 2 + 2) != "5B") {
            this.reverted = true;
            break;
          }
          pc = jumpDest;
          break;

        case "58": // PC
          this.stack.push(pc);
          break;

        case "59": // MSIZE
          this.stack.push(this.memory.length / 2);
          break;

        case "5A": // TODO: GAS
          this.reverted = true;
          break;

        case "5B": // JUMPDEST
          break;

        case "60": // PUSH1
          this.stack.push(
            Number("0x" + bytecode.slice(pc * 2 + 2, pc * 2 + 4))
          );
          pc += 1;
          break;

        case "61": // PUSH2
          this.stack.push(
            Number("0x" + bytecode.slice(pc * 2 + 2, pc * 2 + 6))
          );
          pc += 2;
          break;

        case "62": // PUSH3
          this.stack.push(
            Number("0x" + bytecode.slice(pc * 2 + 2, pc * 2 + 8))
          );
          pc += 3;
          break;

        case "63": // PUSH4
          this.stack.push(
            Number("0x" + bytecode.slice(pc * 2 + 2, pc * 2 + 10))
          );
          pc += 4;
          break;

        case "64": // PUSH5
          this.stack.push(
            Number("0x" + bytecode.slice(pc * 2 + 2, pc * 2 + 12))
          );
          pc += 5;
          break;

        case "65": // PUSH6
          this.stack.push(
            Number("0x" + bytecode.slice(pc * 2 + 2, pc * 2 + 14))
          );
          pc += 6;
          break;

        case "66": // PUSH7
          this.stack.push(
            Number("0x" + bytecode.slice(pc * 2 + 2, pc * 2 + 16))
          );
          pc += 7;
          break;

        case "67": // PUSH8
          this.stack.push(
            Number("0x" + bytecode.slice(pc * 2 + 2, pc * 2 + 18))
          );
          pc += 8;
          break;

        case "68": // PUSH9
          this.stack.push(
            Number("0x" + bytecode.slice(pc * 2 + 2, pc * 2 + 20))
          );
          pc += 9;
          break;

        case "69": // PUSH10
          this.stack.push(
            Number("0x" + bytecode.slice(pc * 2 + 2, pc * 2 + 22))
          );
          pc += 10;
          break;

        case "6A": // PUSH11
          this.stack.push(
            Number("0x" + bytecode.slice(pc * 2 + 2, pc * 2 + 24))
          );
          pc += 11;
          break;

        case "6B": // PUSH12
          this.stack.push(
            Number("0x" + bytecode.slice(pc * 2 + 2, pc * 2 + 26))
          );
          pc += 12;
          break;

        case "6C": // PUSH13
          this.stack.push(
            Number("0x" + bytecode.slice(pc * 2 + 2, pc * 2 + 28))
          );
          pc += 13;
          break;

        case "6D": // PUSH14
          this.stack.push(
            Number("0x" + bytecode.slice(pc * 2 + 2, pc * 2 + 30))
          );
          pc += 14;
          break;

        case "6E": // PUSH15
          this.stack.push(
            Number("0x" + bytecode.slice(pc * 2 + 2, pc * 2 + 32))
          );
          pc += 15;
          break;

        case "6F": // PUSH16
          this.stack.push(
            Number("0x" + bytecode.slice(pc * 2 + 2, pc * 2 + 34))
          );
          pc += 16;
          break;

        case "70": // PUSH17
          this.stack.push(
            Number("0x" + bytecode.slice(pc * 2 + 2, pc * 2 + 36))
          );
          pc += 17;
          break;

        case "71": // PUSH18
          this.stack.push(
            Number("0x" + bytecode.slice(pc * 2 + 2, pc * 2 + 38))
          );
          pc += 18;
          break;

        case "72": // PUSH19
          this.stack.push(
            Number("0x" + bytecode.slice(pc * 2 + 2, pc * 2 + 40))
          );
          pc += 19;
          break;

        case "73": // PUSH20
          this.stack.push(
            Number("0x" + bytecode.slice(pc * 2 + 2, pc * 2 + 42))
          );
          pc += 20;
          break;

        case "74": // PUSH21
          this.stack.push(
            Number("0x" + bytecode.slice(pc * 2 + 2, pc * 2 + 44))
          );
          pc += 21;
          break;

        case "75": // PUSH22
          this.stack.push(
            Number("0x" + bytecode.slice(pc * 2 + 2, pc * 2 + 46))
          );
          pc += 22;
          break;

        case "76": // PUSH23
          this.stack.push(
            Number("0x" + bytecode.slice(pc * 2 + 2, pc * 2 + 48))
          );
          pc += 23;
          break;

        case "77": // PUSH24
          this.stack.push(
            Number("0x" + bytecode.slice(pc * 2 + 2, pc * 2 + 50))
          );
          pc += 24;
          break;

        case "78": // PUSH25
          this.stack.push(
            Number("0x" + bytecode.slice(pc * 2 + 2, pc * 2 + 52))
          );
          pc += 25;
          break;

        case "79": // PUSH26
          this.stack.push(
            Number("0x" + bytecode.slice(pc * 2 + 2, pc * 2 + 54))
          );
          pc += 26;
          break;

        case "7A": // PUSH27
          this.stack.push(
            Number("0x" + bytecode.slice(pc * 2 + 2, pc * 2 + 56))
          );
          pc += 27;
          break;

        case "7B": // PUSH28
          this.stack.push(
            Number("0x" + bytecode.slice(pc * 2 + 2, pc * 2 + 58))
          );
          pc += 28;
          break;

        case "7C": // PUSH29
          this.stack.push(
            Number("0x" + bytecode.slice(pc * 2 + 2, pc * 2 + 60))
          );
          pc += 29;
          break;

        case "7D": // PUSH30
          this.stack.push(
            Number("0x" + bytecode.slice(pc * 2 + 2, pc * 2 + 62))
          );
          pc += 30;
          break;

        case "7E": // PUSH31
          this.stack.push(
            Number("0x" + bytecode.slice(pc * 2 + 2, pc * 2 + 64))
          );
          pc += 31;
          break;

        case "7F": // PUSH32
          this.stack.push(
            Number("0x" + bytecode.slice(pc * 2 + 2, pc * 2 + 66))
          );
          pc += 32;
          break;

        case "80": // DUP1
          this.stack.push(this.stack[0]);
          break;

        case "81": // DUP2
          this.stack.push(this.stack[1]);
          break;

        case "82": // DUP3
          this.stack.push(this.stack[2]);
          break;

        case "83": // DUP4
          this.stack.push(this.stack[3]);
          break;

        case "84": // DUP5
          this.stack.push(this.stack[4]);
          break;

        case "85": // DUP6
          this.stack.push(this.stack[5]);
          break;

        case "86": // DUP7
          this.stack.push(this.stack[6]);
          break;

        case "87": // DUP8
          this.stack.push(this.stack[7]);
          break;

        case "88": // DUP9
          this.stack.push(this.stack[8]);
          break;

        case "89": // DUP10
          this.stack.push(this.stack[9]);
          break;

        case "8A": // DUP11
          this.stack.push(this.stack[10]);
          break;

        case "8B": // DUP12
          this.stack.push(this.stack[11]);
          break;

        case "8C": // DUP13
          this.stack.push(this.stack[12]);
          break;

        case "8D": // DUP14
          this.stack.push(this.stack[13]);
          break;

        case "8E": // DUP15
          this.stack.push(this.stack[14]);
          break;

        case "8F": // DUP16
          this.stack.push(this.stack[15]);
          break;

        case "90": // SWAP1
          [this.stack[0], this.stack[1]] = [this.stack[1], this.stack[0]];
          break;

        case "91": // SWAP2
          [this.stack[0], this.stack[2]] = [this.stack[2], this.stack[0]];
          break;

        case "92": // SWAP3
          [this.stack[0], this.stack[3]] = [this.stack[3], this.stack[0]];
          break;

        case "93": // SWAP4
          [this.stack[0], this.stack[4]] = [this.stack[4], this.stack[0]];
          break;

        case "94": // SWAP5
          [this.stack[0], this.stack[5]] = [this.stack[5], this.stack[0]];
          break;

        case "95": // SWAP6
          [this.stack[0], this.stack[6]] = [this.stack[6], this.stack[0]];
          break;

        case "96": // SWAP7
          [this.stack[0], this.stack[7]] = [this.stack[7], this.stack[0]];
          break;

        case "97": // SWAP8
          [this.stack[0], this.stack[8]] = [this.stack[8], this.stack[0]];
          break;

        case "98": // SWAP9
          [this.stack[0], this.stack[9]] = [this.stack[9], this.stack[0]];
          break;

        case "99": // SWAP10
          [this.stack[0], this.stack[10]] = [this.stack[10], this.stack[0]];
          break;

        case "9A": // SWAP11
          [this.stack[0], this.stack[11]] = [this.stack[11], this.stack[0]];
          break;

        case "9B": // SWAP12
          [this.stack[0], this.stack[12]] = [this.stack[12], this.stack[0]];
          break;

        case "9C": // SWAP13
          [this.stack[0], this.stack[13]] = [this.stack[13], this.stack[0]];
          break;

        case "9D": // SWAP14
          [this.stack[0], this.stack[14]] = [this.stack[14], this.stack[0]];
          break;

        case "9E": // SWAP15
          [this.stack[0], this.stack[15]] = [this.stack[15], this.stack[0]];
          break;

        case "9F": // SWAP16
          [this.stack[0], this.stack[16]] = [this.stack[16], this.stack[0]];
          break;

        case "A0": // TODO: LOG0
          this.reverted = true;
          break;

        case "A1": // TODO: LOG1
          this.reverted = true;
          break;

        case "A2": // TODO: LOG2
          this.reverted = true;
          break;

        case "A3": // TODO: LOG3
          this.reverted = true;
          break;

        case "A4": // TODO: LOG4
          this.reverted = true;
          break;

        case "F0": // TODO: CREATE
          this.reverted = true;
          break;

        case "F1": // TODO: CALL
          this.reverted = true;
          break;

        case "F2": // TODO: CALLCODE
          this.reverted = true;
          break;

        case "F3": // RETURN
          if (this.stack.length < 2) {
            this.reverted = true;
            break;
          }
          offset = this.stack.pop();
          size = this.stack.pop();
          this.return = this.memory.slice(offset * 2, offset * 2 + size * 2);
          return this.return;

        case "F4": // TODO: DELEGATECALL
          this.reverted = true;
          break;

        case "F5": // TODO: CREATE2
          this.reverted = true;
          break;

        case "FA": // TODO: STATICCALL
          this.reverted = true;
          break;

        case "FD": // REVERT
          this.reverted = true;
          if (this.stack.length < 2) {
            break;
          }
          offset = this.stack.pop();
          size = this.stack.pop();
          this.return = this.memory.slice(offset * 2, offset * 2 + size * 2);
          break;

        case "FE": // INVALID
          this.reverted = true;
          break;

        case "FF": // TODO: SELFDESTRUCT
          this.reverted = true;
          break;

        default:
          this.reverted = true;
          break;
      }
    }

    return this.return;
  }

  insertToMemory(offset, value) {
    if (this.memory.length / 2 < offset) {
      this.memory += "0".repeat(offset - this.memory.length / 2);
    }
    this.memory =
      this.memory.slice(0, offset * 2) +
      value +
      this.memory.slice(offset + value.length);
  }
}
