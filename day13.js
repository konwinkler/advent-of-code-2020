import {readFileSync} from "fs";

const readFile = (fileName) => {
    return readFileSync(fileName, "utf8");
}

const parse = (s) => {
    const lines = s.split("\n").filter(e => e !== "")
    const busIDs = lines[1].split(",")
    const schedule = []
    for (const [index, bus] of busIDs.entries()) {
        if (bus !== "x") {
            schedule.push({
                busID: Number(bus),
                time: Number(index)
            })
        }
    }
    return schedule
}

function allBusesInOrder(timestamp, schedule) {
    for (const {time, busID} of schedule) {
        const departs = (timestamp + time) % busID
        if (departs !== 0) {
            return false
        }
    }
    return true
}

const smallestDivisor = (n) => {
    if (n % 2 === 0) {
        return 2
    }
    for (let i = 3; i * i <= n; i += 2) {
        if (n % i === 0) {
            return i
        }
    }
    return n
}

const earliestTimestamp = (schedule) => {
    let increment = 1
    let start = 0
    if (schedule.length !== 1) {
        const laterSchedule = schedule.slice(1)
        const earlier = earliestTimestamp(laterSchedule)
        start = earlier
        // increment is the product of the smallest divisor of each busID

        increment = laterSchedule
            .map(bus => smallestDivisor(bus.busID))
            .reduce((product, e) => product * e, 1)
    }

    let currentTimestamp = start
    while (true) {
        if (allBusesInOrder(currentTimestamp, schedule)) {
            return currentTimestamp
        }
        currentTimestamp += increment
    }
}

console.log(earliestTimestamp(parse(readFile("example13.txt"))))
console.log(earliestTimestamp(parse(readFile("input13.txt"))))
