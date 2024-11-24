import { addClass, blobToUrl } from "../controller/utilities.ts";
import { PICTURE } from "../controller/constants.ts";

/**
 * File: picture.ts
 * Description: Create a Picture
 * Author: buxuewushu
 * Date: 2024-11-22
 *
 */
class Picture {
    /**
     * Create a new Picture.
     * @param {number} [width] - The Container width.
     * @param {number} [height] - The Container height.
     */
    width: number
    height: number

    constructor(width: number, height: number) {
        // this.options = Object.assign({}, options)
        this.width = width
        this.height = height
    }

    init(image: string | Blob) {
        const picture: HTMLElement | null = document.querySelector('.cropper-picture')
        if (picture) {
            picture.style.width = this.width + 'px'
            picture.style.height = this.height + 'px'
            const img: HTMLImageElement = document.createElement('img')
            addClass(img, PICTURE)
            img.setAttribute('alt', 'picture')
            if (image instanceof Blob) {
                img.setAttribute('src', blobToUrl(image))
            } else {
                img.setAttribute('src', image)
            }
            picture.append(img)
        }
    }
}

export default Picture
