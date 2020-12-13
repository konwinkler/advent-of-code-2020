import {readFileSync} from "fs";

const readFile = (fileName) => {
    return readFileSync(fileName, "utf8");
}

const parse = (s) => {
    const lines = s.split("\n").filter(e => e !== "")
    const earliestDeparture = Number(lines[0])
    const busIDs = lines[1].split(",")
        .filter(e => e !== "x")
        .map(Number)
    return {
        earliestDeparture,
        busIDs
    }
}

const departingBus = (notes) => {
    const {earliestDeparture, busIDs} = notes

    let currentDeparture = earliestDeparture
    while (true) {
        for (const busID of busIDs) {
            const departing = currentDeparture % busID
            if (departing === 0) {
                // found departure
                return {
                    busID,
                    time: currentDeparture - earliestDeparture
                }
            }
        }
        currentDeparture++
    }
}

const idTimesMinutes = (notes) => {
    const {busID, time} = departingBus(notes)
    return busID * time
}

console.log(idTimesMinutes(parse(readFile("example13.txt"))))
console.log(idTimesMinutes(parse(readFile("input13.txt"))))
