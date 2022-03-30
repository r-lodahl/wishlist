import {Item, TakeItem} from "../types";
import './ItemComponent.css';
import {useState} from "react";

interface ItemProps {
    item: Item
    onTakeItem: (item: TakeItem) => void
}

function ItemComponent(props: ItemProps) {
    const [isTaking, setIsTaking] = useState(false)
    const [taker, setTaker] = useState(props.item.taker || "")

    const addTaker = function () {
        props.onTakeItem({
            do: {
                id: props.item.id,
                taker: taker
            }
        })
        setIsTaking(false)
    }

    return (
        <div className="item">
            <p>{props.item.name}</p>
            {
                isTaking
                    ? <>
                        <input
                            onInput={e => setTaker(e.currentTarget.value)}
                            onKeyUp={e => {
                                if (e.key === "Enter") {
                                    addTaker()
                                    e.stopPropagation()
                                }
                            }}
                            placeholder="Dein Name"/>
                        <button onClick={addTaker}>Bestätigen</button>
                        <button onClick={() => setIsTaking(false)}>Doch nicht</button>
                    </>
                    : props.item.taker || taker
                        ? <p>Wird von {props.item.taker || taker} mitgebracht!</p>
                        : <button onClick={() => setIsTaking(true)}>
                            Bring ich mit
                        </button>
            }
        </div>
    )
}

export default ItemComponent;
