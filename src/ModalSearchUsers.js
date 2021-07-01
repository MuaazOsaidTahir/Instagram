import React from 'react'
import Avatar from '@material-ui/core/Avatar';
import { database } from './firebase';

function ModalSearchUsers({ name, id, img, user }) {
    console.log(user)

    const addusertochats = () => {
        console.log("here")
        database.collection("users").doc(`${user}`).collection("Messages").add({
            name: name
        })
    }

    return (
        <div className="search_user" onClick={addusertochats} >
            <Avatar src={img} /> <strong> {name} </strong>
        </div>
    )
}

export default ModalSearchUsers
