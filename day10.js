import {readFileSync} from "fs";

const example = `
28
33
18
42
31
14
46
20
48
47
24
23
49
45
19
38
39
11
1
32
25
35
8
17
7
9
4
2
34
10
3
`;

const readFile = (fileName) => {
  return readFileSync(fileName, "utf8");
}

const parse = (s) => {
  return s.split("\n").filter(e => e !== "").map(Number)
}

const joltDifferences = (input) => {
  input.unshift(0)
  input.sort((a, b) => a - b)
  input.push(input[input.length - 1] + 3)
  const steps = input.map((number, index, arr) => {
    const next = arr[index + 1]
    return next - number
  }).filter(e => !isNaN(e))

  const countSteps = new Map()
  for(const step of steps) {
    if(!countSteps.has(step)) {
      countSteps.set(step, 1)
    } else {
      countSteps.set(step, countSteps.get(step) + 1)
    }
  }

  let total = 1
  for(const difference of countSteps.keys()) {
    const count = countSteps.get(difference)
    total = total * Number(count)
  }

  return total
}

console.log(joltDifferences(parse(example)))
console.log(joltDifferences(parse(readFile("input10.txt"))))
