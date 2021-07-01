import React, { useEffect, useRef, useState } from 'react'
import Avatar from '@material-ui/core/Avatar';
import "./MessagesPage.css"
import { useParams } from 'react-router';
import { auth, database } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import firebase from 'firebase'
import { Link } from 'react-router-dom';

function Chat() {
    const [user, loading] = useAuthState(auth)
    const { roomId } = useParams()
    const [usermessage, setusermessage] = useState("")
    const [roommessages, setroommessages] = useState([])
    const [messageuser, setmessageuser] = useState("")
    const chatref = useRef(null)
    const [messageuserimg, setmessageuserimg] = useState("")

    useEffect(() => {
        document.title = "Instagram ⚪ Chats"
    }, [])

    useEffect(() => {
        database.collection("users").doc(`${user?.displayName}`).collection("Messages").doc(`${roomId}`).collection("messages").orderBy("timestamp", "asc").onSnapshot(snapshot => {
            setroommessages(snapshot.docs.map((doc) => {
                return { message: doc.data().message, username: doc.data().username }
            }))
        })
    }, [roomId, user])

    useEffect(() => {
        database.collection("users").doc(`${user?.displayName}`).collection("Messages").doc(`${roomId}`).onSnapshot(snapshot => {
            setmessageuser(snapshot.data().name)
        })
    }, [roomId, user])

    useEffect(() => {
        if (messageuser) {
            database.collection("users").doc(`${messageuser}`).onSnapshot(snapshot => {
                setmessageuserimg(snapshot.data().pictureURL)
            })
        }
    }, [messageuser])

    const sendmessage = () => {
        database.collection("users").doc(`${user?.displayName}`).collection("Messages").doc(`${roomId}`).collection("messages").add({
            message: usermessage,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })

        database.collection("users").doc(`${messageuser}`).collection("Messages").doc(`${roomId}`).set({
            name: user.displayName
        })

        database.collection("users").doc(`${messageuser}`).collection("Messages").doc(`${roomId}`).collection("messages").add({
            message: usermessage,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })

        setTimeout(() => {
            chatref.current?.scrollIntoView({ behavior: "smooth" })
        }, 100);


        setusermessage("")
    }

    useEffect(() => {
        setTimeout(() => {
            chatref.current?.scrollIntoView({ behavior: "smooth" })
        }, 500);
    }, [roomId, loading, roommessages])

    return (
        <div className="messages_subcontainer_right" >
            <div className="messages_subcontainer_userchat" >
                <div className="messages_subcontainer_userchat_header" >
                    <Link to={`/profile/${messageuser}`} >
                        <Avatar src={messageuserimg} /> <strong> {messageuser} </strong>
                    </Link>
                </div>
                <div className="messages_subcontainer_userchat_body" >
                    {
                        roommessages.map((message) => {
                            return <div className={`${user.displayName === message.username && "sent_message"} user_message_container`} >
                                {user.displayName === message.username ? null : <Link to={`/profile/${messageuser}`} ><Avatar src={messageuserimg} /></Link>}<p className={`${message.username === user.displayName ? "message_sent" : "message_recieved"}`} >{message.message}</p>
                            </div>
                        })
                    }
                    <div ref={chatref} style={{ paddingBottom: "20px" }} />
                </div>
                <div className="messages_subcontainer_userchat_form" >
                    <div className="message_form_container" >
                        <form>
                            <input placeholder="Message..." value={usermessage} onChange={(e) => setusermessage(e.target.value)} />
                            {
                                usermessage &&
                                <button className="message_sendbtn" onClick={sendmessage} > Send </button>
                            }
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Chat
