<template>
  <div v-for="item in xList">
    <label>{{ item.name }}</label>
    <input type="number" style="margin-left: 10px" v-model="item.value" />
  </div>
</template>

<script>
export default {
  props: {
    xList: Object,
  },
}
</script>
