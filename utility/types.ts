export const tuple = <T extends string[]>(...args: T) => args

export function array_to_enum<T extends string>(o: Array<T>): { [K in T]: K } {
    return o.reduce((res, key) => {
        res[key] = key
        return res
    }, Object.create(null))
}