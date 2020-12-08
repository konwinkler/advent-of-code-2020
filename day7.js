import { readFileSync } from "fs";

const example = `
shiny gold bags contain 2 dark red bags.
dark red bags contain 2 dark orange bags.
dark orange bags contain 2 dark yellow bags.
dark yellow bags contain 2 dark green bags.
dark green bags contain 2 dark blue bags.
dark blue bags contain 2 dark violet bags.
dark violet bags contain no other bags.
`;

function readFile(fileName) {
  return readFileSync(fileName, "utf8");
}

function parse(s) {
  const lines = s.split("\n").filter(e => e !== "")

  const rules = new Map()
  const reg = /(\d*)?\s?(\w*\s\w*)\sbags?/g

  for(const line of lines) {
    let matches = reg.exec(line)
    const outer = matches[2]
    matches = reg.exec(line)
    const inner = new Map()
    while(matches !== null) {
      const [_, count, bag] = matches
      inner.set(bag, count ? count : 0)
      matches = reg.exec(line)
    }
    rules.set(outer, inner)
  }
  return rules
}

function howManyInside(rules, target) {
  if(target === "no other") {
    return 1
  }
  const allInner = rules.get(target)
  let total = 1
  for(const inner of allInner.keys()) {
    const innerCount = allInner.get(inner)
    const innerTotal = innerCount * howManyInside(rules, inner)
    total += innerTotal
  }
  // console.log(`${target} total ${total}`)
  return total
}

(() => {
  console.log(howManyInside(parse(example),"shiny gold") - 1)
  console.log(howManyInside(parse(readFile("input7.txt")), "shiny gold") - 1)
})();
