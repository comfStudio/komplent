declare namespace NodeJS {
    export interface Global {
      store: any
      initialized: boolean
      user_room: any
      primus: any
      Primus: any
    }
  }