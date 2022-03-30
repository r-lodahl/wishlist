import {WebSocketServer} from "ws"
import {Low, JSONFile} from "lowdb"

interface Data {
    items: Item[]
}

interface Item {
    key: number,
    name: string,
    taker?: string
}

interface NewItem {
    name: string
}

interface TakeItem {
    key: number,
    taker: string
}

const adapter = new JSONFile<Data>('wishes.json')
const db = new Low<Data>(adapter)

await db.read()

if (db.data == null) {
    db.data = {
        items: []
    }
    await db.write()
}

const wss = new WebSocketServer({port: 8080})

console.log('server started listening')

wss.on("connection", ws => {
    console.log("client connected")

    ws.send(JSON.stringify(db.data.items))

    ws.on("message", async data => {
        console.log(`received ${data}`)

        const json = JSON.parse(data.toString())

        const newObject = json.new as NewItem
        const doObject = json.do as TakeItem

        if (!newObject && !doObject) {
            return
        }

        let item: Item

        if (newObject) {
            item = {
                key: db.data.items.length === 0 ? 0 : db.data.items[db.data.items.length - 1].key++,
                name: `${newObject.name[0].toUpperCase()}${newObject.name.slice(1)}`
            }
            db.data.items.push(item)
        } else {
            item = db.data.items[doObject.key]
            item.taker = doObject.taker
        }

        await db.write()

        wss.clients.forEach(
            client => client.send(
                JSON.stringify(item)
            )
        )
    })

    ws.on("close", () => {
        console.log("client disconnected")
    })

    ws.onerror = function() {
        console.log("error")
    }
})
