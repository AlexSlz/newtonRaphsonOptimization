<template>
  <div v-if="mathTypeSelect == 'Root Finder'">
    <textarea v-model="myFunction.funcText" @input="findX()"></textarea>
    <RootFinding :xList="myFunction.xList" />
  </div>

  <div v-else-if="mathTypeSelect == 'Optimization'">
    <input v-model="myFunction.funcText" @input="findX()" />
    <Optimization :funcRange="myFunction.funcRange" />
  </div>
</template>

<script>
import Optimization from './Optimization.vue'
import RootFinding from './RootFinding.vue'

export default {
  components: {
    Optimization,
    RootFinding,
  },
  props: {
    mathTypeSelect: String,
  },
  data: () => ({
    counter: 0,
    myFunction: {
      funcText: '3x^3-10x^2-56x+5', //'3x^3-10x^2-56x+5',
      funcRange: { min: -4, max: 6 },
      xList: [{ name: 'x', value: 2 }],
      dFunc: [],
      fPoints: [],
    },
  }),
  methods: {
    findX() {
      let result = [
        ...this.myFunction.funcText.matchAll(
          '(?<![a-zA-Z])[a-zA-Z](?![a-zA-Z])'
        ),
      ]
      result = [...new Set(result.map((item) => item[0]))]
      this.myFunction.xList = result.map((item) => {
        let temp = this.myFunction.xList.find((x) => x.name == item[0])
        let tempValue = temp?.value === undefined ? 1 : temp.value
        return { name: item[0], value: tempValue }
      })
    },
  },
}
</script>

<style></style>
