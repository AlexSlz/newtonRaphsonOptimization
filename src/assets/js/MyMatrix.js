import { inv } from 'mathjs'
export class Matrix {
    constructor(rows, cols, arr = []) {
        this.rows = rows
        this.cols = cols
        this.arr = arr
    }

    getData(row, col) {
        return this.arr[row * this.cols + col]
    }
    setData(row, col, value) {
        this.arr[row * this.cols + col] = value
    }

    mul(value) {
        let v = []
        for (let i = 0; i < this.rows; i++) {
            let sum = 0
            for (let j = 0; j < value.length; j++) {
                sum += this.getData(i, j) * value[j]
            }
            v.push(sum)
        }
        return v
    }


    inv() {
        let i = this.rows, j = this.cols
        let temp = this.arrToMatrix(2)
        let a = inv(temp)
        return new Matrix(i, j, this.matrixToArr(a))
    }

    arrToMatrix(elementsPerSubArray) {
        var matrix = [], i, k;
        for (i = 0, k = -1; i < this.arr.length; i++) {
            if (i % elementsPerSubArray === 0) {
                k++;
                matrix[k] = [];
            }

            matrix[k].push(this.arr[i]);
        }

        return matrix;
    }

    matrixToArr(list) {
        let arr = []
        list.forEach(item => {
            item.forEach(item2 => {
                arr.push(item2)
            })
        });

        return arr;
    }

    Swap(r1, r2) {
        if (r1 == r2) return
        let firstR1 = r1 * this.cols
        let firstR2 = r2 * this.cols
        for (let i = 0; i < this.cols; i++) {
            let tmp = this.arr[firstR1 + i];
            this.arr[firstR1 + i] = this.arr[firstR2 + i];
            this.arr[firstR2 + i] = tmp;
        }
    }

    //value - vector[]
    GaussElimWithPartialPivot(value) {
        for (let diag = 0; diag < this.rows; diag++) {
            let max_row = diag
            let max_val = Math.abs(this.getData(diag, diag))
            let d
            for (let row = diag + 1; row < this.rows; row++) {
                if ((d = Math.abs(this.getData(row, diag))) > max_val) {
                    max_row = row
                    max_val = d
                }
            }
            this.Swap(diag, max_row)
            let tempArr = value[diag];
            value[diag] = value[max_row];
            value[max_row] = tempArr;
            let invd = 1 / this.getData(diag, diag)
            for (let col = diag; col < this.cols; col++) {
                this.setData(diag, col, this.getData(diag, col) * invd)
            }
            value[diag] *= invd
            for (let row = 0; row < this.rows; row++) {
                d = this.getData(row, diag);
                if (row != diag) {
                    for (let col = diag; col < this.cols; col++) {
                        this.setData(row, col, this.getData(row, col) - d * this.getData(diag, col))
                    }
                    value[row] -= d * value[diag];
                }
            }
        }
    }

}