import { EVM } from "./evm.js";

export const toHexString = (num, len) => {
  const str = num.toString(16).toUpperCase();
  return "0".repeat(len - str.length) + str;
};

export const getDeploymentBytecode = (bytecode) => {
  const bytecodeSize = bytecode.length / 2;
  // 0xFF - 0x0C (min deployment code size)
  if (bytecodeSize > 243) {
    return `61${toHexString(bytecodeSize, 4)}600E60003961${toHexString(
      bytecodeSize,
      4
    )}6000F3`;
  } else {
    return `60${toHexString(bytecodeSize, 2)}600C60003960${toHexString(
      bytecodeSize,
      2
    )}6000F3`;
  }
};

export const simulateDeployment = (bytecode) => {
  const evm = new EVM();
  const returnData = evm.run(bytecode);
  return { reverted: evm.reverted, returnData: returnData };
};
