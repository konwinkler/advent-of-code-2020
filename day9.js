import {readFileSync} from "fs";

const example = `
35
20
15
25
47
40
62
55
65
95
102
117
150
182
127
219
299
277
309
576
`;

const readFile = (fileName) => {
  return readFileSync(fileName, "utf8");
}

const parse = (s) => {
  return s.split("\n").filter(e => e !== "").map(s => parseInt(s))
}

const validateXmas = (target, options) => {
  // can target be the sum of the values from options?
  // can do brute force or sorted pointer solution O(log n)

  for(let i=0; i<options.length; i++) {
    const x = options[i]
    for(let j=(i+1); j<options.length; j++) {
      const y = options[j]
      const sum = x + y
      if(target === sum) {
        return true
      }
    }
  }

  return false
}

const nonXmasNumber = (input, preamble) => {
  // loop though preamble
  // fill a fifo queue
  // each step validate number with queue
  // move 1 step further

  let lineCounter = 0
  const queue = []
  while(lineCounter < preamble) {
    queue.push(input[lineCounter])
    lineCounter++
  }

  let currentNumber
  let isValid = true
  while(isValid) {
    currentNumber = input[lineCounter]
    isValid = validateXmas(currentNumber, queue)
    queue.push(currentNumber)
    queue.shift() //discard the oldest element
    lineCounter++
  }

  return currentNumber
}

const sumFromRange = (numbers, start, end) => {
  return numbers.slice(start, end + 1).reduce((sum, e) => sum + e, 0)
}

const findContiguousList = (input, target) => {
  // brute force to go through everything
  for(let i=0; i<input.length; i++) {
    for(let j = (i + 1); j<input.length; j++) {
      const sum = sumFromRange(input, i, j)
      if(target === sum) {
        return [i, j]
      }
    }
  }
  throw new Error()
}

const encryptionWeakness = (input, preamble) => {
  const invalidNumber = nonXmasNumber(input, preamble)

  // find list of numbers adding up to invalidNumber
  const [start, end] = findContiguousList(input, invalidNumber)
  const continuousList = input.slice(start, end + 1)

  // return sum of min and max of this list
  const min = continuousList.reduce((min, e) => e < min ? e : min, Number.MAX_SAFE_INTEGER)
  const max = continuousList.reduce((max, e) => e > max ? e : max, Number.MIN_SAFE_INTEGER)

  return min + max
}

(() => {
  console.log(encryptionWeakness(parse(example), 5))
  console.log(encryptionWeakness(parse(readFile("input9.txt")), 25))
})();
