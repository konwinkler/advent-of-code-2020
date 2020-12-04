import { readFileSync } from "fs";

const example = `
..##.......
#...#...#..
.#....#..#.
..#.#...#.#
.#...##..#.
..#.##.....
.#.#.#....#
.#........#
#.##...#...
#...##....#
.#..#...#.#
`;

function readFile(fileName) {
  return readFileSync(fileName, "utf8");
}

function parse(s) {
  const lines = s.split("\n").filter((l) => l !== "");
  // console.log(lines);
  return lines;
}

function trees(map, stepsRight, stepsDown) {
  let countTrees = 0;
  const width = map[0].length;
  for (let i = 1; i < map.length && (i * stepsDown < map.length); i++) {
    const down = i * stepsDown
    const right = (i * stepsRight) % width;
    const position = map[down][right];
    // console.log(`pos ${position} at ${down}, ${right}`)
    if (position === "#") {
      countTrees++;
    }
  }
  return countTrees;
}

function otherSlopes(map) {
  const counts = []
  counts.push(trees(map, 1, 1))
  counts.push(trees(map, 3, 1))
  counts.push(trees(map, 5, 1))
  counts.push(trees(map, 7, 1))
  counts.push(trees(map, 1, 2))
  return counts.reduce((total, e) => total * e, 1)
}

(() => {
  console.log(otherSlopes(parse(example)));
  console.log(otherSlopes(parse(readFile("input3.txt"))))
})();
