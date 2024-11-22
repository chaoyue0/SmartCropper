import { addClass } from "../controller/utilities.ts";
import { CONTROLLER } from "../controller/constants.ts";

/**
 * File: Container.ts
 * Description: Create a Container
 * Author: buxuewushu
 * Date: 2024-11-18
 *
 */
class Container {
    /**
     * Create a new Container.
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

    init() {
        const container: HTMLElement | null = document.querySelector('.cropper-container')
        if (container) {
            addClass(container, CONTROLLER)
            container.style.width = this.width + 'px'
            container.style.height = this.height + 'px'
        }
    }
}

export default Container
