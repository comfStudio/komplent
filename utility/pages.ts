export const dashboard = "/dashboard"
export const home = "/"
export const login = "/login"

export const make_profile_urlpart = (name: string) => {
    return `@${name}`
}

export const make_profile_path = (name: string) => {
    return `/${make_profile_urlpart(name)}`
}

export const get_profile_urlpart = (path: string) => {
    if (path.startsWith("/")) {
        path = path.slice(1)
        path = path.split("/")[0]
    }
    return path
}

export const get_profile_id = (path: string) => {
    const match = /^@\S+$/u  // @profile_id
    let p_id = ""
    path = get_profile_urlpart(path)
    if (match.test(path)) {
        p_id = path.slice(1)
    }
    return p_id
}