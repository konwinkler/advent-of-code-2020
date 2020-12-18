import {readFileSync} from "fs";

const readFile = (fileName) => {
    return readFileSync(fileName, "utf8");
}

/* Cube structure
 * {
 *  x, y, z
 * }
 */


function encode(cube) {
    return JSON.stringify(cube);
}

function decode(s) {
    return JSON.parse(s)
}

function parse(file) {
    const lines = readFile(file).split("\n").filter(e => e !== "");
    const initialCubes = []
    for (const [x, line] of lines.entries()) {
        for (const [y, char] of line.split("").entries()) {
            if (char === "#") {
                initialCubes.push(encode({
                    x,
                    y,
                    z: 0
                }))
            }
        }
    }
    return initialCubes;
}

function findNeighbors(cube) {
    const neighbors = []
    for (let x = -1; x < 2; x++) {
        for (let y = -1; y < 2; y++) {
            for (let z = -1; z < 2; z++) {
                if (x !== 0 || y !== 0 || z !== 0) {
                    neighbors.push({
                        x: cube.x + x,
                        y: cube.y + y,
                        z: cube.z + z,
                    })
                }
            }
        }
    }
    return neighbors;
}

// If a cube is active and exactly 2 or 3 of its neighbors are also active, the cube remains active. Otherwise, the cube becomes inactive.
// If a cube is inactive but exactly 3 of its neighbors are active, the cube becomes active. Otherwise, the cube remains inactive.
function applyRules(cube, active, map) {
    let countActive = 0
    for (const neighbor of findNeighbors(cube)) {
        const neighborActive = map.includes(encode(neighbor))
        if (neighborActive) {
            countActive++
        }
    }
    if (active) {
        if (countActive > 1 && countActive < 4) {
            return true
        }
    } else {
        if (countActive === 3) {
            return true
        }
    }
    return false
}

function countActiveCubes(initialCubes, numberOfCycles) {
    let currentMap = initialCubes
    for (let cycle = 0; cycle < numberOfCycles; cycle++) {
        let nextMap = []
        const lookedAtCubes = []
        for (const cubeString of currentMap) {
            // look at all neighbors of the cube
            let allCubes = findNeighbors(decode(cubeString));
            for (const cube of allCubes) {
                if (lookedAtCubes.includes(encode(cube))) {
                    continue
                }
                const currentlyActive = currentMap.includes(encode(cube))
                const futureActive = applyRules(cube, currentlyActive, currentMap)
                if (futureActive) {
                    nextMap.push(encode(cube))
                }
                lookedAtCubes.push(encode(cube))
            }
        }


        currentMap = nextMap
    }
    return currentMap.length
}

console.log(countActiveCubes(parse("example17.txt"), 6))
console.log(countActiveCubes(parse("input17.txt"), 6))
