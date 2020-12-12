import {readFileSync} from "fs";

const example = `
L.LL.LL.LL
LLLLLLL.LL
L.L.L..L..
LLLL.LL.LL
L.LL.LL.LL
L.LLLLL.LL
..L.L.....
LLLLLLLLLL
L.LLLLLL.L
L.LLLLL.LL
`;

const readFile = (fileName) => {
    return readFileSync(fileName, "utf8");
}

// const SeatStates = Object.freeze({"floor": ".", "open" : "L", "taken": "#"})

const parse = (s) => {
    return s.split("\n").filter(e => e !== "")
}

const occupied = (map, x, y) => {
    return map[x][y] === "#"
}

const modifiers = [
    [-1, -1],
    [0, -1],
    [1, -1],
    [-1, 0],
    [1, 0],
    [-1, 1],
    [0, 1],
    [1, 1]
]

const applyRules = (map, x, y) => {
    // If a seat is empty (L) and there are no occupied seats adjacent to it, the seat becomes occupied.
    // If a seat is occupied (#) and four or more seats adjacent to it are also occupied, the seat becomes empty.
    // Otherwise, the seat's state does not change.
    const seat = map[x][y]
    switch (seat) {
        case ".":
            return "."
        case "L":
            for (const [xModifier, yModifier] of modifiers) {
                if (map[x + xModifier] && map[x + xModifier][y + yModifier] === "#") {
                    return "L"
                }
            }
            return "#"
        case "#":
            let counter = 0
            for (const [xModifier, yModifier] of modifiers) {
                if (map[x + xModifier] && map[x + xModifier][y + yModifier] === "#") {
                    counter++
                }
                if (counter >= 4) {
                    return "L"
                }
            }
            return "#"
    }

}

const countSeatsAfterChaos = (initialArrangement) => {
    // create the next generation
    // loop through all positions and apply rules to determine next states
    // keep a record (string) of last state and compare to terminate

    let currentGeneration = initialArrangement
    let changeSeats = true
    while (changeSeats) {
        const previousState = JSON.stringify(currentGeneration)
        const nextGeneration = []
        for (let i = 0; i < currentGeneration.length; i++) {
            nextGeneration.push(new Array(currentGeneration[0].length))
        }
        for (let i = 0; i < currentGeneration.length; i++) {
            for (let j = 0; j < currentGeneration[0].length; j++) {
                const newState = applyRules(currentGeneration, i, j)
                nextGeneration[i][j] = newState
            }
        }
        const newState = JSON.stringify(nextGeneration)
        changeSeats = previousState !== newState
        currentGeneration = nextGeneration
    }

    return currentGeneration.flat(2).filter(c => c === "#").length
}

console.log(countSeatsAfterChaos(parse(example)))
console.log(countSeatsAfterChaos(parse(readFile("input11.txt"))))
