export function deepCopyArray(array: any[]) {
    return JSON.parse(JSON.stringify(array))
}