function numberAt(input, target) {
    const spoken = new Map()
    let lastSpoken = undefined
    const sequence = input.split(",").map(Number)

    let turn = 1

    while(sequence.length > 0) {
        if (lastSpoken !== undefined) {
            spoken.set(lastSpoken, turn - 1)
        }
        lastSpoken = sequence.shift()
        turn++
    }

    while (turn <= target) {
        const time = spoken.has(lastSpoken) ? turn - 1 - spoken.get(lastSpoken) : 0
        spoken.set(lastSpoken, turn - 1)
        lastSpoken = time
        turn++
    }
    return lastSpoken
}

console.log(numberAt("0,3,6", 30000000))
console.log(numberAt("1,3,2", 30000000))
console.log(numberAt("2,1,3", 30000000))
console.log(numberAt("1,2,3", 30000000))
console.log(numberAt("2,3,1", 30000000))
console.log(numberAt("3,2,1", 30000000))
console.log(numberAt("3,1,2", 30000000))
console.log(numberAt("0,13,1,8,6,15", 30000000))
