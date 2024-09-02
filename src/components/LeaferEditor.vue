<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { App, PointerEvent, UI } from 'leafer-ui'
import { Editor } from '@leafer-in/editor'
import type { ILeaf, IUI } from '@leafer-ui/interface'

const props = defineProps<{
  id: string
  width: string
  height: string
}>()

let app = null as App | null

const appData = {
  clear() {
    app?.tree.clear()
    app?.editor.select([])
  },
  getData() {
    return app?.tree.toJSON()
  },
  add(tag: object) {
    app?.tree.add(UI.one(tag))
  },
  remove(tag: ILeaf) {
    app?.tree.remove(tag as IUI)
    app?.editor.select([])
  },
  setBackground(url: string, mask: boolean = true) {
    app?.ground.clear()
    app?.ground.add(UI.one({
      tag: 'Rect',
      x: 0,
      y: 0,
      width: app?.ground.width,
      height: app?.ground.height,
      fill: {
        type: 'image',
        url,
        mode: 'cover',
      },
      editable: false,
      hittable: false,
    }))
    if (mask) {
      app?.ground.add(UI.one({
        tag: 'Rect',
        x: 0,
        y: 0,
        width: app?.ground.width,
        height: app?.ground.height,
        fill: 'rgba(127, 127, 127, 0.75)',
        editable: false,
        hittable: false,
      }))
    }
  },
  app: null as App | null,
}

export type AppData = typeof appData

const emit = defineEmits<{
  onLoad: [typeof appData]
  elementClick: [PointerEvent]
  elementDblClick: [PointerEvent]
  elementMenu: [PointerEvent]
}>()

onMounted(() => {
  app = new App({
    view: props.id,
  })

  app.ground = app.addLeafer({
    type: 'draw',
  })
  app.tree = app.addLeafer()
  app.sky = app.addLeafer({
    type: 'draw',
    usePartRender: false,
    wheel: { disabled: true },
    move: { disabled: true },
    zoom: { disabled: true },
  })

  app.editor = new Editor({
    lockRatio: true,
    rotateable: false,
  })
  app.sky.add(app.editor)

  app.on(PointerEvent.CLICK, (e: PointerEvent) => {
    emit('elementClick', e)
  })
  app.on(PointerEvent.DOUBLE_CLICK, (e: PointerEvent) => {
    emit('elementDblClick', e)
  })
  app.on(PointerEvent.MENU, (e: PointerEvent) => {
    emit('elementMenu', e)
  })

  emit('onLoad', appData)
})

onUnmounted(() => {
  app?.destroy()
})
</script>

<template>
  <div :id="props.id" :style="{ height, width }" v-bind="$attrs"></div>
</template>
