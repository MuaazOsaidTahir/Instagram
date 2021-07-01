import React, { useContext, useEffect, useState } from 'react'
import Stories from './Stories'
import "./BodyLeft.css"
import Posts from './Posts'
import { database } from './firebase'
import { Context } from './context/Provider'

function BodyLeft() {
    const [images, setimages] = useState([])
    const { state } = useContext(Context)
    const [followers, setfollowers] = useState([])

    useEffect(() => {
        document.title = "Instagram ⚪ By Muaaz"
    }, [])

    useEffect(() => {
        database.collection("users").doc(`${state.displayName}`).collection("following").onSnapshot(snapshot => {
            setfollowers(snapshot.docs.map((doc) => {
                return { name: doc.id }
            }))
        })
    }, [])

    useEffect(() => {
        setimages([])
        followers.map((follower) => {
            database.collection("users").doc(`${follower.name}`).collection("posts").orderBy("timestamp", "desc").onSnapshot(snapshot => {
                snapshot.docs.map(doc => {
                    setimages((val) => {
                        return [...val, {
                            id: doc.id,
                            url: doc.data().imageURL,
                            caption: doc.data().caption,
                            name: doc.data().name
                        }]
                    })
                })
            })
        })
    }, [followers])

    return (
        <div className="body_left" >
            <Stories />
            {
                images.map(post => {
                    return <Posts key={post.id} id={post.id} name={post.name} imgurl={post.url} caption={post.caption} />
                })
            }
        </div>
    )
}

export default BodyLeft
