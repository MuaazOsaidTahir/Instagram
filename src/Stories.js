import React from 'react'
import Avatar from '@material-ui/core/Avatar';
import "./Stories.css"
import { useRef } from 'react';
import { useEffect } from 'react';
import AddIcon from '@material-ui/icons/Add';
import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { auth, database, storage } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import firebase from "firebase"
import { Link } from 'react-router-dom';
import FollowerStories from './FollowerStories';

function rand() {
    return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
    const top = 50 + rand();
    const left = 50 + rand();

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

function Stories() {
    const [user] = useAuthState(auth)
    const storyavatar = useRef(null)
    const [scrollleftvalue, setscrollleftvalue] = useState(0)
    const [storyimg, setstoryimg] = useState(null)
    const [userstories, setuserstories] = useState([])
    const [count, setcount] = useState(0)
    const [userimg, setuserimg] = useState("")
    const [followingusers, setfollowingusers] = useState([])
    const [followingusersdetails, setfollowingusersdetails] = useState([])

    useEffect(() => {
        storyavatar.current.addEventListener("scroll", () => {
            console.log(storyavatar.current.scrollLeft)
            setscrollleftvalue(storyavatar.current.scrollLeft)
        })
    }, [])

    const classes = useStyles();
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(false);
    const [open1, setOpen1] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen1 = () => {
        setOpen1(true);
    };

    const handleClose1 = () => {
        setOpen1(false);
    };

    const storypic = (e) => {
        setstoryimg(e.target.files[0])
    }

    const uploadingimage = () => {
        if (storyimg) {
            const uploadtask = storage.ref(`stories/${storyimg.name}`).put(storyimg)

            uploadtask.on(
                "state_changed",
                (snapshot) => {
                    const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
                    // setprogress(progress)
                },
                (error) => {
                    console.log(error)
                },
                () => {
                    storage.ref("stories").child(storyimg.name).getDownloadURL().then(url => {
                        database.collection("users").doc(`${user?.displayName}`).collection("stories").add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            imageURL: url,
                            name: user?.displayName,
                        })
                    })
                }
            )
        }
    }

    useEffect(() => {
        // setuserstories([])
        if (user) {
            database.collection("users").doc(`${user?.displayName}`).collection("stories").orderBy("timestamp", "asc").onSnapshot(snapshot => {
                setuserstories(snapshot.docs.map((doc) => {
                    // console.log(doc.data().timestamp)
                    // console.log((doc.data().timestamp?.seconds) + 300, Math.round(new Date().getTime() / 1000))
                    if (doc.data().timestamp) {
                        // console.log((doc.data().timestamp?.seconds) + 86400, Math.round(new Date().getTime() / 1000))
                        if (((doc.data().timestamp?.seconds) + 86400) <= (Math.round(new Date().getTime() / 1000))) {
                            database.collection("users").doc(`${user?.displayName}`).collection("stories").doc(`${doc.id}`).delete()
                        }
                        else {
                            return { id: doc.id, ...doc.data() }
                        }
                    }
                }))
            }
            )
        }
    }, [user])

    useEffect(() => {
        database.collection("users").doc(`${user?.displayName}`).onSnapshot(snapshot => {
            setuserimg(snapshot.data()?.pictureURL)
        })
    }, [user])

    const nextstory = (e) => {
        const { name } = e.target;
        if (name === "next" && count < userstories.length - 1) {
            setcount(count + 1)
        }
        else if (name === "back" && count > 0) {
            setcount(count - 1)
        }
    }

    useEffect(() => {
        database.collection("users").doc(`${user?.displayName}`).collection("following").onSnapshot(snapshot => {
            setfollowingusers(snapshot.docs.map((doc) => {
                return { name: doc.id }
            }))
        })
    }, [user])

    useEffect(() => {
        setfollowingusersdetails([])
        if (followingusers) {
            followingusers.map((doc) => {
                database.collection("users").doc(`${doc.name}`).onSnapshot(snapshot => {
                    setfollowingusersdetails((val) => {
                        return [...val, { name: doc.name, img: snapshot.data()?.pictureURL }]
                    })
                })
            })
        }
    }, [followingusers])

    return (
        <div className="stories" ref={storyavatar} >
            <div className={scrollleftvalue > 5 && `user_avatar`} >
                <div className="user_avatar_sub"  >
                    <Avatar src={userimg} style={{ cursor: "pointer" }} onClick={handleOpen1} className={userstories.length > 0 ? ` activeuser stories_avatar` : "no_story stories_avatar"} />
                    <>
                        {
                            userstories.length > 0 &&
                            <Modal
                                open={open1}
                                onClose={handleClose1}
                                aria-labelledby="simple-modal-title"
                                aria-describedby="simple-modal-description"
                            >
                                <div style={modalStyle} className={`${classes.paper} stories_modal_user `} >
                                    <>
                                        {
                                            count > 0 &&
                                            <button className="modal_left_arrow" name="back" onClick={nextstory} />
                                        }
                                    </>
                                    <img src={userstories[count]?.imageURL} alt="" />
                                    <div className="story_profile_details" >
                                        <Link to={`profile/${user?.displayName}`} >
                                            <Avatar src={userimg} /> <strong>{user?.displayName}</strong>
                                        </Link>
                                    </div>
                                    <>
                                        {
                                            count < userstories.length - 1 &&
                                            <button className="modal_right_arrow" name="next" onClick={nextstory} >
                                            </button>
                                        }
                                    </>
                                </div>
                            </Modal>
                        }
                    </>
                    <span style={{ cursor: "pointer" }} > <AddIcon onClick={handleOpen} /> </span>
                </div>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                >
                    <div className={`${classes.paper} story_modal`} style={modalStyle}>
                        <h2>Add Story</h2>
                        <input type="file" onChange={storypic} />
                        <button onClick={() => {
                            uploadingimage()
                            handleClose()
                            // setstoryimg(null)
                        }
                        } >Add Your Story</button>
                    </div>
                </Modal>
            </div>
            {
                followingusersdetails.map((doc, i) => {
                    return <FollowerStories key={i} name={doc.name} userimg={doc.img} />
                })
            }
        </div >
    )
}

export default Stories
