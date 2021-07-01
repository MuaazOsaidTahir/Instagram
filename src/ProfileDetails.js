import React, { useContext, useState } from 'react'
import { useParams } from 'react-router'
import { Context } from './context/Provider'
import "./ProfileDetails.css"
import ProfilePosts from './ProfilePosts'
import SavedPosts from './SavedPosts'

function ProfileDetails() {
    const { state } = useContext(Context)
    const [toggle, settoggle] = useState(true)
    const { profilename } = useParams()

    const toggling = () => {
        settoggle(!toggle)
    }

    return (
        <div className="profiledetails" >
            <ul>
                {
                    profilename === state.displayName ?
                        <li className={toggle === true && "activeOption"} onClick={toggling} > Posts </li>
                        :
                        <li className="activeOption" > Posts </li>
                }
                {
                    profilename === state.displayName &&
                    <li className={toggle === false && "activeOption"} onClick={toggling} > Saved </li>
                }
            </ul>
            <div className="profile_posts" >
                {
                    toggle ?
                        <ProfilePosts /> :
                        <SavedPosts name={state.displayName} />
                }
            </div>
        </div>
    )
}

export default ProfileDetails
