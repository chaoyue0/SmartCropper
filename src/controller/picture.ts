import {getInstances} from "./init.ts";

export const zoomPicture = (number = 1.5) => {
    const { cropBox } = getInstances()
    cropBox?.zoom(number)
}
