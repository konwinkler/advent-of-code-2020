import { readFileSync } from "fs";

const example = `
BFFFBBFRRR
FFFBBBFRRR
BBFFBBFRLL
`;

function readFile(fileName) {
  return readFileSync(fileName, "utf8");
}

function parse(s) {
  const lines = s.split("\n").filter(e => e !== "")
  const boardingPasses = []
  for(const line of lines) {
    boardingPasses.push({
      rowCode: line.slice(0, 7),
      columnCode: line.slice(7, 10)
    })
  }
  return boardingPasses
}

function decode(code) {
  let result = 0
  for(let i=0; i < code.length; i++) {
    const char = code[i]
    if(char === "B" || char==="R") {
      result += 2 ** (code.length - i - 1)
    }
  }
  return result
}

function emptySeat(boardingPasses) {
  const ids = []
  for(const boardingPass of boardingPasses) {
    const row = decode(boardingPass.rowCode)
    const column = decode(boardingPass.columnCode)
    console.log(`${row}, ${column}`)
    ids.push(row * 8 + column)
  }

  ids.sort((a, b) => (a - b))

  const missing = []
  for(let i=0; i<ids.length; i++) {
    const id = ids[i]
    if(!ids.includes(id + 1) && ids.includes(id + 2)) {
      missing.push(id + 1)
    }
  }
  return missing
}

(() => {
  // console.log(highestID(parse(example)));
  console.log(emptySeat(parse(readFile("input5.txt"))))
})();
