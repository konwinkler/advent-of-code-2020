import { readFileSync } from "fs";

const example = `
light red bags contain 1 bright white bag, 2 muted yellow bags.
dark orange bags contain 3 bright white bags, 4 muted yellow bags.
bright white bags contain 1 shiny gold bag.
muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.
shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.
dark olive bags contain 3 faded blue bags, 4 dotted black bags.
vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.
faded blue bags contain no other bags.
dotted black bags contain no other bags.
`;

function readFile(fileName) {
  return readFileSync(fileName, "utf8");
}

function parse(s) {
  const lines = s.split("\n").filter(e => e !== "")

  const rules = new Map()
  const reg = /(\w*\s\w*)\sbags?/g

  for(const line of lines) {
    let matches = reg.exec(line)
    const outer = matches[1]
    matches = reg.exec(line)
    const inner = []
    while(matches !== null) {
      const [_, bag] = matches
      inner.push(bag)
      matches = reg.exec(line)
    }
    rules.set(outer, inner)
  }
  return rules
}

function allOuterBags(rules, targets) {
  const oldTargetSize = targets.size
  // needs to be a breadth search
  for(const target of targets) {
    for (const outer of rules.keys()) {
      if (rules.get(outer).includes(target)) {
        targets.add(outer)
      }
    }
  }
  if(oldTargetSize === targets.size) {
    return targets.size - 1 // remove identity
  } else {
    return allOuterBags(rules, targets)
  }
}

(() => {
  console.log(allOuterBags(parse(example), new Set(["shiny gold"])));
  console.log(allOuterBags(parse(readFile("input7.txt")), new Set(["shiny gold"])))
})();
