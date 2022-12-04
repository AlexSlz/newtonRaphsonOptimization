import funcManipulation from "./funcManipulation.js"

import { inv, matrix, multiply, round, sec, subtract } from 'mathjs'

let badFunction = "Bad Function"
let nanOrundef = "The result is Nan Or Undefined"

export class newtonRaphson {

    constructor(xName, delta, decimal) {
        this.xName = xName
        this.delta = delta
        this.decimal = decimal
        this.maxIteration = 32
    }

    NewtonRaphsonOtimization(min, max, func) {
        let dFunc = funcManipulation.FindDerivative(func)
        let dFunc2 = funcManipulation.FindDerivative(dFunc)

        if (dFunc2.length <= 1)
            dFunc = func

        let callFunc = (startX) => {
            let temp = this.CalculateMethodSingle(startX, dFunc)
            let res = []

            if ('err' in temp) {
                return temp
            }
            temp.result.forEach(item => {
                Object.keys(item).map(function (key) {
                    res.push(item[key])
                })
            })
            return res
        }

        let tempResult = []

        let name = ['max', 'min']
        tempResult.push(callFunc(min))
        tempResult.push(callFunc(max))

        if ('err' in tempResult[0]) {
            return tempResult[0]
        }


        let temp = []
        let maxlength = 0
        tempResult.map((item) => {
            if (maxlength < item.length) maxlength = item.length
        })


        let a = true
        let tempIndex = 0
        for (let i = 0; i < maxlength; i++) {
            let second = []
            for (let t = 0; t < tempResult.length; t++) {
                if ((tempResult[t][i] == undefined) && a) {
                    tempIndex = i - 1
                    a = false
                }

                second[name[t]] = (tempResult[t][i] == undefined) ? tempResult[t][tempIndex] : tempResult[t][i]
            }
            temp.push(second)
        }

        let tempDf = `The first derivative of the functions: ${dFunc}\nThe second derivative of the functions: ${dFunc2}`
        return { result: temp, dFunc: tempDf }
    }

    CalculateMethodSingle(startX, func) {
        let temp = []
        temp[this.xName[0]] = startX
        let x0 = startX
        let result = []
        result.push(temp)

        let dFunc = funcManipulation.FindDerivative(func)

        if (dFunc == undefined) { return { err: badFunction } }
        let x1 = x0
        let err = 1
        let iter = 0
        while (err > this.delta && iter < this.maxIteration) {
            console.log(x0)
            x1 = x0 - funcManipulation.CalculateFunction(func, x0, this.xName) / funcManipulation.CalculateFunction(dFunc, x0, this.xName)
            x1 = round(x1, this.decimal)

            if (isNaN(x1) || x1 == undefined) {
                return { err: nanOrundef }
            }
            err = Math.abs(x0 - x1)

            let temp = []
            temp[this.xName[0]] = x1

            result.push(temp)


            x0 = x1
            iter++
        }

        if (iter >= this.maxIteration)
            return { err: badFunction }

        return { result: result, dFunc: `Derivative of functions: ${dFunc}` }
    }

    CalculateMethodMultiple(startX, func) {
        let result = []
        let dF = []
        func.forEach(item => dF.push(funcManipulation.FindMultipleDerivative(item, this.xName)))

        let errO = false
        dF.forEach(item => {
            if (item.length < 1) {
                errO = true
                return
            }
        })

        if (errO)
            return { err: badFunction }

        let x0 = []
        let x1 = []
        let temp = []
        startX.forEach((item, i) => {
            x0.push(item)
            x1.push(item)
            temp[this.xName[i]] = item
        })
        result.push(temp)
        //let J = new Matrix(2, 2)
        //let delta = +`1e-${this.decimal - 1}`
        let iter = 0
        let err = this.norm(x1)
        while (err > this.delta && iter < this.maxIteration) {
            //Init x1
            for (let i = 0; i < func.length; i++) {
                x1[i] = funcManipulation.CalculateFunction(func[i], x0, this.xName)
            }

            x1.forEach(element => {
                if (isNaN(element) || element == undefined)
                    return { err: nanOrundef }
            });
            let tempJ = []
            //Init matrix jacobian
            for (let i = 0; i < dF.length; i++) {
                let t = []
                for (let j = 0; j < dF[i].length; j++) {
                    let a = funcManipulation.CalculateFunction(dF[i][j], x0, this.xName)

                    t.push(round(a, this.decimal))
                }
                tempJ.push(t)
            }

            for (let i = 0; i < tempJ.length - 1; i++) {
                if (tempJ[i].length != tempJ[i + i].length)
                    return { err: badFunction }
            }

            let J = matrix(tempJ)

            let mult = multiply(inv(J), matrix(x1))

            x0 = subtract(x0, mult).toArray()

            //Init matrix jacobian
            // for (let i = 0; i < dF.length; i++) {
            //     for (let j = 0; j < dF.length; j++) {
            //         J.setData(i, j, funcManipulation.CalculateFunction(dF[i][j], x0, this.xName))
            //     }
            // }
            //gaussian elimination with partial pivoting and newton Rapgson
            // J.GaussElimWithPartialPivot(x1)
            // for (let i = 0; i < x0.length; i++) {
            //     x0[i] -= x1[i]
            // }

            //sum magnitudes
            err = this.norm(x1)
            console.log(err)
            let temp = []
            x0.forEach((x, i) => {
                let key = this.xName[i]
                temp[key] = round(x, this.decimal)
            })
            result.push(temp)
            iter++
        }
        if (iter >= this.maxIteration)
            return { err: "bad function" }

        let tempDf = 'Derivative of functions:\n'
        dF.forEach(item => {
            item.forEach(i => {
                tempDf += `| ${i} `
            })
            tempDf += "| \n"
        })
        return { result: result, dFunc: tempDf }
    }

    norm(value) {
        let sum = 0;
        for (let i = 0; i < value.length; i++) {
            let d = value[i];
            sum += d * d;
        }
        return Math.sqrt(sum);
    }

    getFuncPoints(func, xMin, xMax, root, xV) {
        let funcPoint = []

        for (let i = xMin; i < xMax; i = i + 0.1) {
            let xVal = root + i
            let xValue = []
            Object.keys(xV).map((key) => {
                xValue.push(xV[key] + i)
            })

            let yVal = funcManipulation.CalculateFunction(func, xValue, this.xName)
            funcPoint.push({ x: xVal, y: yVal })

        }
        return funcPoint;
    }

    calcFunc(func, x) {
        let res = funcManipulation.CalculateFunction(func, x, this.xName)
        return res
    }

}

