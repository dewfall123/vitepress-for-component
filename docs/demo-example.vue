<template>
  <div>
    <p>
      <span class="text">点击次数:</span>
      <span>{{ count }}</span>
    </p>
    <ElButton @click="onClick">count++</ElButton>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import { ElButton } from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'

export default {
  components: {
    ElButton,
  },
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
  font-size: 14px;
}
</style>
