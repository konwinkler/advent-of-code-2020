import {readFileSync} from "fs";

const readFile = (fileName) => {
    return readFileSync(fileName, "utf8");
}

function parse(file) {
    const sections = readFile(file).split("\n\n")
    const rules = []
    for (const line of sections[0].split("\n")) {
        const matches = /\w+: (\d+)-(\d+) or (\d+)-(\d+)/g.exec(line)
        const [_, minA, maxA, minB, maxB] = matches
        rules.push({
            ranges: [
                {
                    min: Number(minA),
                    max: Number(maxA)
                },
                {
                    min: Number(minB),
                    max: Number(maxB)
                }

            ]
        })
    }

    const nearbyTicketsText = sections[2].split("\n")
    nearbyTicketsText.shift() // get rid of header
    let nearbyTickets = []
    for (const line of nearbyTicketsText) {
        const values = line.split(",").map(Number)
        nearbyTickets.push({
            values
        })
    }

    return {
        rules,
        nearbyTickets
    }
}

function errorRate(input) {
    const {rules, nearbyTickets} = input
    const errorTickets = []
    for (const ticket of nearbyTickets) {
        for (const value of ticket.values) {
            // value has to conform to at least one of the rules
            let valid = false
            for (const rule of rules) {
                for (const range of rule.ranges) {
                    if (value >= range.min && value <= range.max) {
                        valid = true
                    }
                }
            }
            if (!valid) {
                errorTickets.push(value)
            }
        }
    }
    return errorTickets.reduce((sum, e) => sum + e, 0);
}

console.log(errorRate(parse("example16.txt")))
console.log(errorRate(parse("input16.txt")))
