<template>
  <div>
    <v-typical
      class="blink"
      :steps="['Hello', 1000, 'Hello World !', 500, 'Hello World ! 👋', 1000]"
      :loop="Infinity"
      :wrapper="'h2'"
    ></v-typical>

    <p>
      <span class="text">点击次数:</span>
      <span>{{ count }}</span>
    </p>
    <button @click="onClick">count++</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import VTypical from 'vue-typical'


const count = ref(0)
function onClick() {
  count.value++
}
</script>

<style>
.text {
  font-size: 14px;
}
</style>
