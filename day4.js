import { readFileSync } from "fs";

const example = `
eyr:1972 cid:100
hcl:#18171d ecl:amb hgt:170 pid:186cm iyr:2018 byr:1926

iyr:2019
hcl:#602927 eyr:1967 hgt:170cm
ecl:grn pid:012533040 byr:1946

hcl:dab227 iyr:2012
ecl:brn hgt:182cm pid:021572410 eyr:2020 byr:1992 cid:277

hgt:59cm ecl:zzz
eyr:2038 hcl:74454a iyr:2023
pid:3556412378 byr:2007

pid:087499704 hgt:74in ecl:grn iyr:2012 eyr:2030 byr:1980
hcl:#623a2f

eyr:2029 ecl:blu cid:129 byr:1989
iyr:2014 pid:896056539 hcl:#a97842 hgt:165cm

hcl:#888785
hgt:164cm byr:2001 iyr:2015 cid:88
pid:545766238 ecl:hzl
eyr:2022

iyr:2010 hgt:158cm hcl:#b6652a ecl:blu byr:1944 eyr:2021 pid:093154719
`;

function readFile(fileName) {
  return readFileSync(fileName, "utf8");
}

function getField(data, regex) {
  const matches = regex.exec(data)
  if(matches !== null) {
    return matches[1]
  } else {
    console.log(`could not find ${regex} in ${data}\n`)
    return undefined
  }
}

function parse(s) {
  const dataFields = s.split("\n\n");
  const passports = []
  for(const dataField of dataFields) {
    passports.push({
      byr: getField(dataField, /byr:([0-9]{4})/g),
      iyr: getField(dataField, /iyr:([0-9]{4})/g),
      eyr: getField(dataField, /eyr:([0-9]{4})/g),
      hcl: getField(dataField, /hcl:(#[0-9a-f]{6})/g),
      ecl: getField(dataField, /ecl:(amb|blu|brn|gry|grn|hzl|oth)/g),
      pid: getField(dataField, /pid:([0-9]{9})/g),
      hgt: getField(dataField, /hgt:([0-9]+(cm|in))/g),
      // cid: getField(dataField, /cid:([0-9]+)/g),
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
        // console.log(`height ${height}`)
        if(passport.hgt.includes("cm") && (height < 150 || height > 193)) {
          valid = false
          reason = `height (cm) not valid ${height}`
          break
        } else if(passport.hgt.includes("in") && (height < 59 || height > 76)) {
          valid = false
          reason = `height (in) not valid ${height}`
          break
        }
        if(!passport.hgt.includes("cm") && !passport.hgt.includes("in")) {
          throw Error(`what is ${passport.hgt}`)
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
      // console.log(`valid ${JSON.stringify(passport)}`)
      count++
    } else {
      // console.log(`${reason} in ${JSON.stringify((passport))}`)
    }
  }
  return count
}


(() => {
  console.log(validPassports(parse(example)));
  console.log(validPassports(parse(readFile("input4.txt"))))
})();
