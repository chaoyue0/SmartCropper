import { getInstances } from "./init.ts";

export const getCropImage = () => {
    const { cropBox } = getInstances()
    const screenshotData = cropBox?.screenshotData
    const originalCanvas: HTMLCanvasElement | null = document.querySelector('#canvas-picture')
    const canvas: HTMLCanvasElement = document.createElement('canvas')
    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d')
    if (ctx && originalCanvas && screenshotData) {
        ctx.drawImage(originalCanvas, screenshotData.startX, screenshotData.startY, screenshotData.cropWidth,
            screenshotData.cropHeight, 0, 0, canvas.width, canvas.height)
    }
    return canvas.toDataURL('image/jpeg') || ''
}

export const wheelZoom = () => {
    const canvas: HTMLCanvasElement | null = document.querySelector('#canvas-crop')
    if (canvas) {
        canvas.addEventListener('wheel', function (e: WheelEvent) {
            let scale = 1
            const delta = e.deltaY > 0 ? -0.1 : 0.1
            scale += delta
            const { cropBox } = getInstances()
            cropBox?.zoom(scale)
        })
    }
}
