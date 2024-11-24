import { addClass } from "../controller/utilities.ts";
import { CROPBOX } from "../controller/constants.ts";

/**
 * File: cropBox.ts
 * Description: Create a new Cropper
 * Author: buxuewushu
 * Date: 2024-11-24
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
        this.width = width * 0.8
        this.height = height * 0.8
        this.show = true
    }

    init() {
        const crop: HTMLElement | null = document.querySelector('.cropper-crop-box')
        if (crop) {
            crop.style.width = this.width + 'px'
            crop.style.height = this.height + 'px'
            addClass(crop, CROPBOX)
            const view: HTMLElement | null = document.querySelector('.cropper-view-box')
            if (view) {
                const img: HTMLImageElement = document.createElement('img')
                img.setAttribute('src', 'src/assets/picture.jpg')
                view.appendChild(img)
            }
        }
    }

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
