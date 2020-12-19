import {readFileSync} from "fs";

const readFile = (fileName) => {
    return readFileSync(fileName, "utf8");
}

/*
 * Expression structure
 * {
 *  value: number
 * }
 * {
 *  operator: '+'|'*'
 *  children: [Expression]
 * }
 */

function tokenizer(lines) {
    const all = []
    for (const line of lines) {
        const regex = /[\d+*()]/g
        let token = regex.exec(line)
        const tokens = []
        while (token) {
            let value = token[0]
            let type
            if (value === "(" || value === ")") {
                type = "separator"
            } else if (value === "*" || value === "+") {
                type = "operator"
            } else {
                type = "number"
                value = Number(value)
            }
            tokens.push({
                type,
                value
            })
            token = regex.exec(line)
        }
        all.push(tokens)
    }
    return all
}

function execute(tokens) {
    while (tokens.length > 1) {
        let newTokens
        let modified = false

        for (let i = tokens.length - 3; !modified && i >= 0; i--) {
            const [beginning, element, end] = tokens.slice(i)
            if (beginning.value === "(" && end.value === ")") {
                const result = {
                    type: "number",
                    value: element.value
                }
                const prefix = tokens.slice(0, i)
                const suffix = tokens.slice(i + 3)
                newTokens = [...prefix, result, ...suffix]
                modified = true
            }
        }

        for (let i = tokens.length - 3; !modified && i >= 0; i--) {
            let [first, second, third] = tokens.slice(i)
            if (first.type === "number" && second.type === "operator" && second.value === "+" && third.type === "number") {
                const result = {
                    type: "number",
                    value: first.value + third.value
                }
                const prefix = tokens.slice(0, i)
                const suffix = tokens.slice(i + 3)
                newTokens = [...prefix, result, ...suffix]
                modified = true
            }
        }

        for (let i = tokens.length - 3; !modified && i >= 0; i--) {
            let [first, second, third] = tokens.slice(i)
            if (first.type === "number" && second.type === "operator" && second.value === "*" && third.type === "number") {
                const result = {
                    type: "number",
                    value:  first.value * third.value
                }
                const prefix = tokens.slice(0, i)
                const suffix = tokens.slice(i + 3)
                newTokens = [...prefix, result, ...suffix]
                modified = true
            }
        }

        tokens = newTokens
    }
    return tokens
}

function parse(fileName) {
    const file = readFile(fileName)
    const lines = file.split("\n").filter(e => e !== "")
    const tokenizedLines = tokenizer(lines)

    const results = []
    for (const tokens of tokenizedLines) {
        results.push(execute(tokens))
    }
    console.log(results.flat().map(e => e.value))

    return results.flat().map(e => e.value).reduce((sum, e) => sum + e, 0);
}

console.log(parse("example18.txt"))
