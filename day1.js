var fs = require('fs')

const example = `
1721
979
366
299
675
1456
`

function readFile(fileName) {
  return fs.readFileSync(fileName, 'utf8')
}

function parse(s) {
  return s.split("\n")
    .filter(e => e !== '')
    .map(c => parseInt(c))
}

function report(numbers) {
  numbers.sort((a, b) => a - b) // sort ascending

  const target = 2020
  var lower = 0
  var upper = numbers.length - 1
  while(lower < upper) {
    const sum = numbers[lower] + numbers[upper]
    console.log(`sum ${sum}`)
    if(sum === target) {
      return numbers[lower] * numbers[upper]
    }
    if(sum < target) {
      lower++
    } else {
      upper--
    }
  }
  return `could not find ${target}`
}

(() => {
  console.log(report(parse(example)))
  console.log(report(parse(readFile('input1.txt'))))
})()