#! /usr/bin/env node
import { program } from "commander";
import { ContractFactory, Wallet, providers } from "ethers";
import { promises as fs } from "fs";
import { getDeploymentBytecode, simulateDeployment } from "./utils.js";

program
  .name("evm-send")
  .description("A tool for deploying EVM bytecode")
  .version("0.1.0")
  .argument("[bytecode]", "bytecode to publish");

program
  .option("-a --args", "Constructor arguments")
  .option("-d --deployment", "Add the deployment bytecode")
  .option("-f --force", "Do not prompt about the deployment bytecode")
  .option("-l --local <path>", "Read bytecode from a local path")
  .requiredOption(
    "-p --private-key <key>",
    "Private key to sign the transaction"
  )
  .requiredOption("-r --rpc-url <url>", "RPC URL to send the transaction to");

program.parse();

const options = program.opts();

let bytecode;
if (options.local === undefined) {
  if (program.args.length === 0) {
    console.error(
      "error: required argument 'bytecode' or option '--local <path>' not specified"
    );
    process.exit(1);
  }
  bytecode = program.args[0];
} else {
  bytecode = await fs.readFile(options.local, { encoding: "utf8" });
}

// regex to match even number of hexadecimal numbers
bytecode = bytecode.replace("0x", "");
const re = /^((?:[a-f0-9]{2})*\b)*$/g;
if (!re.test(bytecode)) {
  console.error("error: invalid bytecode");
  process.exit(1);
}

bytecode = options.deployment
  ? getDeploymentBytecode(bytecode) + bytecode
  : bytecode;

if (!options.force && !simulateDeployment(bytecode)) {
  console.error(
    "error: deployment bytecode not found (use --force to skip simulating deployment)"
  );
}

const wallet = new Wallet(
  options.privateKey,
  new providers.JsonRpcProvider(options.rpcUrl)
);
const factory = new ContractFactory([], bytecode, wallet);
const args = options.args ? options.args : [];
const contract = await factory.deploy(...args);

console.log(
  `Sending deployment transaction for contract on ${contract.address}...`
);

await contract.deployTransaction.wait();
console.log(`Deployed contract on ${contract.address}`);
