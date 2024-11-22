import Container from "../model/container.ts";
import { TEMPLATE } from "../view/template.ts";

/**
 * init a cropper.
 * @param {number} [width] - The Controller width.
 * @param {number} [height] - The Controller height.
 */
export const initCropper = (width: number, height: number) => {
    const smartCropperNode = document.querySelector('.smart-cropper')

    if (smartCropperNode) {
        smartCropperNode.innerHTML = TEMPLATE
        const container = new Container(width, height)
        container.init()
    } else {
        console.error('Unable to find smartCropperNode, please create a node with class name .smart-cropper')
    }
}
