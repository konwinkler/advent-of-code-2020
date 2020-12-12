import {readFileSync} from "fs";

const example = `
F10
N3
F7
R90
F11
`;

const readFile = (fileName) => {
    return readFileSync(fileName, "utf8");
}

const parse = (s) => {
    const lines = s.split("\n").filter(e => e !== "")
    return lines.map(s => {
        const action = s[0]
        const value = Number(s.slice(1))
        return {
            action,
            value
        }
    })
}

const turnRight = (state) => {
    const newState = {...state}
    switch (state.direction) {
        case "E":
            newState.direction =  "S"
            break
        case "N":
            newState.direction =  "E"
            break
        case "W":
            newState.direction =  "N"
            break
        case "S":
            newState.direction =  "W"
            break
    }
    return newState
}

const turnLeft = (state) => {
    const newState = {...state}
    switch (state.direction) {
        case "E":
            newState.direction =  "N"
            break
        case "N":
            newState.direction =  "W"
            break
        case "W":
            newState.direction =  "S"
            break
        case "S":
            newState.direction =  "E"
            break
    }
    return newState
}

const distance = (instructions) => {
    let state = {
        east: 0,
        north: 0,
        direction: "E"
    }

    // all values are positive integers

    for (const instruction of instructions) {
        switch (instruction.action) {
            case "E":
                state.east += instruction.value
                break
            case "N":
                state.north += instruction.value
                break
            case "W":
                state.east -= instruction.value
                break
            case "S":
                state.north -= instruction.value
                break
            case "F":
                switch (state.direction) {
                    case "E":
                        state.east += instruction.value
                        break
                    case "N":
                        state.north += instruction.value
                        break
                    case "W":
                        state.east -= instruction.value
                        break
                    case "S":
                        state.north -= instruction.value
                        break
                }
                break
            case "R":
                let turningRight = instruction.value
                while (turningRight > 0) {
                    state = turnRight(state)
                    turningRight -= 90
                }
                break
            case "L":
                let turningLeft = instruction.value
                while (turningLeft > 0) {
                    state = turnLeft(state)
                    turningLeft -= 90
                }
                break
        }
    }

    // manhattan distance from (0, 0) to state
    const distance = Math.abs(state.east) + Math.abs(state.north)

    return distance
}

console.log(distance(parse(example)))
console.log(distance(parse(readFile("input12.txt"))))
