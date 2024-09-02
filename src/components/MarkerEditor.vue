<script setup lang="ts">
import type { AppData, MarkItem, MarkTemplate, PointerEvent } from '@/types/global'
import { shallowRef, watch } from 'vue'
import LeaferEditor from './LeaferEditor.vue'

let appData: AppData | null = null
const cleanFunc = shallowRef<(() => void) | null>(null)

const props = defineProps<{
  id: string
  /**
   * 画布宽度
   */
  width: number
  /**
   * 画布高度
   */
  height: number
  /**
   * 主图地址
   */
  mainImage: string
  /**
   * 标记模板
   */
  mark: MarkTemplate
  /**
   * 图标宽度，默认为 50
   */
  iconWidth?: number
  /**
   * 是否使用灰色蒙版
   */
  mask?: boolean
}>()

/**
 * 获取打码数据
 */
function getMarks(): MarkItem[] {
  const json = appData?.getData()
  const res = []
  for (const item of json?.children || []) {
    if (item.tag === 'Rect' && item.data?.name){
      res.push({
        name: item.data?.name,
        x: Math.round(item.x || 0),
        y: Math.round(item.y || 0),
        width: Math.round(item.width || 0),
        height: Math.round(item.height || 0),
      })
    }
  }
  return res
}

/**
 * 添加打码图标
 */
function addMark({ x, y, width }: { x: number, y: number, width: number}) {
  appData?.add({
    tag: 'Rect',
    x,
    y,
    width,
    height: width,
    fill: {
      type: 'image',
      url: props.mark.icon,
      mode: 'cover',
    },
    editable: true,
    data: {
      name: props.mark.name,
    },
  })
}

const markData = {
  getMarks,
  appData: () => appData,
  clear: () => appData?.clear(),
}

const emit = defineEmits<{
  onLoad: [typeof markData]
}>()

function onLoad(data: AppData) {
  appData = data
  cleanFunc.value = appData.clear
  emit('onLoad', markData)
}

/**
 * 双击删除打码
 */
function onElementDblClick(event: PointerEvent) {
  if (event.target.parent) {
    appData?.remove(event.target)
  }
}

/**
 * 右键添加打码
 */
function onElementMenu(event: PointerEvent) {
  const width = props.iconWidth || 50
  if (!event.target.parent) {
    addMark({ x: event.x - width / 2, y: event.y - width / 2, width })
  }
}

watch(() => props.mainImage, (url) => {
  setTimeout(() => {
    if (url) {
      appData?.setBackground(url, props.mask)
    }
  })
}, { immediate: true })
</script>

<template>
  <div class="editor-wrapper">
    <LeaferEditor :id="props.id" :width="`${props.width}px`" :height="`${props.height}px`"
      style="border: 2px solid #ccc" @element-dbl-click="onElementDblClick" @element-menu="onElementMenu"
      @on-load="onLoad" />
    <slot name="toolbar" :export-json="getMarks" :clear="cleanFunc"></slot>
  </div>
</template>
