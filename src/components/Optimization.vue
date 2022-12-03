<template>
  <div>
    <strong>Range</strong>
    <input type="number" v-model="funcRange.min" />
    <input type="number" v-model="funcRange.max" />
  </div>
</template>

<script>
export default {
  props: {
    funcRange: Object,
  },
}
</script>
