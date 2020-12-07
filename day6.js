import { readFileSync } from "fs";

const example = `
abc

a
b
c

ab
ac

a
a
a
a

b
`;

function readFile(fileName) {
  return readFileSync(fileName, "utf8");
}

function parse(s) {
  const groups = s.split("\n\n").filter(e => e !== "")
  const data = []
  for(const group of groups) {
    const groupData = []
    const people = group.split("\n").filter(e => e !== "")
    for(const person of people) {
      groupData.push(person)
    }
    data.push(groupData)
  }
  return data
}

function countEveryone(group) {
  const answers = new Map()
  for(const person of group) {
    for(const question of person) {
      if(answers.has(question)) {
        answers.set(question, answers.get(question) + 1)
      } else {
        answers.set(question, 1)
      }
    }
  }

  let count = 0
  for(const answer of answers.keys()) {
    if(answers.get(answer) === group.length) {
      count++
    }
  }
  return count
}

function combinedAnswers(data) {
  return data.map(group => countEveryone(group))
      .reduce((sum, count) => sum + count, 0)
}

(() => {
  console.log(combinedAnswers(parse(example)));
  console.log(combinedAnswers(parse(readFile("input6.txt"))))
})();
