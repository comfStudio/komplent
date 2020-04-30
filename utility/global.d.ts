declare namespace NodeJS {
    export interface Global {
        STATES: any
        store: {
            fairy: any
            s3client: any
            email: any
            scheduler: any
            persistent_session: any
        }
        initialized: boolean
        user_room: any
        primus: any
        Primus: any
        log: {
            trace: (string) => void
            debug: (string) => void
            info: (string) => void
            warn: (string) => void
            error: (string) => void
        }
    }
}