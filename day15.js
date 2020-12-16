function timeBetweenSpoken(sequence, last) {
    // return if sequence contains only 1 element of last
    let pointer = sequence.length - 2
    let time = 1
    while(pointer >= 0) {
        const current = sequence[pointer]
        if(current === last) {
            return time
        }
        time++
        pointer--
    }

    return 0
}

function numberAt(input, target) {
    const sequence = input.split(",").map(Number)

    let spoken = [...sequence]
    let turn = 1 + spoken.length
    while (turn <= target) {
        const lastSpoken = spoken[spoken.length - 1]
        const time = timeBetweenSpoken(spoken, lastSpoken)
        spoken.push(time)
        turn++
    }
    return spoken[spoken.length - 1]
}

console.log(numberAt("0,3,6", 2020))
console.log(numberAt("1,3,2", 2020))
console.log(numberAt("2,1,3", 2020))
console.log(numberAt("1,2,3", 2020))
console.log(numberAt("2,3,1", 2020))
console.log(numberAt("3,2,1", 2020))
console.log(numberAt("3,1,2", 2020))
console.log(numberAt("0,13,1,8,6,15", 2020))
