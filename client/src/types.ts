export interface Item {
    key: number,
    name: string,
    taker?: string
}

export interface NewItem {
    new: {
        name: string
    }
}

export interface TakeItem {
    do: {
        key: number,
        taker: string
    }
}