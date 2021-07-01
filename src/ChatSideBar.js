import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import ClearIcon from '@material-ui/icons/Clear';
import { useState } from 'react';
import { useEffect } from 'react';
import { auth, database } from './firebase';
import ModalSearchUsers from './ModalSearchUsers';
import { useParams } from 'react-router';
import SideBarChats from './SideBarChats';
import { useAuthState } from 'react-firebase-hooks/auth';

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
        width: "400px",
        height: "300px",
        backgroundColor: theme.palette.background.paper,
        borderRadius: "20px",
        boxShadow: theme.shadows[5],
    },
}));


function ChatSideBar() {
    const [user] = useAuthState(auth)
    const [profilename, setprofilename] = useState(user.displayName)
    const classes = useStyles();
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(false);
    const [searchuser, setsearchuser] = useState("")
    const [searchedusers, setsearchedusers] = useState([])
    const [userchats, setuserchats] = useState([])
    const [userchatdetails, setuserchatdetails] = useState([])

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const searchingusers = (e) => {
        setsearchuser(e.target.value)
    }

    useEffect(() => {
        if (searchuser) {
            setsearchedusers([])
            database.collection("users").onSnapshot(snapshot => {
                snapshot.docs.map((doc) => {
                    if (doc.id.startsWith(searchuser)) {
                        setsearchedusers((val) => {
                            return [...val, { name: doc.id, ...doc.data() }]
                        }
                        )
                    }
                })
            })
        }
        else {
            setsearchedusers([])
        }
    }, [searchuser])

    useEffect(() => {
        database.collection("users").doc(`${profilename}`).collection("Messages").onSnapshot(snapshot => {
            setuserchats(snapshot.docs.map((val) => {
                return { id: val.id, name: val.data().name }
            }))
        })
    }, [profilename])

    useEffect(() => {
        setuserchatdetails([])
        userchats.map((user) => {
            database.collection("users").doc(`${user.name}`).onSnapshot(snapshot => {
                setuserchatdetails((val) => {
                    return [...val, { img: snapshot.data().pictureURL, ...user }]
                })
            })
        })
    }, [userchats])

    return (
        <div className="messages_subcontainer_left" >
            <div className="messages_subcontainer_header" >
                <p>{user.displayName}</p><button onClick={handleOpen} ><i className="far fa-edit"></i></button>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                >
                    <div style={modalStyle} className={classes.paper} >
                        <div className="userchat_modal_header" >
                            <ClearIcon style={{ cursor: "pointer" }} onClick={handleClose} />
                            <p>New Message</p>
                            <button style={{ color: "#0095F6" }} >Next</button>
                        </div>
                        <div className="userchat_modal_search" >
                            <strong> To: </strong><input value={searchuser} onChange={searchingusers} placeholder="Search..." />
                        </div>
                        <div className="userchat_modal_searches" >
                            {
                                searchedusers.map((user, i) => {
                                    return <ModalSearchUsers user={profilename} key={i} id={user.name} name={user.name} img={user.pictureURL} />
                                })
                            }
                        </div>
                    </div>
                </Modal>
            </div>
            <div className="messages_subcontainer_messages" >
                {
                    userchatdetails.map((user) => {
                        return <SideBarChats key={user.id} id={user.id} name={user.name} img={user.img} />
                    })
                }
            </div>
        </div>
    )
}

export default ChatSideBar
