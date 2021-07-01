import React, { useEffect, useState } from 'react'
import "./FollowerStories.css"
import { database } from './firebase';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import { Link } from 'react-router-dom';


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


function FollowerStories({ name, userimg }) {
    const classes = useStyles();
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(false);
    const [usersstories, setusersstories] = useState([])
    const [count, setcount] = useState(0)

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        if (name) {
            database.collection("users").doc(`${name}`).collection("stories").orderBy("timestamp", "asc").onSnapshot(snapshot => {
                setusersstories(snapshot.docs.map((doc) => {
                    if (doc.data().timestamp) {
                        if (doc.data().timestamp) {
                            if ((((doc.data().timestamp?.seconds) + 86400) <= (Math.round(new Date().getTime() / 1000)))) {
                                database.collection("users").doc(`${name}`).collection("stories").doc(`${doc.id}`).delete()
                            }
                            else {
                                return { ...doc.data() }
                            }
                        }
                    }
                }))
            })
        }
    }, [name])

    const nextstory = (e) => {
        const { name } = e.target;
        if (name === "next" && count < usersstories.length - 1) {
            setcount(count + 1)
        }
        else if (name === "back" && count > 0) {
            setcount(count - 1)
        }
    }

    const substring = (para) => {
        return para.split("").length > 8 ? `${para.substr(0, 8)}...` : para
    }

    return (
        <div className="FollowerStories" >
            {
                usersstories.length > 0 &&
                <>
                    <Avatar className={usersstories.length > 0 ? ` followingsAvatar stories_avatar` : "stories_avatar"} src={userimg} onClick={handleOpen} />
                    <small title={name} >{substring(name)}</small>
                    <Modal
                        open={open}
                        onClose={handleClose}
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
                            <img src={usersstories[count]?.imageURL} alt="" />
                            <div className="story_profile_details" >
                                <Link to={`profile/${name}`} >
                                    <Avatar src={userimg} /> <strong>{name}</strong>
                                </Link>
                            </div>
                            <>
                                {
                                    count < usersstories.length - 1 &&
                                    <button className="modal_right_arrow" name="next" onClick={nextstory} >
                                    </button>
                                }
                            </>
                        </div>
                    </Modal>
                </>
            }
        </div>
    )
}

export default FollowerStories
