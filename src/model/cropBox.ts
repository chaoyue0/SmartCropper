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
     * @param { boolean } [isChanging] - Determine whether the cutting frame is changing.
     */
    startPosition : number[]
    screenshotData : CropInformation | undefined
    image: HTMLImageElement
    clickPosition: number[]
    pointPosition: number[]
    isMoving: boolean
    isChanging: boolean
    isCropped: boolean

    constructor(image: HTMLImageElement) {
        this.startPosition = []
        this.screenshotData = undefined
        this.image = image
        this.clickPosition = []
        this.pointPosition = []
        this.isMoving = false
        this.isChanging = false
        this.isCropped = false
    }

    init() {
        const canvas: HTMLCanvasElement | null = document.querySelector('#canvas-picture')
        if (canvas) {
            if (!this.isCropped) {
                this.isCropped = true
                document.body.style.cursor = 'crosshair'
                canvas.addEventListener('mousedown', this.startCrop, false)
            }
        }
    }

    // Use arrow functions to maintain correct this context
    startCrop = (event: MouseEvent) => {
        this.startPosition = [event.clientX, event.clientY]
        const canvas: HTMLCanvasElement | null = document.querySelector('#canvas-picture')
        if (canvas && !this.screenshotData) {
            // Arrow function cannot remove events through removeEventListener
            canvas.addEventListener('mousemove', this.dragCrop, false)
            canvas.addEventListener('mouseup', this.endCrop, false)
            canvas.addEventListener('mouseout', this.endCrop, false)
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

    endCrop = () => {
        const canvas: HTMLCanvasElement | null = document.querySelector('#canvas-picture')
        if (canvas) {
            canvas.removeEventListener('mousemove', this.dragCrop, false)
            canvas.removeEventListener('mouseup', this.endCrop, false)
            canvas.removeEventListener('mouseout', this.endCrop, false)
            this.drawCorners()
        }
    }

    drawCorners = () => {
        if (this.screenshotData) {
            const corners = [
                { x: this.screenshotData.startX, y: this.screenshotData.startY }, // left-top
                { x: this.screenshotData.startX + this.screenshotData.cropWidth, y: this.screenshotData.startY }, // right-top
                { x: this.screenshotData.startX, y: this.screenshotData.startY + this.screenshotData.cropHeight }, // left-bottom
                { x: this.screenshotData.startX + this.screenshotData.cropWidth, y: this.screenshotData.startY + this.screenshotData.cropHeight }, // right-bottom
                { x: this.screenshotData.startX + this.screenshotData.cropWidth / 2, y: this.screenshotData.startY }, // top
                { x: this.screenshotData.startX + this.screenshotData.cropWidth / 2, y: this.screenshotData.startY + this.screenshotData.cropHeight }, // bottom
                { x: this.screenshotData.startX, y: this.screenshotData.startY + this.screenshotData.cropHeight / 2 }, // left
                { x: this.screenshotData.startX + this.screenshotData.cropWidth, y: this.screenshotData.startY + this.screenshotData.cropHeight / 2 } // right
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

    getCropPoint = (event: MouseEvent) => {
        const { offsetX, offsetY } = event
        if (this.screenshotData) {
            const corners = [
                { type: 'left-top', x: this.screenshotData.startX, y: this.screenshotData.startY }, // left-top
                { type: 'right-top', x: this.screenshotData.startX + this.screenshotData.cropWidth, y: this.screenshotData.startY }, // right-top
                { type: 'left-bottom', x: this.screenshotData.startX, y: this.screenshotData.startY + this.screenshotData.cropHeight }, // left-bottom
                { type: 'right-bottom', x: this.screenshotData.startX + this.screenshotData.cropWidth, y: this.screenshotData.startY + this.screenshotData.cropHeight }, // right-bottom
                { type: 'top', x: this.screenshotData.startX + this.screenshotData.cropWidth / 2, y: this.screenshotData.startY }, // top
                { type: 'bottom', x: this.screenshotData.startX + this.screenshotData.cropWidth / 2, y: this.screenshotData.startY + this.screenshotData.cropHeight }, // bottom
                { type: 'left', x: this.screenshotData.startX, y: this.screenshotData.startY + this.screenshotData.cropHeight / 2 }, // left
                { type: 'right', x: this.screenshotData.startX + this.screenshotData.cropWidth, y: this.screenshotData.startY + this.screenshotData.cropHeight / 2 } // right
            ]
            for (let i = 0; i < corners.length; i++) {
                const distance = Math.sqrt((offsetX - corners[i].x) ** 2 + (offsetY - corners[i].y) ** 2)
                if (distance <= CORNERRADIUS) {
                    return corners[i].type
                }
            }
        }
        return null
    }

    changeCrop = (event: MouseEvent) => {
        const { offsetX, offsetY } = event
        let dx, dy
        if (this.screenshotData) {
            dx = offsetX - this.screenshotData.startX
            dy = offsetY - this.screenshotData.startY
        }
        let point = this.getCropPoint(event)

        const canvas: HTMLCanvasElement | null = document.querySelector('#canvas-picture')
        if (canvas) {
            const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d')
            if (ctx && this.screenshotData && dx && dy) {
                ctx.clearRect(0, 0, canvas.width, canvas.height)
                this.drawImageMasker(ctx, 0, 0,canvas.width, canvas.height, MASKER_OPACITY)
                this.drawScreenShot(ctx, canvas.width, canvas.height,this.screenshotData.startX,
                    this.screenshotData.startY, this.screenshotData.cropWidth, this.screenshotData.cropHeight)
                switch (point) {
                    case 'left-top':
                        this.screenshotData.startX = offsetX
                        this.screenshotData.startY = offsetY
                        this.screenshotData.cropWidth -= dx
                        this.screenshotData.cropHeight -= dy
                        point = this.getCropPoint(event)
                        this.reDrawScreenShot(ctx, canvas.width, canvas.height, this.screenshotData.startX, this.screenshotData.startY,
                            this.screenshotData.cropWidth, this.screenshotData.cropHeight)
                        break
                    case 'right-top':
                        this.screenshotData.startY = offsetY
                        this.screenshotData.cropWidth = dx
                        this.screenshotData.cropHeight -= dy
                        point = this.getCropPoint(event)
                        this.reDrawScreenShot(ctx, canvas.width, canvas.height, this.screenshotData.startX, this.screenshotData.startY,
                            this.screenshotData.cropWidth, this.screenshotData.cropHeight)
                        break
                    case 'left-bottom':
                        this.screenshotData.startX = offsetX
                        this.screenshotData.cropWidth -= dx
                        this.screenshotData.cropHeight = dy
                        point = this.getCropPoint(event)
                        this.reDrawScreenShot(ctx, canvas.width, canvas.height, this.screenshotData.startX, this.screenshotData.startY,
                            this.screenshotData.cropWidth, this.screenshotData.cropHeight)
                        break
                    case 'right-bottom':
                        this.screenshotData.cropWidth = dx
                        this.screenshotData.cropHeight = dy
                        point = this.getCropPoint(event)
                        this.reDrawScreenShot(ctx, canvas.width, canvas.height, this.screenshotData.startX, this.screenshotData.startY,
                            this.screenshotData.cropWidth, this.screenshotData.cropHeight)
                        break
                    case 'top':
                        this.screenshotData.startY = offsetY
                        this.screenshotData.cropHeight -= dy
                        point = this.getCropPoint(event)
                        this.reDrawScreenShot(ctx, canvas.width, canvas.height, this.screenshotData.startX, this.screenshotData.startY,
                            this.screenshotData.cropWidth, this.screenshotData.cropHeight)
                        break
                    case 'bottom':
                        this.screenshotData.cropHeight = dy
                        point = this.getCropPoint(event)
                        this.reDrawScreenShot(ctx, canvas.width, canvas.height, this.screenshotData.startX, this.screenshotData.startY,
                            this.screenshotData.cropWidth, this.screenshotData.cropHeight)
                        break
                    case 'left':
                        this.screenshotData.startX = offsetX
                        this.screenshotData.cropWidth -= dx
                        point = this.getCropPoint(event)
                        this.reDrawScreenShot(ctx, canvas.width, canvas.height, this.screenshotData.startX, this.screenshotData.startY,
                            this.screenshotData.cropWidth, this.screenshotData.cropHeight)
                        break
                    case 'right':
                        this.screenshotData.cropWidth = dx
                        point = this.getCropPoint(event)
                        this.reDrawScreenShot(ctx, canvas.width, canvas.height, this.screenshotData.startX, this.screenshotData.startY,
                            this.screenshotData.cropWidth, this.screenshotData.cropHeight)
                        break
                }
            }
        }
    }

    startMove = (event: MouseEvent) => {
        const { offsetX, offsetY } = event
        this.clickPosition = [offsetX, offsetY]
        if (this.screenshotData) {
            if (
                this.clickPosition[0] < this.screenshotData.startX + this.screenshotData.cropWidth &&
                this.clickPosition[0] > this.screenshotData.startX &&
                this.clickPosition[1] > this.screenshotData.startY &&
                this.clickPosition[1] < this.screenshotData.startY + this.screenshotData.cropHeight
            ) {
                this.isMoving = true
            }
            else if (this.getCropPoint(event)) {
                this.isChanging = true
            }
        }
    }

    moveCrop = (event: MouseEvent) => {
        if (this.isChanging) {
            this.changeCrop(event)
        }
        else if (this.isMoving) {
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
        else {
            if (this.screenshotData) {
                if (
                    event.offsetX < this.screenshotData.startX + this.screenshotData.cropWidth &&
                    event.offsetX > this.screenshotData.startX &&
                    event.offsetY > this.screenshotData.startY &&
                    event.offsetY < this.screenshotData.startY + this.screenshotData.cropHeight
                ) {
                    document.body.style.cursor = 'move'
                }
                else if (this.getCropPoint(event)) {
                    switch (this.getCropPoint(event)) {
                        case 'left-top':
                            document.body.style.cursor = 'nwse-resize'
                            break
                        case 'right-top':
                            document.body.style.cursor = 'nesw-resize'
                            break
                        case 'left-bottom':
                            document.body.style.cursor = 'nesw-resize'
                            break
                        case 'right-bottom':
                            document.body.style.cursor = 'nwse-resize'
                            break
                        case 'bottom':
                        case 'top':
                            document.body.style.cursor = 'ns-resize'
                            break
                        case 'left':
                        case 'right':
                            document.body.style.cursor = 'ew-resize'
                            break
                    }
                }
                else {
                    document.body.style.cursor = 'default'
                }
            }
        }
    }

    endMove = (event: MouseEvent) => {
        const { offsetX, offsetY } = event
        if (this.isMoving) {
            this.isMoving = false
            let dx, dy
            dx = offsetX - this.clickPosition[0]
            dy = offsetY - this.clickPosition[1]
            if (this.screenshotData && dx && dy) {
                this.screenshotData.startX = this.screenshotData.startX + dx
                this.screenshotData.startY = this.screenshotData.startY + dy
            }
            this.drawCorners()
        }
        else if (this.isChanging) {
            this.isChanging = false
            // let dx, dy
            // dx = offsetX - this.clickPosition[0]
            // dy = offsetY - this.clickPosition[1]
            // if (this.screenshotData && dx && dy) {
            //     this.screenshotData.startX = this.screenshotData.startX + dx
            //     this.screenshotData.startY = this.screenshotData.startY + dy
            // }
            this.drawCorners()
        }
    }

    drawImageMasker = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number,
                       opacity: number) => {
        ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`
        ctx.fillRect(x, y, width, height)
    }

    drawScreenShot = (ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number, rectX: number,
                      rectY: number, rectWidth: number, rectHeight: number) => {
        ctx.globalCompositeOperation = 'destination-out'
        ctx.fillStyle = '#2c2c2c'
        ctx.fillRect(rectX, rectY, rectWidth, rectHeight)

        ctx.globalCompositeOperation = 'destination-over'
        ctx.drawImage(this.image, 0, 0, canvasWidth, canvasHeight)
    }

    reDrawScreenShot = (ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number, cropX: number,
                        cropY: number, cropWidth: number, cropHeight: number) => {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight)
        this.drawImageMasker(ctx, 0, 0,canvasWidth, canvasHeight, MASKER_OPACITY)
        this.drawScreenShot(ctx, canvasWidth, canvasHeight,cropX, cropY, cropWidth, cropHeight)
    }
}

export default CropBox
