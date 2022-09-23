import { expect } from "chai";
import { EVM } from "../src/evm.js";
import { simulateDeployment, getDeploymentBytecode } from "../src/utils.js";

describe("EVM Tests", function () {
  const evm = new EVM();

  it("should add and return", function () {
    /*  PUSH1 0x01
        PUSH1 0x02
        ADD
        PUSH1 0x00
        MSTORE
        MSIZE
        PUSH1 0x00
        RETURN  */
    const bytecode = "6001600201600052596000f3";
    const result = evm.run(bytecode);

    expect(Number(result)).to.be.equal(3);
  });

  it("should push, swap, and dup", function () {
    /*  PUSH1 0x01
        PUSH2 0x0002
        ADD
        DUP1
        SWAP1
        DIV
        PUSH1 0x00
        MSTORE
        MSIZE
        PUSH1 0x00
        RETURN  */

    const bytecode = "600161000201809004600052596000f3";
    const result = evm.run(bytecode);

    expect(Number(result)).to.be.equal(1);
  });

  it("should jump and jumpi", function () {
    /*  PUSH1 0x01
        PUSH2 0x0002
        EQ
        ISZERO
        PUSH1 0x1B
        JUMPI
        JUMPDEST
        PUSH1 0x00
        PUSH1 0x00
        REVERT
        JUMPDEST
        PUSH1 0x00
        PUSH1 0x02
        LT
        PUSH1 0x1B
        JUMPI
        STOP
        INVALID
        JUMPDEST
        PUSH1 0x10
        JUMP  */

    const bytecode =
      "60016100021415601b575b60006000fd5b6000600210601b5700fe5b601056";
    evm.run(bytecode);

    expect(evm.reverted).to.be.false;
  });
});

describe("Deployment Code Check Tests", function () {
  it("should detect missing deployment code", function () {
    const bytecode = "604260005260206000F3";

    const { reverted, returnData } = simulateDeployment(bytecode);

    expect(reverted).to.be.false;
    expect(bytecode).to.not.include(returnData);
  });

  it("should detect existing deployment code", function () {
    const bytecode = "600A600C600039600A6000F3604260005260206000F3";

    const { reverted, returnData } = simulateDeployment(bytecode);
    expect(reverted).to.be.false;
    expect(bytecode).to.include(returnData);
  });

  it("should work with mixed-case bytecode", function () {
    const bytecode = "600a600C600039600A6000f3604260005260206000F3";

    const { reverted, returnData } = simulateDeployment(bytecode);
    expect(reverted).to.be.false;
    expect(bytecode).to.include(returnData);
  });

  it("should add deployment bytecode for small programs", function () {
    const bytecode = "604260005260206000F3";

    expect(bytecode.length).to.be.below(243);

    const deployableBytecode = getDeploymentBytecode(bytecode) + bytecode;

    const { reverted, returnData } = simulateDeployment(deployableBytecode);
    expect(reverted).to.be.false;
    expect(bytecode).to.be.equal(returnData);
  });

  it("should add deployment bytecode for large programs", function () {
    const bytecode = `600160010160010160010160010160010160010160010160010160
    010160010160010160010160010160010160010160010160010160010160010160010160
    010160010160010160010160010160010160010160010160010160010160010160010160
    010160010160010160010160010160010160010160010160010160010160010160010160
    010160010160010160010160010160010160010160010160010160010160010160010160
    010160010160010160010160010160010160010160010160010160010160010160010160
    010160010160010160010160010160010160010160010160010160010160010160010160
    010160010160010160010160010160010160010160010160010160010160010160010160
    0101600101600101600101600059F3`;

    expect(bytecode.length).to.be.above(243);

    const deployableBytecode = getDeploymentBytecode(bytecode) + bytecode;

    const { reverted, returnData } = simulateDeployment(deployableBytecode);
    expect(reverted).to.be.false;
    expect(bytecode).to.be.equal(returnData);
  });
});
