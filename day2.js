import {readFileSync} from 'fs'

const example = `
1-3 a: abcde
1-3 b: cdefg
2-9 c: ccccccccc
`

function readFile(fileName) {
    return readFileSync(fileName, 'utf8')
}

function parse(s) {
    const lines = s.split("\n").filter(e => e !== '')
    var result = []
    for (const line of lines) {
        var [min, rMin] = line.split("-")
        var [max, rMax, word] = rMin.split(" ")
        var [letter] = rMax.split(":")
        result.push({
            min: parseInt(min),
            max: parseInt(max),
            letter,
            word
        })
    }
    return result
}


function passwords(lines) {
    var counter = 0
    for (const line of lines) {
        const a = (line.word[line.min - 1] === line.letter)
        const b = (line.word[line.max - 1] === line.letter)
        if ((a && !b) || (!a && b)) {
            counter++
        }
    }
    return counter
}

(() => {
    console.log(passwords(parse(example)))
    console.log(passwords(parse(readFile("input2.txt"))))
})()