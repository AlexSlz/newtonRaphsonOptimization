<style scoped>
.His {
  display: flex;
  flex-direction: column;
  right: 0;
  position: absolute;
}
label {
  text-align: center;
}
</style>

<template>
  <div class="His">
    <label>History</label>
    <select size="5">
      <option
        @click="this.$emit('ClickOnElement', $event.target.id)"
        v-for="(item, index) in funcList"
        v-bind:id="index"
      >
        {{ item.funcText }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  data() {
    return {
      funcList: [
        {
          type: 'Optimization',
          funcText: '3x^3-10x^2-56x+5',
        },
        {
          type: 'Optimization',
          funcText: 'x^9',
        },
        {
          type: 'Root Finder',
          funcText: 'x^2',
        },
        {
          type: 'Root Finder',
          funcText: 'x^2+y^2-1\nx^2-y',
        },
        {
          type: 'Root Finder',
          funcText: 'x^3+y-1\ny^3-x+1',
        },
      ],
    }
  },
  emits: ['ClickOnElement'],
}
</script>
