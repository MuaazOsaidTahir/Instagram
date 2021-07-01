import React, { useContext } from 'react'
import Avatar from '@material-ui/core/Avatar';
import "./EachRequest.css"
import { database } from './firebase';
import { Context } from './context/Provider';
import { Link } from 'react-router-dom';

function EachRequest({ id, img, name }) {
    const { state } = useContext(Context)

    const handlerequest = (e) => {
        const { value } = e.target
        if (value === "accept") {
            database.collection("users").doc(`${state.displayName}`).collection("followers").doc(`${id}`).set({
                name: name
            })

            database.collection("users").doc(`${name}`).collection("following").doc(`${state.displayName}`).set({
                name: state.displayName
            })

            database.collection("users").doc(`${state.displayName}`).collection("requests").doc(`${id}`).delete()
        }
        else if (value === "decline") {
            database.collection("users").doc(`${state.displayName}`).collection("requests").doc(`${id}`).delete()
        }
    }

    return (
        <div className="eachrequest" >
            <div>
                <Avatar src={img} />
                <Link to={`/profile/${name}`} >
                    <h4>{name}</h4>
                </Link>
            </div>
            <div>
                <button value="accept" onClick={handlerequest} className="accept_btn" >✓</button>
                <button value="decline" onClick={handlerequest} className="decline_btn" >✕</button>
            </div>

        </div>
    )
}

export default EachRequest
