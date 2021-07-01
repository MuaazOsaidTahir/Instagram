import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router';
import { database } from './firebase'
import ProfilePost from './ProfilePost';

function SavedPosts({ name }) {
    const { profilename } = useParams();
    const [savedpostsuser, setsavedpostsuser] = useState([])
    const [postsdetails, setpostsdetails] = useState([])

    useEffect(() => {
        database.collection("users").doc(`${name}`).collection("saved").onSnapshot(snapshot => {
            setsavedpostsuser(snapshot.docs.map((doc) => {
                return { id: doc.data().id, name: doc.data().name }
            }))
        })
    }, [name])

    useEffect(() => {
        setpostsdetails([])
        savedpostsuser.map((user) => {
            database.collection("users").doc(`${user.name}`).collection("posts").doc(`${user.id}`).onSnapshot(snapshot => {
                setpostsdetails((val) => {
                    return [...val, { id: user.id, ...snapshot.data() }]
                })
            })
        })
    }, [savedpostsuser])

    return (
        <div className="profile_post" >
            {
                postsdetails.map((post) => {
                    return <ProfilePost key={post.id} id={post.id} name={post.name} url={post.imageURL} caption={post.caption} />
                })
            }
        </div>
    )
}

export default SavedPosts
