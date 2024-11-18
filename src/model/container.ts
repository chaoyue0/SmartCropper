import { addClass } from "../controller/utilities.ts";
import { CONTROLLER } from "../controller/constants.ts";

/**
 * File: controller.ts
 * Description: Create a Controller
 * Author: buxuewushu
 * Date: 2024-11-18
 *
 */
class Controller {
    /**
     * Create a new Controller.
     * @param {number} [width] - The Controller width.
     * @param {number} [height] - The Controller height.
     */
    width: number
    height: number
    background: string
    opacity: number
    zIndex: number

    constructor(width: number, height: number) {
        // this.options = Object.assign({}, options)
        this.width = width
        this.height = height
        this.background = '#000'
        this.opacity = 0.5
        this.zIndex = 1
    }

    init() {
        const controller: HTMLElement = document.createElement('div')
        addClass(controller, CONTROLLER)
        // parentNode.insertBefore(controller, parentNode.nextSibling)
    }
}

export default Controller
