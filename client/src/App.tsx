import React, {useEffect, useRef, useState} from 'react';
import './App.css';
import NewItemComponent from "./components/NewItemComponent";
import {Item, NewItem, TakeItem} from "./types";
import ItemComponent from "./components/ItemComponent";

function App() {
  const [items, setItems] = useState<Item[]>([])
  const ws = useRef<WebSocket|null>(null)

  useEffect(() => {
      ws.current = new WebSocket("ws://localhost:8080")
      ws.current.onopen = () => console.log("ws opened")
      ws.current.onclose = () => console.log("ws closed")

      const wsCurrent = ws.current

      return () => {
          wsCurrent.close()
      }
  }, [])

  useEffect(() => {
      if (!ws.current) return

      ws.current.onmessage = e => {
          const message = JSON.parse(e.data)
          console.log("e", message)

          if (Array.isArray(message)) {
              setItems(message as Item[])
          } else {
              const item = message as Item
              const index = items.findIndex((i,_index,_obj) => i.key === item.key)
              if (index > -1) {
                  items[index] = item
                  setItems(items)
              } else {
                  setItems(items.concat(item))
              }
          }

      }
  }, [items])

  const takeItem = function (item: TakeItem) {
      if (!ws.current) {
          console.error("sending failed")
          return
      }

      ws.current.send(JSON.stringify(item))
  }

  const addItem = function(item: NewItem) {
      if (!ws.current) {
          console.error("sending failed")
          return
      }

      ws.current.send(JSON.stringify(item))
  }

  return (
      <div className="content">
        <div className="container">
            {
                items.map(item => <div className="element"><ItemComponent
                    item={item} onTakeItem={takeItem}
                /></div>)
            }
          {
              window.location.pathname === "/mama" && <div className="element">
                <NewItemComponent onAddItem={addItem} />
              </div>
          }
        </div>
      </div>
  );
}

export default App;
