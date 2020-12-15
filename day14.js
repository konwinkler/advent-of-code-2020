import {readFileSync} from "fs";

const readFile = (fileName) => {
    return readFileSync(fileName, "utf8");
}

function parse(input) {
    const lines = input.split("\n").filter(e => e !== "")
    const program = []
    for (const line of lines) {
        if (line.slice(0, 3) === "mas") {
            program.push({
                type: "mask",
                mask: line.split(" ")[2]
            })
        } else {
            program.push({
                type: "mem",
                target: BigInt(/\[(\d+)\]/g.exec(line)[1]),
                value: BigInt(line.split(" ")[2])
            })
        }
    }
    return program;
}

function setNthBit(value, n, targetBit) {
    return (value & (~(BigInt(1) << n))) | (targetBit << n);
}

function applyMask(value, mask) {
    for (const [index, targetBit] of mask.split("").entries()) {
        if (targetBit !== "X") {
            const n = 35 - index
            value = setNthBit(value, BigInt(n), BigInt(targetBit))
        }
    }
    return value;
}

function memorySum(program) {
    let mask
    let memory = new Map()
    for (const instruction of program) {
        if (instruction.type === "mask") {
            mask = instruction.mask
        } else {
            const value = applyMask(instruction.value, mask)
            memory.set(instruction.target, value)
        }
    }

    // TODO sum of memory

    return Array.from(memory.values()).reduce((sum, e) => sum + e, BigInt(0));
}

console.log(memorySum(parse(readFile("example14.txt"))))
console.log(memorySum(parse(readFile("input14.txt"))))
