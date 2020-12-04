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

function trees(map) {
  let countTrees = 0;
  const width = map[0].length;
  for (let down = 1; down < map.length; down++) {
    const right = (down * 3) % width;
    const position = map[down][right];
    // console.log(`pos ${position} at ${down}, ${right}`)
    if (position === "#") {
      countTrees++;
    }
  }
  return countTrees;
}

(() => {
  console.log(trees(parse(example)));
  console.log(trees(parse(readFile("input3.txt"))))
})();
