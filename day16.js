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

    const myTicketText = sections[1].split("\n")
    myTicketText.shift()
    const myValues = myTicketText[0].split(",").map((Number))
    const myTicket = {
        values: myValues
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
        myTicket,
        nearbyTickets
    }
}

function discardInvalidTickets(input) {
    const {rules, nearbyTickets} = input
    const validNearbyTickets = []
    for (const ticket of nearbyTickets) {
        let validTicket = true
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
                validTicket = false
                break;
            }
        }
        if (validTicket) {
            validNearbyTickets.push(ticket)
        }
    }
    input.nearbyTickets = validNearbyTickets
}

function departureTime(input) {
    console.log(`initial nearby tickets ${input.nearbyTickets.length}`)
    const {rules, myTicket, nearbyTickets} = input

    // discard invalid ticket
    discardInvalidTickets(input)
    console.log(`after nearby tickets ${input.nearbyTickets.length}`)

    // determine which rules correspond to which index on tickets
    const ruleToIndex = new Map()
    // find rule which satisfies all values of a column
    for (let columnIndex = 0; columnIndex < 20; columnIndex++) {
        let foundAnyRule = false
        const columnValues = nearbyTickets.map(ticket => ticket.values[columnIndex])
        for (const [ruleIndex, rule] of rules.entries()) {
            let satisfy = true
            for (const value of columnValues) {
                let validValue = false
                for (const range of rule.ranges) {
                    if (value >= range.min && value <= range.max) {
                        validValue = true
                    }
                }
                if (!validValue) {
                    satisfy = false
                    break;
                }
            }
            if (satisfy) {
                ruleToIndex.set(Number(ruleIndex), columnIndex)
                foundAnyRule = true
            }
        }
        if (!foundAnyRule) {
            throw new Error(`Could not find any rule for column index ${columnIndex}`)
        }
    }

    console.assert([...ruleToIndex.keys()].length === 20, `${[...ruleToIndex.keys()].length} should be 20`)

    // take all fields of your ticket which correspond to departure
    const valueIndices = []
    for (let i = 0; i < 6; i++) {
        const valueIndex = ruleToIndex.get(i)
        valueIndices.push(valueIndex)
    }

    // multiply those 6 values
    return valueIndices.map(index => myTicket.values[index])
        .reduce((product, e) => product * e, 1)
}

// console.log(departureTime(parse("example16.txt")))
console.log(departureTime(parse("input16.txt")))
