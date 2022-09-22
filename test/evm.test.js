import { expect } from "chai";
import { simulateDeployment, getDeploymentBytecode } from "../src/utils.js";

describe("Deployment Code Checks", function () {
    it("should detect missing deployment code", function () {
        const bytecode = "";

        const { reverted, returnData } = simulateDeployment(bytecode);

        expect(reverted).to.be.false;
        expect(bytecode).to.not.include(returnData);
    });

    it("should detect existing deployment code", function () {
        const bytecode = "";

        const { reverted, returnData } = simulateDeployment(bytecode);
        expect(reverted).to.be.false;
        expect(bytecode).to.include(returnData);
    });

    it("should add deployment bytecode for small programs", function () {
        const bytecode = "";

        expect(bytecode.length).to.be.below(243);

        const deployableBytecode = bytecode + getDeploymentBytecode(bytecode);

        const { reverted, returnData } = simulateDeployment(deployableBytecode);
        expect(reverted).to.be.false;
        expect(bytecode).to.include(returnData);
    });

    it("should add deployment bytecode for large programs", function () {
        const bytecode = "";

        expect(bytecode.length).to.be.above(243);

        const deployableBytecode = bytecode + getDeploymentBytecode(bytecode);

        const { reverted, returnData } = simulateDeployment(deployableBytecode);
        expect(reverted).to.be.false;
        expect(bytecode).to.include(returnData);
    })
});