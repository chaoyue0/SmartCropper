import Container from "../model/container.ts";
import { TEMPLATE } from "../view/template.ts";
import Picture from "../model/picture.ts";
import CropBox from "../model/cropBox.ts";

// Define instance object
let containerInstance: Container | null = null
let pictureInstance: Picture | null = null
let cropBoxInstance: CropBox | null = null

/**
 * init a cropper.
 * @param {number} [width] - The Controller width.
 * @param {number} [height] - The Controller height.
 */
export const initCropper = (width: number, height: number) => {
    const smartCropperNode = document.querySelector('.smart-cropper')

    if (smartCropperNode) {
        smartCropperNode.innerHTML = TEMPLATE
        containerInstance = new Container(width, height)
        containerInstance.init()
        pictureInstance = new Picture(width, height)
        pictureInstance.init()
        cropBoxInstance = new CropBox(pictureInstance.getImage())
        cropBoxInstance.init()
    } else {
        console.error('Unable to find smartCropperNode, please create a node with class name .smart-cropper')
    }
}

/**
 * Export instance objects through modules.
 */
export const getInstances = () => {
    return {
        container: containerInstance,
        picture: pictureInstance,
        cropBox: cropBoxInstance,
    }
}
