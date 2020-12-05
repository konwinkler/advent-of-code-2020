import { readFileSync } from "fs";

const example = `
ecl:gry pid:860033327 eyr:2020 hcl:#fffffd
byr:1937 iyr:2017 cid:147 hgt:183cm

iyr:2013 ecl:amb cid:350 eyr:2023 pid:028048884
hcl:#cfa07d byr:1929

hcl:#ae17e1 iyr:2013
eyr:2024
ecl:brn pid:760753108 byr:1931
hgt:179cm

hcl:#cfa07d eyr:2025 pid:166559648
iyr:2011 ecl:brn hgt:59in
`;

function readFile(fileName) {
  return readFileSync(fileName, "utf8");
}

function getField(data, regex) {
  const matches = regex.exec(data)
  if(matches !== null) {
    return matches[1]
  } else {
    if(!regex.exec("cid:123")) {
      console.log(`could not find ${regex} in ${data}\n`)
    }
    return undefined
  }
}

function parse(s) {
  const dataFields = s.split("\n\n");
  const passports = []
  for(const dataField of dataFields) {
    passports.push({
      pid: getField(dataField, /pid:(#?[0-9]+)/g),
      cid: getField(dataField, /cid:([0-9]+)/g),
      iyr: getField(dataField, /iyr:([0-9]+)/g),
      eyr: getField(dataField, /eyr:([0-9]+)/g),
      byr: getField(dataField, /byr:([0-9]+)/g),
      hcl: getField(dataField, /hcl:((#[0-9a-g]+|\w))/g),
      ecl: getField(dataField, /ecl:((#[0-9a-g]+|\w))/g),
      hgt: getField(dataField, /hgt:([0-9]+(cm|in)?)/g),
    })
  }
  return passports;
}

function validPassports(passports) {
  console.log(`looking at ${passports.length} passports`)
  const requiredFields = [
      "byr",
      "iyr",
      "eyr",
      "hgt",
      "hcl",
      "ecl",
      "pid"
  ]

  let count = 0
  for(const passport of passports) {
    let valid = true
    for(const requiredField of requiredFields) {
      if(passport[requiredField] === undefined) {
        console.log(`${requiredField} is missing in ${JSON.stringify(passport)}`)
        valid = false
        break
      }
    }
    if(valid) {
      // console.log(`found a valid one`)
      count++
    }
  }
  return count
}


(() => {
  console.log(validPassports(parse(example)));
  console.log(validPassports(parse(readFile("input4.txt"))))
})();
