import Container from "../model/container.ts";
import { TEMPLATE } from "../view/template.ts";
import Picture from "../model/picture.ts";

/**
 * init a cropper.
 * @param {string | Blob} [image] - The Image element.
 * @param {number} [width] - The Controller width.
 * @param {number} [height] - The Controller height.
 */
export const initCropper = (image: string | Blob, width: number, height: number) => {
    const smartCropperNode = document.querySelector('.smart-cropper')

    if (smartCropperNode) {
        smartCropperNode.innerHTML = TEMPLATE
        const container = new Container(width, height)
        container.init()
        const picture = new Picture(width, height)
        picture.init(image)
    } else {
        console.error('Unable to find smartCropperNode, please create a node with class name .smart-cropper')
    }
}
