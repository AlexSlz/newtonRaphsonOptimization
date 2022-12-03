import { derivative, evaluate } from "mathjs";
import nerdamer from "nerdamer"
import Calculus from "nerdamer/Calculus";

function FindDerivative(func) {
    try {
        let temp = nerdamer.getCore().Calculus.diff(nerdamer(func).symbol).text()
        return temp
    } catch (error) {
        console.log(error)
        return undefined
    }
}

// function FindMultipleDerivative(func, xName) {
//     let symbols = [
//         ...func.matchAll(
//             '(?<![a-zA-Z])[a-zA-Z](?![a-zA-Z])'
//         ),
//     ]
//     symbols = [...new Set(symbols.map((item) => item[0]))]
//     let result = []
//     xName.forEach(x => {
//         result.push(nerdamer.getCore().Calculus.diff(nerdamer(func).symbol, x).text())
//     });

//     result = result.filter(function (e) { return e !== '0' })
//     return result
// }

function FindMultipleDerivative(func, xName) {
    let symbols = [
        ...func.matchAll(
            '(?<![a-zA-Z])[a-zA-Z](?![a-zA-Z])'
        ),
    ]
    symbols = [...new Set(symbols.map((item) => item[0]))]
    let result = []
    xName.forEach(x => {
        let tempDf = ''

        try {
            tempDf = derivative(func, x).toString().replace(/\s/g, '')
        } catch (error) {
            return undefined
        }

        result.push(tempDf)
    });

    result = result.filter(function (e) { return e !== '0' })
    return result
}


function CalculateFunction(func, x, xName = '') {
    if (Array.isArray(x) && x.length > 1) {
        let g = '{'
        for (let i = 0; i < xName.length; i++) {
            g += `"${xName[i]}":${x[i]},`
        }
        g = g.slice(0, -1) + '}'

        x = JSON.parse(g)
    } else {
        x = JSON.parse(`{"${xName}": ${x}}`)
    }

    let i = 1
    var f = ''
    try {
        f = evaluate(func, x)
    } catch (error) {
        return undefined
    }

    //var f = eval(nerdamer(func).evaluate(x).toString())
    if (f === undefined)
        return undefined
    return f.toString()
}
export default {
    FindDerivative, FindMultipleDerivative, CalculateFunction
}