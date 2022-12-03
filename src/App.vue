<script setup>
import MyInput from './components/MyInput.vue'
import MyTable from './components/MyTable.vue'
import MyCanvas from './components/MyCanvas.vue'
import History from './components/History.vue'
import { newtonRaphson } from './assets/js/newtonRaphson.js'
</script>

<style scoped>
.calc {
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}
.alert {
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-bottom: 20px;
  position: relative;
  font-size: 21px;
  background-color: #1a1a1a;
}
p {
  white-space: pre-wrap;
}
</style>

<template>
  <History ref="history" @ClickOnElement="loadFunc" />

  <div class="calc">
    <select v-model="mathTypeSelect">
      <option v-for="item in mathType">{{ item }}</option>
    </select>

    <MyInput ref="myInput" :mathTypeSelect="mathTypeSelect" />
    <label>Decimal</label>
    <input type="number" v-model="decimal" />
    <label>Delta</label>
    <input type="number" v-model="delta" />
    <button @click="Calculate()">Calculate</button>
  </div>

  <div v-if="alert != ''" class="alert">
    <p>{{ alert }}</p>
  </div>
  <template v-if="Result != null">
    <MyTable :Result="Result" :xList="myFunction.xList" />
  </template>
  <MyCanvas :limit="limit" ref="mycanvas" />
</template>

