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

const rotateLeft = (waypoint) => {
    const newWaypoint = {...waypoint}
    newWaypoint.north = waypoint.east
    newWaypoint.east = -waypoint.north
    return newWaypoint
}

const rotateRight = (waypoint) => {
    const newWaypoint = {...waypoint}
    newWaypoint.east = waypoint.north
    newWaypoint.north = -waypoint.east
    return newWaypoint
}

/*
Action N means to move the waypoint north by the given value.
Action S means to move the waypoint south by the given value.
Action E means to move the waypoint east by the given value.
Action W means to move the waypoint west by the given value.
Action L means to rotate the waypoint around the ship left (counter-clockwise) the given number of degrees.
Action R means to rotate the waypoint around the ship right (clockwise) the given number of degrees.
Action F means to move forward to the waypoint a number of times equal to the given value.
The waypoint starts 10 units east and 1 unit north relative to the ship. The waypoint is relative to the ship; that is, if the ship moves, the waypoint moves with it.
 */

const distance = (instructions) => {
    let ship = {
        east: 0,
        north: 0
    }
    let waypoint = {
        east: 10,
        north: 1
    }

    // all values are positive integers

    for (const instruction of instructions) {
        switch (instruction.action) {
            case "E":
                waypoint.east += instruction.value
                break
            case "N":
                waypoint.north += instruction.value
                break
            case "W":
                waypoint.east -= instruction.value
                break
            case "S":
                waypoint.north -= instruction.value
                break
            case "F":
                for (let i = 0; i < instruction.value; i++) {
                    ship.east += waypoint.east
                    ship.north += waypoint.north
                }
                break
            case "R":
                let turningRight = instruction.value
                while (turningRight > 0) {
                    waypoint = rotateRight(waypoint)
                    turningRight -= 90
                }
                break
            case "L":
                let turningLeft = instruction.value
                while (turningLeft > 0) {
                    waypoint = rotateLeft(waypoint)
                    turningLeft -= 90
                }
                break
        }
    }

    // manhattan distance from (0, 0) to state
    const distance = Math.abs(ship.east) + Math.abs(ship.north)

    return distance
}

console.log(distance(parse(example)))
console.log(distance(parse(readFile("input12.txt"))))
