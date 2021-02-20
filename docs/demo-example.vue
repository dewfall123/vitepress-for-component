<template>
  <div>
    <p>
      <span class="text">点击次数:</span>
      <span>{{ count }}</span>
    </p>
    <button @click="onClick">count++</button>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'

export default {
  setup() {
    const count = ref(0)
    function onClick() {
      count.value++
    }

    return {
      count,
      onClick
    }
  }
}
</script>

<style lang="less">
.text {
  color: red;
  padding: 0 16px 0 4px;
  font-size: 14px;
}
</style>