<script>
export default {
  data() {
    return {
      mathType: ['Optimization', 'Root Finder'],
      mathTypeSelect: 'Root Finder',
      delta: 0.1,
      decimal: 4,
      myFunction: null,
      Result: null,
      limit: {},
      alert: '',
    }
  },
  methods: {
    loadFunc(funcId) {
      this.mathTypeSelect = this.$refs.history.funcList[funcId].type
      this.$refs.myInput.myFunction.funcText =
        this.$refs.history.funcList[funcId].funcText
      this.$refs.myInput.findX()
    },
    updateChart(Result) {
      const getNumber = (arr, searchNumer) =>
        arr.find(
          (it) =>
            Math.abs(it.x - searchNumer) ===
            Math.min(...arr.map((it) => Math.abs(it.x - searchNumer)))
        )

      let customResult = this.getDataWithoutJson(Result)
      let xName = this.myFunction.xList.map((item) => item.name)
      let manyFpoint = []
      let templates = []
      this.myFunction.fPoints.forEach((point, index) => {
        let fTemplate = this.$refs.mycanvas.getFLineTemplate(
          point,
          `${this.getRandomColor()}`,
          xName[index]
        )
        point.forEach((item) => {
          manyFpoint.push(item)
        })
        templates.push(fTemplate)
      })

      let keys = []
      Object.keys(Result[0]).map((key) => {
        keys.push(key)
      })

      let a = []
      keys.forEach((key) => {
        let temp = []
        Result.forEach((item) => {
          let sel = getNumber(manyFpoint, item[key])
          if (sel.y > 0.05 || sel.y < -0.05) {
            temp.push({ x: item[key], y: sel.y })
          }
          temp.push({ x: item[key], y: 0 })
          temp.push('-')
        })
        a.push(temp)
      })

      a.forEach((point, i) => {
        let nTemplate = this.$refs.mycanvas.getNewtonTemplate(
          keys[i],
          point,
          this.getRandomColor()
        )
        templates.push(nTemplate)
      })

      let zero = customResult[customResult.length - 1][0]
      this.$refs.mycanvas.updateChart(templates, this.limit, zero)
    },
    getRandomColor() {
      const randomNum = () => Math.floor(Math.random() * (235 - 52 + 1) + 52)
      return `rgb(${randomNum()}, ${randomNum()}, ${randomNum()})`
    },
    Calculate() {
      this.resetAll()
      let funcText = this.myFunction.funcText
        .split('\n')
        .filter((element) => element !== '')
      let xName = this.myFunction.xList.map((item) => item.name)

      if (xName.length < 1) {
        this.alert = 'Zero of unknown X'
        return
      }

      let method = new newtonRaphson(xName, this.delta, this.decimal)
      let tempResult = []
      if (this.mathTypeSelect == 'Optimization') {
        tempResult = method.NewtonRaphsonOtimization(
          this.myFunction.funcRange.min,
          this.myFunction.funcRange.max,
          this.myFunction.funcText
        )
      } else if (this.mathTypeSelect == 'Root Finder') {
        let xValue = this.myFunction.xList.map((item) => item.value)
        if (funcText.length == 1) {
          tempResult = method.CalculateMethodSingle(xValue[0], funcText[0])
        } else if (funcText.length > 1) {
          tempResult = method.CalculateMethodMultiple(xValue, funcText)
        }
      }

      if ('err' in tempResult) {
        this.alert = tempResult.err
        return
      }

      let find = this.$refs.history.funcList.find(
        (item) => item.funcText == this.myFunction.funcText.trim()
      )
      if (find == null)
        this.$refs.history.funcList.push({
          type: this.mathTypeSelect,
          funcText: this.myFunction.funcText,
        })

      this.Result = tempResult.result
      this.alert = tempResult.dFunc
      this.$refs.myInput.myFunction.dFunc = tempResult.dFunc
      this.UpdateLimit(method, tempResult.result)
      this.GetFpoints(method, tempResult.result)
      console.log(this.myFunction)
      this.updateChart(tempResult.result)
    },
    GetFpoints(method, Result) {
      let customResult = this.getDataWithoutJson(Result)
      let funcText = this.myFunction.funcText.split('\n')
      let zero = customResult[customResult.length - 1]
      let temp = []
      funcText.forEach((item) => {
        temp.push(
          method.getFuncPoints(
            item,
            this.limit.minX,
            this.limit.maxX,
            zero,
            Result[Result.length - 1]
          )
        )
      })
      this.$refs.myInput.myFunction.fPoints = temp
    },
    UpdateLimit(method, Result) {
      let temp = []

      let funcText = this.myFunction.funcText.split('\n')

      funcText.forEach((func) => {
        Result.forEach((item) => {
          temp.push(
            method.calcFunc(
              func,
              Object.keys(item).map(function (key) {
                return item[key]
              })
            )
          )
        })
      })

      let customResult = this.getDataWithoutJson(Result)

      let maxY = Math.ceil(Math.max.apply(Math, temp))
      let minY = Math.ceil(Math.min.apply(Math, temp))
      let minX = Math.ceil(Math.min.apply(Math, customResult))
      let maxX = Math.ceil(Math.max.apply(Math, customResult))

      let zero = customResult[customResult.length - 1]
      if (maxX < 1) maxX = 1

      if (maxX > maxX + zero) maxX = maxX - zero

      if (minX > -1) minX = -1

      if (minX < minX + zero) minX = minX - zero

      if (maxY < 2) maxY = 2

      if (minY > -2) minY = -2

      this.limit = { maxY, minY, minX, maxX }
    },

    getDataWithoutJson(Result) {
      let temp = []
      Result.forEach((item) => {
        Object.keys(item)
          .map(function (key) {
            return item[key]
          })
          .forEach((i) => {
            temp.push(i)
          })
      })
      return temp
    },
    resetAll() {
      this.alert = ''
      this.Result = null
      this.limit = {}
      this.$refs.mycanvas.clearChart()

      if (this.decimal > 15) this.decimal = 15
      if (
        this.decimal < 1 ||
        this.decimal == '' ||
        !Number.isInteger(this.decimal)
      )
        this.decimal = 1
      if (this.delta == 0 || this.delta == '' || this.delta <= -1)
        this.delta = 0.1
    },
  },
  mounted() {
    this.myFunction = this.$refs.myInput.myFunction
    console.log(this.$refs)
  },
}
</script>
