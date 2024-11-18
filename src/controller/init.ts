import Container from "../model/container.ts";

/**
 * init a cropper.
 * @param {number} [width] - The Controller width.
 * @param {number} [height] - The Controller height.
 */
export const initCropper = (width: number, height: number) => {
    const container = new Container(width, height)
    container.init()
}
