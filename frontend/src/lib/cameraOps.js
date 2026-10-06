export const TILT_MIN = -90
export const TILT_MAX = 20
export const ZOOM_MIN = 1
export const ZOOM_MAX = 32

// Extra scale at 1x so the frame can shift for pan/tilt without showing empty edges.
const OVERSCAN = 1.25
const PAN_VISUAL_RANGE = 45
const TILT_VISUAL_RANGE = 30

export const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

export const round1 = (value) => Math.round(value * 10) / 10

export const wrapDegrees = (value) => round1(((value % 360) + 360) % 360)

const signedOffset = (value) => ((((value + 180) % 360) + 360) % 360) - 180

// Maps a PTZ position to the scale/shift applied to the still frame; x/y are fractions of the frame.
export function ptzView(ptz, home) {
  const scale = OVERSCAN * Math.pow(ptz.zoom, 0.4)
  const maxShift = 0.5 * (1 - 1 / scale)

  return {
    scale,
    x: -clamp(signedOffset(ptz.pan - home.pan) / PAN_VISUAL_RANGE, -1, 1) * maxShift,
    y: clamp((ptz.tilt - home.tilt) / TILT_VISUAL_RANGE, -1, 1) * maxShift,
  }
}

export const viewTransform = (view) =>
  `scale(${view.scale}) translate(${view.x * 100}%, ${view.y * 100}%)`

const pad = (value) => String(value).padStart(2, '0')

export function fileStamp(date = new Date()) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}_${pad(date.getHours())}-${pad(date.getMinutes())}-${pad(date.getSeconds())}`
}

export const clockTime = (date = new Date()) =>
  `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`

let fullscreenWanted = false

// The whole document goes fullscreen (not just the viewer) so page-level layers like toasts stay visible.
// Must be called inside a user gesture; if the browser refuses, the viewer still covers the window.
export function enterDocumentFullscreen() {
  fullscreenWanted = true
  const root = document.documentElement
  if (!document.fullscreenEnabled || document.fullscreenElement || !root.requestFullscreen) return

  root
    .requestFullscreen({ navigationUI: 'hide' })
    .then(() => {
      // The viewer was closed before the browser finished switching.
      if (!fullscreenWanted) exitDocumentFullscreen()
    })
    .catch(() => {})
}

export function exitDocumentFullscreen() {
  fullscreenWanted = false
  if (document.fullscreenElement) document.exitFullscreen().catch(() => {})
}

export function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function downloadCsv(fileName, header, rows) {
  const escape = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`
  const csv = [header, ...rows].map((row) => row.map(escape).join(',')).join('\r\n')

  // BOM so Excel reads the file as UTF-8.
  downloadBlob(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }), fileName)
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('Camera frame could not be loaded'))
    image.src = url
  })
}

// Renders exactly what the operator sees (object-cover crop, then PTZ scale/shift),
// plus AI boxes and a caption strip, and downloads it as a JPEG.
export async function captureSnapshot({ imageUrl, aspect, view, blurPx = 0, boxes = [], caption, fileName }) {
  const image = await loadImage(imageUrl)

  const width = 1280
  const height = Math.round(width / aspect)
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')

  let cropW = image.naturalWidth
  let cropH = cropW / aspect
  if (cropH > image.naturalHeight) {
    cropH = image.naturalHeight
    cropW = cropH * aspect
  }

  const visibleW = cropW / view.scale
  const visibleH = cropH / view.scale
  const sourceX = (image.naturalWidth - visibleW) / 2 - view.x * cropW
  const sourceY = (image.naturalHeight - visibleH) / 2 - view.y * cropH

  if (blurPx > 0) ctx.filter = `blur(${blurPx * 2}px)`
  ctx.drawImage(image, sourceX, sourceY, visibleW, visibleH, 0, 0, width, height)
  ctx.filter = 'none'

  const toCanvas = (fraction, size, shift) => (view.scale * (fraction - 0.5 + shift) + 0.5) * size

  ctx.font = '700 15px ui-sans-serif, system-ui, sans-serif'
  boxes.forEach((box) => {
    const x = toCanvas(box.left / 100, width, view.x)
    const y = toCanvas(box.top / 100, height, view.y)
    const w = (box.width / 100) * width * view.scale
    const h = (box.height / 100) * height * view.scale

    ctx.fillStyle = box.fill
    ctx.fillRect(x, y, w, h)
    ctx.lineWidth = 3
    ctx.strokeStyle = box.border
    ctx.strokeRect(x, y, w, h)

    const labelW = ctx.measureText(box.label).width + 12
    ctx.fillStyle = box.labelBg
    ctx.fillRect(x, y - 24, labelW, 22)
    ctx.fillStyle = '#ffffff'
    ctx.fillText(box.label, x + 6, y - 8)
  })

  ctx.fillStyle = 'rgba(0, 0, 0, 0.65)'
  ctx.fillRect(0, height - 42, width, 42)
  ctx.fillStyle = '#ffffff'
  ctx.font = '600 16px ui-monospace, SFMono-Regular, Menlo, monospace'
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'left'
  ctx.fillText(caption.left, 16, height - 21)
  ctx.textAlign = 'right'
  ctx.fillText(caption.right, width - 16, height - 21)

  const blob = await new Promise((resolve, reject) => {
    canvas.toBlob((result) => (result ? resolve(result) : reject(new Error('Snapshot encoding failed'))), 'image/jpeg', 0.92)
  })

  downloadBlob(blob, fileName)
}
