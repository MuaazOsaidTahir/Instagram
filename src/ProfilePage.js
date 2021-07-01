import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import Avatar from '@material-ui/core/Avatar';
import { database, storage } from './firebase';
import "./ProfilePage.css"
import { Context } from './context/Provider';
import ProfileDetails from './ProfileDetails';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { Link } from 'react-router-dom';
import { useRef } from 'react';

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        width: "30rem",
        height: "20rem"
    },
}));

function ProfilePage() {
    const ref = useRef(null)
    const { profilename } = useParams();
    const [profilepic, setprofilepic] = useState("")
    const [image, setimage] = useState({})
    const { state } = useContext(Context)
    const [userposts, setuserposts] = useState([])
    const [userbio, setuserbio] = useState("")
    const [updatebio, setupdatebio] = useState("")
    const [privatetoggle, setprivatetoggle] = useState(false)
    const [userprivatechecker, setuserprivatechecker] = useState("")
    const [currentfollower, setcurrentfollower] = useState("")
    const [userprivatecheckerinitial, setuserprivatecheckerinitial] = useState("")
    const [userfollowers, setuserfollowers] = useState([])
    const [followersdetails, setfollowersdetails] = useState([])
    const [userfollowings, setuserfollowings] = useState([])
    const [followingsdetails, setfollowingsdetails] = useState([])

    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [open1, setOpen1] = React.useState(false);
    const [open2, setOpen2] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen1 = () => {
        if (currentfollower === "Follower" || profilename === state.displayName || userprivatecheckerinitial === "no") {
            setOpen1(true);
        }
    };

    const handleClose1 = () => {
        setOpen1(false);
    };

    const handleOpen2 = () => {
        if (currentfollower === "Follower" || profilename === state.displayName || userprivatecheckerinitial === "no") {
            setOpen2(true);
        }
    };

    const handleClose2 = () => {
        setOpen2(false);
    };

    const picture = (e) => {
        if (e.target.files[0]) {
            setimage(e.target.files[0])
            setTimeout(() => {
                ref.current.click();
            }, 1000);
        }

    }

    const upload = () => {
        const uploadtask = storage.ref(`images/${image.name}`).put(image);
        uploadtask.on(
            "state_changed",
            () => {
                storage.ref("images").child(image.name).getDownloadURL()
                    .then(url =>
                        database.collection("users").doc(`${profilename}`).set({
                            pictureURL: url,
                            bio: "",
                        })
                    )
            }
        )
    }

    useEffect(() => {
        document.title = `@${profilename}.Photos`
    }, [profilename])

    useEffect(() => {
        database.collection("users").doc(`${profilename}`).onSnapshot(snapshot => {
            setprofilepic(snapshot.data()?.pictureURL)
        })
    }, [profilename])

    useEffect(() => {
        database.collection("users").doc(`${profilename}`).collection("posts").onSnapshot(snapshot => {
            setuserposts(snapshot.docs.map((post) => {
                return {
                    id: post.id
                }
            }))
        })
    }, [profilename])

    useEffect(() => {
        database.collection("users").doc(`${profilename}`).onSnapshot(snapshot => {
            setupdatebio(snapshot.data().bio)
            setuserbio(snapshot.data().bio)
        })
    }, [profilename])

    useEffect(() => {
        database.collection("users").doc(`${profilename}`).collection("privateaccount").doc("privatetoggle").onSnapshot(snapshot => {
            if (snapshot.data().decision === "yes") {
                setprivatetoggle(true)
            }
            else if (snapshot.data().decision === "no") {
                setprivatetoggle(false)
            }
        })
    }, [profilename])

    const bio = (e) => {
        setuserbio(e.target.value);
    }

    const addbio = () => {
        database.collection("users").doc(`${profilename}`).update({
            bio: userbio,
        })

        if (privatetoggle) {
            database.collection("users").doc(`${state.displayName}`).collection("privateaccount").doc(`privatetoggle`).set({
                decision: "yes"
            })
        } else if (privatetoggle === false) {
            database.collection("users").doc(`${state.displayName}`).collection("privateaccount").doc(`privatetoggle`).set({
                decision: "no"
            })
        }

        setprivatetoggle(false)
        setuserbio("")
        handleClose()
    }

    const followuser = () => {
        database.collection("users").doc(`${profilename}`).collection("privateaccount").doc("privatetoggle").get()
            .then(privateuser => {
                setuserprivatechecker(privateuser.data().decision)
            })
            .catch(err => console.log(err))
    }

    const unfollowuser = () => {
        database.collection("users").doc(`${profilename}`).collection("followers").doc(`${state.displayName}`).delete()
        database.collection("users").doc(`${state.displayName}`).collection("following").doc(`${profilename}`).delete()
        setcurrentfollower("")
    }

    const delrequest = () => {
        database.collection("users").doc(`${profilename}`).collection("requests").doc(`${state.displayName}`).delete()
        setcurrentfollower("")
    }

    useEffect(() => {
        if (profilename !== state.displayName) {
            if (userprivatechecker === "yes") {
                database.collection("users").doc(`${profilename}`).collection("requests").doc(`${state.displayName}`).set({
                    name: state.displayName
                })
                setcurrentfollower("Request")
            }
            else if (userprivatechecker === "no") {
                database.collection("users").doc(`${profilename}`).collection("followers").doc(`${state.displayName}`).set({
                    name: state.displayName,
                })

                database.collection("users").doc(`${state.displayName}`).collection("following").doc(`${profilename}`).set({
                    name: profilename,
                })
                setcurrentfollower("Follower")
            }
        }
    }, [userprivatechecker, profilename, state])

    useEffect(() => {
        database.collection("users").doc(`${profilename}`).collection("privateaccount").doc("privatetoggle").get()
            .then(privateuser => {
                setuserprivatecheckerinitial(privateuser.data().decision)
            })
            .catch(err => console.log(err))
    }, [profilename])

    useEffect(() => {
        database.collection("users").doc(`${profilename}`).collection("followers").onSnapshot(snapshot => {
            snapshot.docs.map((user) => {
                if (user.id === state.displayName) {
                    setcurrentfollower("Follower")
                }
            })
        })

        database.collection("users").doc(`${profilename}`).collection("requests").onSnapshot(snapshot => {
            snapshot.docs.map((user) => {
                if (user.id === state.displayName) {
                    setcurrentfollower("Request")
                }
            })
        })
    }, [profilename, state])

    useEffect(() => {
        database.collection("users").doc(`${profilename}`).collection("followers").onSnapshot(snapshot => {
            setuserfollowers(snapshot.docs.map((doc) => {
                return {
                    name: doc.id,
                }
            }))
        })
    }, [profilename])

    useEffect(() => {
        setfollowersdetails([])
        userfollowers.map((user) => {
            database.collection("users").doc(`${user.name}`).onSnapshot(snapshot => {
                setfollowersdetails((val) => {
                    return [...val, { img: snapshot.data()?.pictureURL, name: user.name }]
                })

            })
        })
    }, [userfollowers])

    useEffect(() => {
        database.collection("users").doc(`${profilename}`).collection("following").onSnapshot(snapshot => {
            setuserfollowings(snapshot.docs.map((doc) => {
                return {
                    name: doc.id,
                }
            }))
        })
    }, [profilename])

    useEffect(() => {
        setfollowingsdetails([])
        userfollowings.map((val) => {
            database.collection("users").doc(`${val.name}`).onSnapshot(snapshot => {
                setfollowingsdetails((value) => {
                    return [...value, { name: val.name, ...snapshot.data() }]
                })
            })
        })
    }, [userfollowings])

    return (
        <div className="profile" >
            <div className="profile_headercover" >
                <div className="profile_header" >
                    <div className="profileimg_uploader" >
                        <button className="profileimg_button" title={profilename === state.displayName && "Add a profile photo"} >
                            <Avatar src={profilepic} />
                            {
                                profilename === state.displayName ?
                                    <input type="file" onChange={picture} /> : null
                            }
                        </button>
                    </div>
                    {
                        profilename === state.displayName ?
                            <button ref={ref} className="profile_imguploader" onClick={() => upload()} >Upload</button> : null
                    }
                </div>
                <div className="profile_details" >
                    <div className="profile_username" >
                        <p> {profilename} </p>
                        {
                            state.displayName === profilename ?
                                <>
                                    <button className="profile_editbtn" onClick={handleOpen} > Edit Profile </button>
                                    <Modal
                                        aria-labelledby="transition-modal-title"
                                        aria-describedby="transition-modal-description"
                                        className={classes.modal}
                                        open={open}
                                        onClose={handleClose}
                                        closeAfterTransition
                                        BackdropComponent={Backdrop}
                                        BackdropProps={{
                                            timeout: 500,
                                        }}
                                    >
                                        <Fade in={open}>
                                            <div className={`${classes.paper} edit_modal`}>
                                                <h2>Add your Bio</h2>
                                                <textarea className="edit_textarea" value={userbio} onChange={bio} placeholder="Add a Bio..." />
                                                <div className="privatetoggle" >
                                                    <h4>Private Account</h4>
                                                    <label className="switch">
                                                        <input defaultChecked={privatetoggle} type="checkbox" onClick={() => setprivatetoggle(!privatetoggle)} />
                                                        <span className="slider round"></span>
                                                    </label>
                                                </div>
                                                <button onClick={addbio}> Save Changes </button>
                                            </div>
                                        </Fade>
                                    </Modal>
                                </>

                                : currentfollower === "" ? <button onClick={followuser} className="proflie_followerbtn" > Follow </button> : currentfollower === "Follower" ?
                                    <button className="profileunfollowebtn" onClick={unfollowuser} > Unfollow </button> : currentfollower === "Request" ? <button className="profileunfollowebtn" onClick={delrequest} > Requested </button> : null
                        }
                    </div>
                    <div className="profile_followers" >
                        <div className="profile_followersdata" >
                            <p><strong>{userposts.length}</strong> posts </p> <p><strong style={{ cursor: "pointer" }} onClick={handleOpen1} >{userfollowers.length}</strong> followers </p><Modal
                                open={open1}
                                onClose={handleClose1}
                                className={classes.modal}
                                aria-labelledby="simple-modal-title"
                                aria-describedby="simple-modal-description"
                            >
                                <div className={`${classes.paper} followers_modal `} >
                                    <p> Followers </p>
                                    {
                                        followersdetails.length > 0 ?
                                            <div className="followermodal" >
                                                {
                                                    followersdetails.map((follower, i) => {
                                                        return <Link key={i} onClick={handleClose1} to={`/profile/${follower.name}`} >
                                                            <div className="follower_list" > <Avatar src={follower.img} />
                                                                <strong> {follower.name} </strong></div>
                                                        </Link>
                                                    })
                                                }
                                            </div> : state.displayName === profilename ? <div className="follower_notification" >
                                                <p>You'll see all the followers that follow you here.</p>
                                            </div> : <div className="follower_notification" >
                                                <p> You will see {profilename} followers here. </p>
                                            </div>
                                    }
                                </div>
                            </Modal> <p><strong style={{ cursor: "pointer" }} onClick={handleOpen2} >{followingsdetails.length}</strong>  following </p>
                            <Modal
                                open={open2}
                                onClose={handleClose2}
                                className={classes.modal}
                                aria-labelledby="simple-modal-title"
                                aria-describedby="simple-modal-description"
                            >
                                <div className={`${classes.paper} followers_modal `} >
                                    <p> Followings </p>
                                    {
                                        followingsdetails.length > 0 ?
                                            <div className="followermodal" >
                                                {
                                                    followingsdetails.map((following, i) => {
                                                        return <Link key={i} onClick={handleClose2} to={`/profile/${following.name}`} >
                                                            <div className="follower_list" > <Avatar src={following?.pictureURL} />
                                                                <strong> {following.name} </strong> </div>
                                                        </Link>
                                                    })
                                                }
                                            </div> : state.displayName === profilename ? <div className="follower_notification" >
                                                <p>You'll see all the people that you are following here.</p>
                                            </div> : <div className="follower_notification" >
                                                <p>You will see {profilename} followings here.</p>
                                            </div>
                                    }
                                </div>
                            </Modal>
                        </div>
                        <pre> {updatebio.trim()} </pre>
                    </div>
                </div>
            </div>
            {
                currentfollower === "Follower" || state.displayName === profilename || userprivatecheckerinitial === "no" ?
                    <ProfileDetails /> : <div className="unfollower_text" >
                        <h4>Private Account</h4>
                        <p>Follow to see their photos.</p>
                    </div>

            }
        </div>
    )
}

export default ProfilePage
