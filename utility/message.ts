export const error_message = (msg: string, json = true) => {
    if (json) {
        return {error: msg}
    }
    return `error: ${msg}`
}

export const message = (msg: string, json = true) => {
    if (json) {
        return {msg: msg}
    }
    return `${msg}`
}

export const data_message = (data: any) => {
    return {data: data}
}