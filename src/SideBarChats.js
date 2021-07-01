import React, { useEffect, useState } from 'react'
import Avatar from '@material-ui/core/Avatar';
import { Link } from 'react-router-dom';
import { database } from './firebase';

function SideBarChats({ id, name, img }) {
    const [lastmessage, setlastmessage] = useState([])

    const subtring = (para) => {
        return para.split("").length > 40 ? `${para.substr(0, 40)}...` : para
    }

    useEffect(() => {
        database.collection("users").doc(`${name}`).collection("Messages").doc(`${id}`).collection("messages").orderBy("timestamp", "asc").onSnapshot(snapshot => {
            setlastmessage(snapshot.docs.map((doc) => {
                return { message: doc.data().message, name: doc.data().username }
            }))
        })
    }, [id, name])

    return (
        <Link to={`/chat/${id}`} >
            <div className="user_messages_avatar" >
                <Avatar src={img} />
                <div className="user_messages" >
                    <p className="username_chatsidebar" >{name}</p>
                    <p className="user_last_message" >{ lastmessage.length > 0 ? subtring(`${lastmessage[lastmessage.length - 1]?.message}`) : ""}</p>
                </div>
            </div>
        </Link>
    )
}

export default SideBarChats
