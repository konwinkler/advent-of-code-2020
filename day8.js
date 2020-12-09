import {readFileSync} from "fs";

const example = `
nop +0
acc +1
jmp +4
acc +3
jmp -3
acc -99
acc +1
jmp -4
acc +6
`;

const readFile = (fileName) => {
  return readFileSync(fileName, "utf8");
}

const parse = (s) => {
  const lines = s.split("\n").filter(e => e !== "")

  return lines.map(line => {
    const operation = line.split(" ")[0]
    const argument = parseInt(line.split(" ")[1])
    return {
      operation,
      argument
    }
  })
}

const accAtStop = (instructions) => {
  // execute program
  // keep track of executed lines in a set
  // if current line is same as in set then return accumulator

  const executedLines = new Set()
  let currentLine = 0
  let accumulator = 0

  while(true) {
    executedLines.add(currentLine)
    const currentInstruction = instructions[currentLine]
    switch(currentInstruction.operation) {
      case "nop":
        currentLine++
        break
      case "acc":
        currentLine++
        accumulator += currentInstruction.argument
        break
      case "jmp":
        currentLine += currentInstruction.argument
        break
    }
    if(executedLines.has(currentLine)) {
      return {
        state: "infinite loop",
        accumulator
      }
    }
    if(currentLine === instructions.length) {
      return {
        state: "terminated",
        accumulator
      }
    }
  }
}

const copy = (e) => {
  return JSON.parse(JSON.stringify(e))
}

const findInstruction = (instructions) => {
  // nop to jump
  for(let i=0; i<instructions.length; i++) {
    if(instructions[i].operation === "nop") {
      const modifiedInstructions = copy(instructions)
      modifiedInstructions[i].operation = "jmp"
      const result = accAtStop(modifiedInstructions)
      if(result.state === "terminated") {
        return result.accumulator
      }
    }
  }

  // jmp to nop
  for(let i=0; i<instructions.length; i++) {
    if(instructions[i].operation === "jmp") {
      const modifiedInstructions = copy(instructions)
      modifiedInstructions[i].operation = "nop"
      const result = accAtStop(modifiedInstructions)
      if(result.state === "terminated") {
        return result.accumulator
      }
    }
  }
}

(() => {
  console.log(findInstruction(parse(example)))
  console.log(findInstruction(parse(readFile("input8.txt"))))
})();
