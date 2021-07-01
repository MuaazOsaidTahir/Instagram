import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { database } from './firebase'
import ProfilePost from './ProfilePost'
import "./ProfilePosts.css"

function ProfilePosts() {
    const [posts, setposts] = useState([])
    const { profilename } = useParams();

    useEffect(() => {
        database.collection("users").doc(`${profilename}`).collection("posts").onSnapshot(snapshot => {
            setposts(snapshot.docs.map((val) => {
                return {
                    id: val.id,
                    img: val.data().imageURL,
                    caption: val.data().caption
                }
            }))
        })
    }, [profilename])

    return (
        <div className="profile_post" >
            {
                posts.map((post, i) => {
                    return <ProfilePost key={i} url={post.img} id={post.id} caption={post.caption} />
                })
            }
        </div>
    )
}

export default ProfilePosts
