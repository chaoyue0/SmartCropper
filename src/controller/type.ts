/**
 * Check prototype tag of the given value.
 * @param {*} value - The value to check.
 * @returns {string} Returns tag.
 */
function getTag(value: unknown): string {
    if (value == null) {
        return value === undefined ? '[object Undefined]' : '[object Null]'
    }
    return Object.prototype.toString.call(value)
}

/**
 * Check if the given value is a number.
 * @param {*} value - The value to check.
 * @returns {boolean} Returns `true` if the given value is a number, else `false`.
 */
export function isNumber(value: any) {
    return typeof value === 'number' && !isNaN(value) && getTag(value) === '[object Number]'
}
