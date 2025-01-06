import { MASKER_OPACITY } from "../controller/constants.ts";

/**
 * File: cropBox.ts
 * Description: Create a new cropper,contains cropping related information and related event operations
 * Author: buxuewushu
 * Date: 2024-1-6
 *
 */
interface CropInformation {
    startX: number;
    startY: number;
    cropWidth: number;
    cropHeight: number;
}

class CropBox {
    /**
     * @param { number[] } [startPosition] - Record the position of the mouse click.
     * @param { CropInformation | undefined } [screenshotData] - Save relevant information about the cropBox.
     * @param { HTMLImageElement } [image] - Pictures that need to be cropped.
     * @param { number[] } [pointPosition] - The coordinate point when the mouse is clicked.
     * @param { boolean } [isMoving] - Determine whether the cutting frame is moving.
     */
    startPosition : number[]
    screenshotData : CropInformation | undefined
    image: HTMLImageElement
    pointPosition: number[]
    isMoving: boolean

    constructor(image: HTMLImageElement) {
        this.startPosition = []
        this.screenshotData = undefined
        this.image = image
        this.pointPosition = []
        this.isMoving = false
    }

    init() {
        const canvas: HTMLElement | null = document.querySelector('#canvas-picture')
        if (canvas) {
            canvas.addEventListener('mousedown', this.startCrop, false)
        }
    }

    // Use arrow functions to maintain correct this context
    startCrop = (event: MouseEvent) => {
        this.startPosition = [event.clientX, event.clientY]
        const canvas: HTMLElement | null = document.querySelector('#canvas-picture')
        if (canvas && !this.screenshotData) {
            // Arrow function cannot remove events through removeEventListener
            canvas.addEventListener('mousemove', this.dragCrop, false)
            canvas.addEventListener('mouseup', this.removeCrop, false)
            canvas.addEventListener('mouseout', this.removeCrop, false)
        }
    }

    dragCrop = (event: MouseEvent) => {
        const { offsetX, offsetY } = event
        const [startX, startY] = this.startPosition
        const [cropWidth, cropHeight] = [offsetX - startX, offsetY - startY]
        this.screenshotData = { startX: startX, startY: startY, cropWidth: cropWidth, cropHeight: cropHeight }

        // Draw mask and cropped rectangular area
        const canvas: HTMLCanvasElement | null = document.querySelector('#canvas-picture')
        if (canvas) {
            const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d')
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height)
                this.drawImageMasker(ctx, 0, 0,canvas.width, canvas.height, MASKER_OPACITY)
                this.drawScreenShot(ctx, canvas.width, canvas.height,this.startPosition[0], this.startPosition[1], cropWidth, cropHeight)
                canvas.addEventListener('mousedown', this.startMove, false)
                canvas.addEventListener('mousemove', this.moveCrop, false)
                canvas.addEventListener('mouseup',this.endMove, false)
            }
        }
    }

    startMove = (event: MouseEvent) => {
        const { offsetX, offsetY } = event
        this.pointPosition = [offsetX, offsetY]
        this.isMoving = true
    }

    moveCrop = (event: MouseEvent) => {
        if (this.isMoving) {
            const { offsetX, offsetY } = event
            let dx, dy
            dx = offsetX - this.pointPosition[0]
            dy = offsetY - this.pointPosition[1]
            const canvas: HTMLCanvasElement | null = document.querySelector('#canvas-picture')
            if (canvas) {
                const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d')
                if (ctx && this.screenshotData) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height)
                    this.drawImageMasker(ctx, 0, 0,canvas.width, canvas.height, MASKER_OPACITY)
                    this.drawScreenShot(ctx, canvas.width, canvas.height,this.screenshotData.startX + dx, this.screenshotData.startY + dy, this.screenshotData.cropWidth, this.screenshotData.cropHeight)
                }
            }
        }
    }

    endMove = (event: MouseEvent) => {
        const { offsetX, offsetY } = event
        const pointEndPosition = [ offsetX, offsetY ]
        let dx, dy
        dx = pointEndPosition[0] - this.pointPosition[0]
        dy = pointEndPosition[1] - this.pointPosition[1]
        this.isMoving = false
        if (this.screenshotData && dx && dy) {
            this.screenshotData.startX = this.screenshotData.startX + dx
            this.screenshotData.startY = this.screenshotData.startY + dy
        }
    }

    removeCrop = () => {
        const canvas: HTMLElement | null = document.querySelector('#canvas-picture')
        if (canvas) {
            canvas.removeEventListener('mousemove', this.dragCrop, false)
            canvas.removeEventListener('mouseup',this.removeCrop, false)
            canvas.removeEventListener('mouseout',this.removeCrop, false)
        }
    }

    drawImageMasker = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, opacity: number) => {
        ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`
        ctx.fillRect(x, y, width, height)
    }

    drawScreenShot = (ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number, rectX: number, rectY: number, rectWidth: number, rectHeight: number) => {
        ctx.globalCompositeOperation = 'destination-out'
        ctx.fillStyle = '#2c2c2c'
        ctx.fillRect(rectX, rectY, rectWidth, rectHeight)

        ctx.globalCompositeOperation = 'destination-over'
        ctx.drawImage(this.image, 0, 0, canvasWidth, canvasHeight)
    }
}

export default CropBox
