<script setup lang="ts">
import { onMounted, ref } from 'vue'
import MarkerEditor from './components/MarkerEditor.vue'

const url = ref('')
const width = ref(500)
const height = ref(500)
const jsonData = ref('')

const mark = {
  name: 'mark1',
  icon: '/favicon.ico',
}

onMounted(async () => {
  const res = await fetch('/image.webp')
  const image = new Image()
  image.src = URL.createObjectURL(await res.blob())
  image.onload = () => {
    url.value = image.src
    height.value = image.height / image.width * width.value
  }
})
</script>

<template>
  <main v-if="url">
    <MarkerEditor id="mark-editor" :mark="mark" mask :width="width" :height="height" :main-image="url">
      <template #toolbar="{ clear, exportJson }">
        <button @click="clear?.()">Clear</button>
        <button @click="jsonData = JSON.stringify(exportJson(), null, 2)">Export</button>
      </template>
    </MarkerEditor>
    <textarea v-model="jsonData" readonly></textarea>
  </main>
</template>

<style lang="css" scoped>
main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  overflow: hidden;
}

textarea {
  width: 500px;
  height: 300px;
  margin-top: 10px;
}
</style>

<style lang="css">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>
