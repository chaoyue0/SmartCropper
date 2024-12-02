/**
 * File: cropBox.ts
 * Description: Create a new Cropper
 * Author: buxuewushu
 * Date: 2024-12-2
 *
 */
class CropBox {
    /**
     * Create a new Cropper.
     * @param {number[]} [startPosition] - Record the position of the mouse click.
     * @param {Object} [screenshotData] - Save relevant information about the cropBox.
     */
    startPosition : number[]
    screenshotData : any

    constructor() {
        this.startPosition = []
        this.screenshotData = []
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
        if (canvas) {
            // Arrow function cannot remove events through removeEventListener
            canvas.addEventListener('mousemove', this.moveCrop, false)
            canvas.addEventListener('mouseup', this.removeCrop, false)
            canvas.addEventListener('mouseout', this.removeCrop, false)
        }
    }

    moveCrop = (event: MouseEvent) => {
        const { offsetX, offsetY } = event
        const [startX, startY] = this.startPosition
        const [cropWidth, cropHeight] = [offsetX - startX, offsetY - startY]
        this.screenshotData = { cropWidth: cropWidth, cropHeight: cropHeight }
    }

    removeCrop = () => {
        const canvas: HTMLElement | null = document.querySelector('#canvas-picture')
        if (canvas) {
            canvas.removeEventListener('mousemove', this.moveCrop, false)
            canvas.removeEventListener('mouseup',this.removeCrop, false)
            canvas.removeEventListener('mouseout',this.removeCrop, false)
        }
    }
}

export default CropBox
