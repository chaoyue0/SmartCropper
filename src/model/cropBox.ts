import { CORNERRADIUS, MASKER_OPACITY } from "../controller/constants.ts";

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
     * @param { number[] } [clickPosition] - The coordinate point when the mouse is clicked.
     * @param { number[] } [pointPosition] - Four corners of the cropping frame.
     * @param { boolean } [isMoving] - Determine whether the cutting frame is moving.
     */
    startPosition : number[]
    screenshotData : CropInformation | undefined
    image: HTMLImageElement
    clickPosition: number[]
    pointPosition: number[]
    isMoving: boolean

    constructor(image: HTMLImageElement) {
        this.startPosition = []
        this.screenshotData = undefined
        this.image = image
        this.clickPosition = []
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
        const canvas: HTMLCanvasElement | null = document.querySelector('#canvas-picture')
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

    drawCorners = () => {
        if (this.screenshotData) {
            const corners = [
                { x: this.screenshotData.startX, y: this.screenshotData.startY }, // left-top
                { x: this.screenshotData.startX + this.screenshotData.cropWidth, y: this.screenshotData.startY }, // right-top
                { x: this.screenshotData.startX, y: this.screenshotData.startY + this.screenshotData.cropHeight }, // left-bottom
                { x: this.screenshotData.startX + this.screenshotData.cropWidth, y: this.screenshotData.startY + this.screenshotData.cropHeight } // right-bottom
            ]
            const canvas: HTMLCanvasElement | null = document.querySelector('#canvas-picture')
            if (canvas) {
                const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d')
                if (ctx) {
                    ctx.globalCompositeOperation = 'source-over'
                    corners.forEach((corner) => {
                        ctx.fillStyle = 'blue'
                        ctx.beginPath()
                        ctx.arc(corner.x, corner.y, CORNERRADIUS, 0, Math.PI * 2)
                        ctx.fill()
                    })
                }
            }
        }
    }

    startMove = (event: MouseEvent) => {
        const { offsetX, offsetY } = event
        this.clickPosition = [offsetX, offsetY]
        this.isMoving = true
    }

    moveCrop = (event: MouseEvent) => {
        if (this.isMoving) {
            const { offsetX, offsetY } = event
            let dx, dy
            dx = offsetX - this.clickPosition[0]
            dy = offsetY - this.clickPosition[1]
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
        dx = pointEndPosition[0] - this.clickPosition[0]
        dy = pointEndPosition[1] - this.clickPosition[1]
        this.isMoving = false
        if (this.screenshotData && dx && dy) {
            this.screenshotData.startX = this.screenshotData.startX + dx
            this.screenshotData.startY = this.screenshotData.startY + dy
        }
        this.drawCorners()
    }

    removeCrop = () => {
        const canvas: HTMLElement | null = document.querySelector('#canvas-picture')
        if (canvas) {
            canvas.removeEventListener('mousemove', this.dragCrop, false)
            canvas.removeEventListener('mouseup', this.removeCrop, false)
            canvas.removeEventListener('mouseout', this.removeCrop, false)
            this.drawCorners()
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
