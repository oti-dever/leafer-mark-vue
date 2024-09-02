/**
 * 打码模板
 */
export interface MarkTemplate {
  /**
   * 模板名称，必须唯一
   */
  name: string
  /**
   * 图片 URL
   */
  icon: string
}

/**
 * 打码图
 */
export interface MarkItem {
  name: string
  x: number
  y: number
  width: number
  height: number
  rotation?: number
  opacity?: number
}

export type { AppData } from '@/components/LeaferEditor.vue'
export type { PointerEvent } from 'leafer-ui'
