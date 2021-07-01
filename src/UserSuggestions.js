import React, { useEffect, useState } from 'react'
import "./UserSuggestions.css"
import Avatar from '@material-ui/core/Avatar';
import { auth, database } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Link } from 'react-router-dom';

function UserSuggestions({ img, name }) {
    const [user] = useAuthState(auth)
    const [usersprivateprofilechecker, setusersprivateprofilechecker] = useState("")
    const [followertoggle, setfollowertoggle] = useState("")

    useEffect(() => {
        database.collection("users").doc(`${name}`).collection("followers").onSnapshot(snapshot => {
            snapshot.docs.map((doc) => {
                if (doc.id === user.displayName) {
                    setfollowertoggle("Follower")
                }
            })
        })

        database.collection("users").doc(`${name}`).collection("requests").onSnapshot(snapshot => {
            snapshot.docs.map((doc) => {
                if (doc.id === user.displayName) {
                    setfollowertoggle("Request")
                }
            })
        })
    }, [name, user])


    const unfollowuser = () => {
        database.collection("users").doc(`${user.displayName}`).collection("following").doc(`${name}`).delete()
        database.collection("users").doc(`${name}`).collection("followers").doc(`${user.displayName}`).delete()

        setfollowertoggle("")


    }

    const followuser = () => {
        database.collection("users").doc(`${name}`).collection("privateaccount").doc("privatetoggle").onSnapshot(snapshot => {
            setusersprivateprofilechecker(snapshot.data().decision)
        })
    }

    useEffect(() => {
        if (usersprivateprofilechecker === "yes") {
            database.collection("users").doc(`${name}`).collection("requests").doc(`${user.displayName}`).set({
                name: user.displayName
            })
            setfollowertoggle("Request")
        }
        else if (usersprivateprofilechecker === "no") {
            database.collection("users").doc(`${name}`).collection("followers").doc(`${user.displayName}`).set({
                name: user.displayName
            })

            database.collection("users").doc(`${user.displayName}`).collection("following").doc(`${name}`).set({
                name: name,
            })

            setfollowertoggle("Follower")
        }
    }, [usersprivateprofilechecker, name, user])

    const deleterequest = () => {
        database.collection("users").doc(`${name}`).collection("requests").doc(`${user.displayName}`).delete()
        setfollowertoggle("")
    }

    return (
        <div className="UserSuggestions" >
            <Link to={`/profile/${name}`} >
                <Avatar src={img} /><strong>{name}</strong>
            </Link>
            {
                user.displayName !== name &&
                <div className="suggestions_btncontainer" >
                    {
                        followertoggle === "Follower" ?
                            <button className="profileunfollowebtn" onClick={() => unfollowuser()} >Unfollow</button> : followertoggle === "Request" ?
                                <button className="profileunfollowebtn" onClick={deleterequest} > Requested </button>
                                : <button className="proflie_followerbtn" onClick={() => followuser()} >Follow</button>
                    }
                </div>
            }
        </div >
    )
}

export default UserSuggestions
