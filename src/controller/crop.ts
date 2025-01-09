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
