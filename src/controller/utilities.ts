/**
 * Add classes to the given element.
 * @param {HTMLElement} element - The target element.
 * @param {string} value - The classes to be added.
 */
export function addClass(element: HTMLElement, value: string) {
    if (!value) {
        return
    }

    if (element.classList) {
        element.classList.add(value)
        return
    }

    const className = element.className.trim()

    if (!className) {
        element.className = value
    } else if (className.indexOf(value) < 0) {
        element.className = `${className} ${value}`
    }
}