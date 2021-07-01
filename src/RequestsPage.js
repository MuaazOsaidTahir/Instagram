import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import EachRequest from './EachRequest'
import { database } from './firebase'
import Header from './Header'
import "./RequestsPage.css"

function RequestsPage() {
    const { profilename } = useParams()
    const [requestarray, setrequestarray] = useState([])
    const [requestusersdata, setrequestusersdata] = useState([])
    useEffect(() => {
        database.collection("users").doc(`${profilename}`).collection("requests").onSnapshot(snapshot => {
            setrequestarray(snapshot.docs.map((doc) => {
                return {
                    id: doc.id,
                }
            }))
        })
    }, [profilename])

    useEffect(() => {
        document.title = "Instagram⚪Requests"
    }, [])

    useEffect(() => {
        setrequestusersdata([])
        requestarray.map((user) => {
            database.collection("users").doc(`${user.id}`).get()
                .then(data => {
                    setrequestusersdata((val) => {
                        return [...val, { name: data.id, img: data.data()?.pictureURL }]
                    })
                })
        })
    }, [requestarray])

    return (
        <div className="RequestsPage" >
            <Header />
            <div className="requestpagesubcontainer" >
                <h2>Requests Lists</h2>
                {
                    requestusersdata.map((user, i) => {
                        return <EachRequest key={i} id={user.name} img={user.img} name={user.name} />
                    })
                }
            </div>
        </div>
    )
}

export default RequestsPage
