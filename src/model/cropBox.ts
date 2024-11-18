/**
 * File: cropBox.ts
 * Description: Create a new Cropper
 * Author: buxuewushu
 * Date: 2024-11-18
 *
 */
class CropBox {
    /**
     * Create a new Cropper.
     * @param {number} [width] - The Cropper width.
     * @param {number} [height] - The Cropper height.
     */
    width: number
    height: number
    show: boolean

    constructor(width: number, height: number) {
        // this.options = Object.assign({}, options)
        this.width = width
        this.height = height
        this.show = true
    }

    init() {}

    remove() {
        this.show = false
    }

    setSize(width: number, height: number) {
        this.width = width
        this.height = height
    }

    move() {}

    adjust() {}
}

export default CropBox
