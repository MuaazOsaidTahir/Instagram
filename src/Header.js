import React, { useContext, useEffect, useState } from 'react'
import { Link } from "react-router-dom"
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import SendOutlinedIcon from '@material-ui/icons/SendOutlined';
import Avatar from '@material-ui/core/Avatar';
import "./Header.css"
import { auth, database, storage } from './firebase';
import { Context } from './context/Provider';
import firebase from "firebase"
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';

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

const useStyle = makeStyles((theme) => ({
    typography: {
        // padding: theme.spacing(2),
        width: '10rem',
    }
}));


function Header() {
    const [height, setheight] = useState(0)
    const [image, setimage] = useState(null)
    const [progress, setprogress] = useState(0)
    const { state } = useContext(Context)
    const [caption, setcaption] = useState("")
    const classes = useStyles();
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(false);
    const classe = useStyle();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [userimg, setuserimg] = useState("")
    const [userrequests, setuserrequests] = useState([])
    const [headerrequestnotification, setheaderrequestnotification] = useState([])
    const [usersearchvalue, setusersearchvalue] = useState("")
    const [searcheduserdetails, setsearcheduserdetails] = useState([])

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClosed = () => {
        setAnchorEl(null);
    };

    const opening = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        window.addEventListener("scroll", () => {
            setheight(window.scrollY)
        })
    }, [])

    const imgageupload = (e) => {
        // console.log(e.target.files[0])
        if (e.target.files[0]) {
            setimage(e.target.files[0])
        }
    }

    const uploadingimage = () => {
        const uploadtask = storage.ref(`images/${image.name}`).put(image)

        uploadtask.on(
            "state_changed",
            (snapshot) => {
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
                setprogress(progress)
            },
            (error) => {
                console.log(error)
            },
            () => {
                storage.ref("images").child(image.name).getDownloadURL().then(url => {
                    database.collection("users").doc(`${state.displayName}`).collection("posts").add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        imageURL: url,
                        caption: caption,
                        name: state.displayName,
                    })
                })
            }
        )
    }

    useEffect(() => {
        database.collection("users").doc(`${state.displayName}`).get()
            .then(user => {
                setuserimg(user.data()?.pictureURL)
            })
    }, [state])

    const body = (
        <div style={modalStyle} className={classes.paper}>
            <textarea className="uploader_caption" placeholder="Caption..." onChange={(e) => setcaption(e.target.value)} />
            <input type="file" accept=".jpg" onChange={imgageupload} />
            <button className="uploading_img" onClick={() => {
                handleClose()
                uploadingimage()
            }} >Add</button>
        </div>
    );

    useEffect(() => {
        database.collection("users").doc(`${state.displayName}`).collection("requests").onSnapshot(
            snapshot => {
                setuserrequests(snapshot.docs.map((doc) => {
                    return {
                        id: doc.id,
                    }
                }))
            }
        )
    }, [state])

    useEffect(() => {
        database.collection("users").doc(`${state.displayName}`).collection("requests").onSnapshot(snapshot => {
            setheaderrequestnotification(snapshot.docs.map((val) => {
                return {
                    id: val.id,
                }
            }))
        })
    }, [state])

    useEffect(() => {
        if (usersearchvalue) {
            setsearcheduserdetails([])
            database.collection("users").onSnapshot(snapshot => {
                snapshot.docs.map((doc) => {
                    if (doc.id.startsWith(usersearchvalue)) {
                        setsearcheduserdetails((val) => {
                            return [...val, { name: doc.id, ...doc.data() }]
                        })
                    }
                })
            })
        }
        else{
            setsearcheduserdetails([])
        }
    }, [usersearchvalue])

    return (
        <>
            {open && <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                {body}
            </Modal>}
            <div className={height > 0 ? "header header_fixed" : "header"} >
                <Link to="/" >
                    <img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="Logo" />
                </Link>
                <div className="searchinput_container" >
                    <input placeholder="Search" className="header_search" onChange={(e) => setusersearchvalue(e.target.value)} />
                    {
                        searcheduserdetails.length > 0 &&
                        <>
                            <div className="header_searchtooltipicon" />
                            <div className="header_usersearches" >
                                <div className="header_usersearchesheader" >
                                    <h5>Searches</h5>
                                </div>
                                <div className="header_usersearchesbody" >
                                    {
                                        searcheduserdetails.map((user, i) => {
                                            return <Link key={i} to={`/profile/${user.name}`} >
                                                <div className="searcheduserdetails" >
                                                    <Avatar src={user?.pictureURL} /> <strong>{user.name}</strong>
                                                </div>
                                            </Link>
                                        })
                                    }

                                </div>
                            </div>
                        </>
                    }
                </div>
                <div className="header_right" >
                    <Link to="/" >
                        <HomeOutlinedIcon className="header_home" />
                    </Link>
                    <i onClick={handleOpen} className="fas fa-plus-square"></i>
                    <Link to='/messages' >
                        <SendOutlinedIcon className="header_messages" />
                    </Link>
                    <div className="headeravatar_container" >
                        <Avatar className="header_avatar" src={userimg} onClick={handleClick} />
                        {headerrequestnotification.length > 0 && <span className="headernotification" ></span>}
                    </div>
                    <Popover
                        id={id}
                        open={opening}
                        anchorEl={anchorEl}
                        onClose={handleClosed}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
                    >
                        <Typography className={classe.typography}><ul className="header_popover" >
                            <li> <Link to={`/profile/${state.displayName}`} > <i className="far fa-user-circle"></i> <span>Profile</span></Link></li>
                            <li><Link to={`/profile/${state.displayName}`} > <i className="far fa-bookmark"></i> <span>Saved</span></Link> </li>
                            <li className="request_list" > <Link to={`/requests/${state.displayName}`} > Requests </Link> {userrequests.length > 0 && <span>{userrequests.length > 0 && userrequests.length}</span>} </li>
                            <li className="header_signout" onClick={() => auth.signOut()} >Log Out</li>
                        </ul></Typography>
                    </Popover>

                </div>

            </div>
            <div className="image_bar" style={{ width: `${progress}%` }} ></div>
        </>
    )
}

export default Header
