import React, { useEffect, useState } from 'react'
import { auth, database } from './firebase'
import UserSuggestions from './UserSuggestions'
import { useAuthState } from 'react-firebase-hooks/auth';

function BodyRight() {
    const [user] = useAuthState(auth)
    const [users, setusers] = useState([])
    const [randomusers, setrandomusers] = useState([])
    const [filteredusers, setfilteredusers] = useState([])

    useEffect(() => {
        database.collection("users").onSnapshot(snapshot => {
            setusers(snapshot.docs.map((doc) => {
                if (doc.id !== "Samreenkiani12" && doc.id !== undefined) {
                    return { name: doc.id, ...doc.data() }
                }
            }))
        })

        // setusers((val) => {
        //     return val.filter((val, i) => {
        //         return val.name !== "Samreenkiani12"
        //     }
        //     )
        // })
    }, [])

    // useEffect(() => {
    //     setfilteredusers((val) => {
    //         users.map(())
    //     })
    // }, [users])

    useEffect(() => {
        setrandomusers([users[Math.floor(Math.random() * users.length)]])
    }, [users, user])


    return (
        <div className="body_left" >
            <h1>Suggestions</h1>
            {
                randomusers.map((random, i) => {
                    return <UserSuggestions key={i} name={random?.name} img={random?.pictureURL} />
                })
            }
        </div>
    )
}

export default BodyRight
