import {readFileSync} from "fs";

const readFile = (fileName) => {
    return readFileSync(fileName, "utf8");
}


/*
 * Types
 *
 * Message: string
 * Rule: {
 *  id: string,
 *  subRules: [SubRule]
 * }
 * SubRule: [Elements]
 * Elements: {
 *   type: "value"|"reference"
 *   value: string
 * }
 */

function parse(file) {
    const [rawRules, rawMessages] = file.split(("\n\n"))

    const textRules = rawRules.split("\n").filter(r => r !== "")
    const rules = []
    for (const textRule of textRules) {
        const elements = textRule.split(" ")
        // console.log(elements)
        const id = elements[0].split(":")[0]
        const rule = {
            id,
            subRules: []
        }
        const tail = elements.slice(1)
        let subRule = []
        for (const element of tail) {
            if (element === "|") {
                rule.subRules.push(subRule)
                subRule = []
            } else if (/\d+/g.exec(element)) {
                // element is a reference
                subRule.push({
                    type: "reference",
                    value: element
                })
            } else {
                // element is a value
                // TODO: trim out the quotation marks
                const value = /"(\w+)"/g.exec(element)[1]
                subRule.push({
                    type: "value",
                    value
                })
            }
        }
        rule.subRules.push(subRule)
        rules.push(rule)
    }
    // console.log(rules)

    const messages = rawMessages.split("\n").filter(m => m !== "")
    // console.log(messages)
    return {
        rules,
        messages
    }
}

function findRuleIndex(rules, id) {
    return rules.map(rule => rule.id).indexOf(id)
}

function matches(message, rules, ruleIndex) {
    // does message match one of the subrules of the index rule
    const rule = rules[ruleIndex]
    for (const subRule of rule.subRules) {
        let matchesAllElements = true
        let messageIndex = 0
        let matchedChars = 0
        for (const element of subRule) {
            switch (element.type) {
                case "value":
                    if (message[messageIndex] !== element.value) {
                        matchesAllElements = false
                    } else {
                        messageIndex++
                    }
                    break
                case "reference":
                    const messageTail = message.slice(messageIndex)
                    const ruleReference = findRuleIndex(rules, element.value)
                    const {matched: matchedTail, matchedChars: matchedTailChars} = matches(messageTail, rules, ruleReference)
                    matchedChars = matchedTailChars
                    if (!matchedTail) {
                        matchesAllElements = false
                    }
                    break
            }
            if (!matchesAllElements) {
                break
            }
            messageIndex += matchedChars
        }
        if (matchesAllElements) {
            return {
                matched: true,
                matchedChars: messageIndex
            }
        }
    }
    return {
        matched: false,
        matchedChars: 0
    }
}

function countMatchingMessages(fileName) {
    const file = readFile(fileName)
    const {rules, messages} = parse(file)

    let matchedMessages = 0
    for (const message of messages) {
        const {matched, matchedChars} = matches(message, rules, findRuleIndex(rules, "0"))
        if(matched && matchedChars === message.length) {
            console.log(`matched ${message}`)
            matchedMessages++
        } else {
            console.log(`Could not match ${message}`)
        }
    }

    return matchedMessages;
}

console.log(countMatchingMessages("input19.txt"))
