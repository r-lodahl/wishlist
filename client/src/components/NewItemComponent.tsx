import './NewItemComponent.css';
import {useState} from "react";
import {NewItem} from "../types";

interface NewItemProps {
    onAddItem: (item: NewItem) => void
}

function NewItemComponent(props: NewItemProps) {
    const [newItem, setNewItem] = useState("")

    const onSubmit = function() {
        console.log(newItem)
        props.onAddItem({new: {
            name: newItem
        }})
    }

    return (
        <div className="new-item">
            <i className="icon fa-solid fa-plus"/>
            <p>Neuer Wunsch</p>
            <input onInput={event => setNewItem(event.currentTarget.value)} onKeyUp={
                event => {
                    if (event.key === "Enter") {
                        onSubmit()
                        event.stopPropagation()
                    }
                }
            }/>
            <button onClick={onSubmit}>Hinzufügen</button>
        </div>
    )
}

export default NewItemComponent;
