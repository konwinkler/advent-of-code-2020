import {readFileSync} from "fs";

const example = `
16
10
15
5
1
11
7
19
6
12
4
`;

const readFile = (fileName) => {
  return readFileSync(fileName, "utf8");
}

const parse = (s) => {
  return s.split("\n").filter(e => e !== "").map(Number)
}

const cache = new Map()

const countOptions = (numbers) => {
  if(numbers.length === 1) {
    return 1
  }

  const key = numbers.toString()
  if(cache.has(key)) {
    return cache.get((key))
  }

  // numbers is sorted
  const first = numbers[0]
  const options = []
  for(let i=1; i<4; i++) {
    const element = numbers[i]
    if((element !== undefined) && ((element - first) <= 3)) {
      options.push(i)
    } else {
      break
    }
  }
  let allOptions = 0
  for(const option of options) {
    const tail = numbers.slice(option)
    const tailOptions = countOptions(tail)
    allOptions += tailOptions
  }

  cache.set(key, allOptions)
  return allOptions
}

const countArrangements = (input) => {
  input.unshift(0)
  input.sort((a, b) => a - b)
  input.push(Math.max(...input) + 3)

  return countOptions(input)
}

console.log(countArrangements(parse(example)))
console.log(countArrangements(parse(readFile("input10.txt"))))
