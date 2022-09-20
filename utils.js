export const toHexString = (num, len) => {
  const str = num.toString(16);
  return "0".repeat(len - str.length) + str;
};

export const getDeploymentBytecode = (bytecode) => {
  const bytecodeSize = bytecode.length / 2;
  // 0xFF - 0x0C (min deployment code size)
  if (bytecodeSize > 243) {
    return `61${toHexString(bytecodeSize, 4)}600e60003961${toHexString(
      bytecodeSize,
      4
    )}6000f3`;
  } else {
    return `60${toHexString(bytecodeSize, 2)}600c60003960${toHexString(
      bytecodeSize,
      2
    )}6000f3`;
  }
};

export const simulateDeployment = (bytecode) => {
  // TODO: implement deployment checking
  return true;
};
