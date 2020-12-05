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
      // console.log(`could not find ${regex} in ${data}\n`)
    }
    return undefined
  }
}

function parse(s) {
  const dataFields = s.split("\n\n");
  const passports = []
  for(const dataField of dataFields) {
    passports.push({
      pid: getField(dataField, /pid:([0-9]{9})/g),
      cid: getField(dataField, /cid:([0-9]+)/g),
      iyr: getField(dataField, /iyr:([0-9]{4})/g),
      eyr: getField(dataField, /eyr:([0-9]{4})/g),
      byr: getField(dataField, /byr:([0-9]{4})/g),
      hcl: getField(dataField, /hcl:((#[0-9a-f]{6}|\w))/g),
      ecl: getField(dataField, /ecl:(amb|blu|brn|gry|grn|hzl|oth)/g),
      hgt: getField(dataField, /hgt:([0-9]+(cm|in))/g), //TODO
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
  let reason = ""
  for(const passport of passports) {
    let valid = true
    for(const requiredField of requiredFields) {
      if(passport[requiredField] === undefined) {
        valid = false
        reason = "required fields missing " + requiredField
        break
      }
      if(requiredField === 'hgt') {
        const height = parseInt(passport.hgt.match(/\d*/g))
        if(passport.hgt.includes("cm") && (height < 150 || height > 193)) {
          valid = false
          reason = `height (cm) not valid ${height}`
          break
        }
        if(passport.hgt.includes("in") && (height < 59 || height > 76)) {
          valid = false
          reason = `height (in) not valid ${height}`
          break
        }
      }
      if(requiredField === "eyr" ) {
        const year = parseInt(passport.eyr)
        if(year < 2020 || year > 2030) {
          valid = false
          reason = `eyr not valid ${year}`
          break
        }
      }
      if(requiredField === "iyr" ) {
        const year = parseInt(passport.iyr)
        if(year < 2010 || year > 2020) {
          valid = false
          reason = `iyr not valid ${year}`
          break
        }
      }
      if(requiredField === "byr" ) {
        const year = parseInt(passport.byr)
        if(year < 1920 || year > 2002) {
          valid = false
          reason = `byr not valid ${year}`
          break
        }
      }
    }
    if(valid) {
      // console.log(`found a valid one`)
      count++
    } else {
      console.log(`${reason} in ${JSON.stringify((passport))}`)
    }
  }
  return count
}


(() => {
  console.log(validPassports(parse(example)));
  console.log(validPassports(parse(readFile("input4.txt"))))
})();
