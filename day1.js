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

function report(numbers, target) {
  numbers.sort((a, b) => a - b) // sort ascending

  var lower = 0
  var upper = numbers.length - 1
  while(lower < upper) {
    const sum = numbers[lower] + numbers[upper]
    console.log(`sum ${sum}`)
    if(sum === target) {
      return [numbers[lower], numbers[upper]]
    }
    if(sum < target) {
      lower++
    } else {
      upper--
    }
  }
  return null
}

function report2(numbers) {
  for(var i=0; i<numbers.length; i++) {
    const target = 2020 - numbers[i]
    const tail = numbers.slice(i + 1)
    const foundSum = report(tail, target)
    if(foundSum !== null) {
      return numbers[i] * foundSum[0] * foundSum[1]
    }
  }
  return null
}

(() => {
  console.log(report2(parse(example)))
  console.log(report2(parse(readFile('input1.txt'))))
})()