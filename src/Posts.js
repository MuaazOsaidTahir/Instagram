import React, { useContext, useEffect, useState } from 'react'
import Avatar from '@material-ui/core/Avatar';
import ModeCommentOutlinedIcon from '@material-ui/icons/ModeCommentOutlined';
import "./Posts.css"
import { Context } from './context/Provider';
import { Link } from 'react-router-dom';
import { database } from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Popover from '@material-ui/core/Popover';
import Button from '@material-ui/core/Button';
import PostModal from './PostModal';

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
        boxShadow: theme.shadows[5],
        borderRadius: "10px",
        height: "20rem",
        display: "flex",
        flexDirection: "column",
        outline: "none"
    },
}));

const useStyl = makeStyles((theme) => ({
    typography: {
        padding: theme.spacing(1.5),
    },
}));

function Posts({ id, name, imgurl, caption }) {
    const [toggle, settoggle] = useState(false)
    const [moretoggle, setmoretoggle] = useState(false)
    const [userimage, setuserimage] = useState("")
    const [picturesdata, setpicturesdata] = useState([])
    const [userdetails, setuserdetails] = useState([])
    const [postcomments, setpostcomments] = useState("")
    const [commentsdata, setcommentsdata] = useState([])
    const [randomcomment, setrandomcomment] = useState([])
    const [randomnumbercomment, setrandomnumbercomment] = useState(0)
    const [commentusersdetails, setcommentusersdetails] = useState([])
    const [savedtoggle, setsavedtoggle] = useState(false)
    const { state } = useContext(Context)
    const classes = useStyles();
    // const classe = useStyle();
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(false);
    const [commentopen, setcommentOpen] = React.useState(false);
    const clas = useStyl();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const commentmodalOpen = () => {
        setcommentOpen(true);
    };

    const commentmodalClose = () => {
        setcommentOpen(false);
    };

    const showlikes = () => {
        handleOpen();
    }

    const handleOpenpopover = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClosepopover = () => {
        setAnchorEl(null);
    };

    const opening = Boolean(anchorEl);
    const ids = opening ? 'simple-popover' : undefined;

    const liked = () => {
        settoggle(true);
        // console.log(id)
        database.collection("users").doc(`${name}`).collection("posts").doc(`${id}`).collection("likes").doc(`${state.displayName}`).set({
            name: state.displayName,
        })
    }

    useEffect(() => {
        database.collection("users").doc(`${name}`).collection("posts").doc(`${id}`).collection("likes").onSnapshot(snapshot => {
            setpicturesdata(snapshot.docs.map(like => {
                return {
                    name: like.data().name,
                }
            }))
        })
    }, [name, id])

    useEffect(() => {
        picturesdata.map((val) => {
            if (val.name === state.displayName) {
                settoggle(true);
            }
        })
    }, [picturesdata])

    useEffect(() => {
        const abortController = new AbortController();
        picturesdata.map((value) => {
            setuserdetails([])
            database.collection("users").doc(`${value.name}`).get()
                .then(user => {
                    // console.log(user.data())
                    setuserdetails((val) => {
                        return [...val, { name: value.name, img: user.data().pictureURL }]
                    })
                })
                .catch(err => {
                    console.log(err);
                })
        })
        return () => {
            abortController.abort();
        };
    }, [name, picturesdata])

    const unlike = () => {
        if (toggle) {
            settoggle(false)
        }

        database.collection("users").doc(`${name}`).collection("posts").doc(`${id}`).collection("likes").doc(`${state.displayName}`).delete()
    }

    const comments = (e) => {
        const { value } = e.target;
        setpostcomments(value);
    }

    const commentpost = (e) => {
        e.preventDefault();
        database.collection("users").doc(`${name}`).collection("posts").doc(`${id}`).collection("comments").doc(`${state.displayName}`).set({
            name: state.displayName,
            comment: postcomments,
        })
        setpostcomments("")
    }

    useEffect(() => {
        database.collection("users").doc(`${name}`).collection("posts").doc(`${id}`).collection("comments").onSnapshot(snapshot => {
            setcommentsdata(snapshot.docs.map((comment => {
                return {
                    commentname: comment.data().name,
                    usercomment: comment.data().comment,
                }
            })))
        })
    }, [name, id])

    useEffect(() => {
        const abortController = new AbortController();
        commentsdata.map((value) => {
            setcommentusersdetails([])
            // console.log(value.commentname)
            database.collection("users").doc(`${value.commentname}`).get()
                .then(user => {
                    // console.log(user.data())
                    setcommentusersdetails((val) => {
                        return [...val, { name: value.commentname, usercomment: value.usercomment, img: user.data().pictureURL }]
                    })
                })
                .catch(err => console.log(err));
        })
        return () => {
            abortController.abort();
        };

    }, [commentsdata])

    useEffect(() => {
        if (commentusersdetails.length > 0) {
            setrandomnumbercomment(Math.floor(Math.random() * commentusersdetails.length))
            setrandomcomment((val) => {
                return [commentusersdetails[randomnumbercomment]]
            })
        }
    }, [commentusersdetails, commentsdata, randomnumbercomment])

    useEffect(() => {
        database.collection("users").doc(`${name}`).get()
            .then(user => {
                setuserimage(user.data().pictureURL)
            })
            .catch(err => console.log(err))
    }, [name])

    const substring = (string) => {
        return string.split("").length > 30 ? `${string.substr(0, 30)}...` : string
    }

    const deletingpost = () => {
        database.collection("users").doc(`${name}`).collection("posts").doc(`${id}`).delete()
    }

    const savetouserscollection = () => {
        database.collection("users").doc(`${state.displayName}`).collection("saved").doc(`${id}`).set({
            id: id,
            name: name,
        })
    }

    useEffect(() => {
        database.collection("users").doc(`${state.displayName}`).collection("saved").onSnapshot(snapshot => {
            snapshot.docs.map((doc) => {
                if (doc.id === id) {
                    setsavedtoggle(true)
                }
            })
        })
    }, [id, state])

    const deletefromsaved = () => {
        database.collection("users").doc(`${state.displayName}`).collection("saved").doc(`${id}`).delete()
        setsavedtoggle(false)
    }

    return (
        <div className="posts" >
            <div className="post_header" >
                <div>
                    <Avatar src={userimage} />
                    <Link to={`/profile/${name}`} >
                        <h4>{name}</h4>
                    </Link>
                </div>
                {name === state.displayName ?
                    <>
                        <IconButton onClick={handleOpenpopover} >
                            <MoreVertIcon />
                        </IconButton>
                        <Popover
                            id={ids}
                            open={opening}
                            anchorEl={anchorEl}
                            onClose={handleClosepopover}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                            }}
                        >
                            <Button className={`${clas.typography} postdel_btn`} onClick={deletingpost} > Delete </Button>
                        </Popover>
                    </> : null
                }
            </div>
            <img onDoubleClick={liked} src={imgurl} alt="" />
            <div className="post_footer" >
                <div className="post_functions" >
                    <div className="postright_functions" >
                        <button onClick={unlike} className={toggle ? "active liked_button" : "liked_button"} ><i className="fas fa-heart"></i></button>
                        <ModeCommentOutlinedIcon className="post_commenticon" />
                    </div>
                    {
                        savedtoggle ?
                            <button className="save_picturebutton" onClick={deletefromsaved} >
                                <i className="fas fa-bookmark" />
                            </button> :
                            <button className="save_picturebutton" onClick={savetouserscollection} >
                                <i className="far fa-bookmark" />
                            </button>
                    }
                </div>
                <p className="post_showlikes" style={{ margin: "0px" }} onClick={showlikes} ><strong>{picturesdata.length}</strong>{picturesdata.length > 1 ? " likes" : " like"}</p>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                >
                    <div style={modalStyle} className={classes.paper}>
                        <div className="postmodal_header" >
                            <h3>Likes</h3>
                        </div>
                        <div className="postmodal_body" >
                            <ul className="postmodal_lists" >
                                {
                                    userdetails.length > 0 &&
                                    userdetails?.map((val, i) => {
                                        // console.log(val)
                                        return <li key={i} className="likesmodal_data" > <Avatar src={val.img} /> <Link to={`/profile/${val.name}`} > <strong> {val.name} </strong></Link> </li>
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                </Modal>
                <span className="post_caption" ><strong><Link to={`/profile/${name}`} >{name}</Link></strong> <span> {moretoggle ? caption : substring(caption)}</span> {caption.split("").length > 30 ? <button onClick={() => setmoretoggle(!moretoggle)} > {moretoggle ? "less" : "more"} </button> : ""} </span>
                <p className="comment_modal" onClick={() => commentmodalOpen()} >View all {commentusersdetails.length} {commentusersdetails.length > 1 ? "comments" : "comment"}</p>
                <div className="post_comments" >
                    {
                        randomcomment.length > 0 &&
                        randomcomment?.map((val, i) => {
                            // console.log(val.img)
                            return <div key={i} className="postcomments_container" >
                                <small> {`${randomnumbercomment + 1} of ${commentusersdetails.length}`} </small>
                                <Avatar src={val?.img} />
                                <span className="post_comment" ><Link to={`/profile/${val?.name}`} ><h4>{val?.name}</h4></Link> <span>{val?.usercomment}</span> </span>
                            </div>
                        })
                    }
                </div>
                <PostModal commentusersdetails={commentusersdetails} commentopen={commentopen} commentmodalClose={commentmodalClose} imgurl={imgurl} userimage={userimage} name={name} caption={caption} unlike={unlike} toggle={toggle} comments={comments} likepost={liked} postcomments={postcomments} commentpost={commentpost} />
            </div>
            <form className="post_form" >
                <input onChange={comments} value={postcomments} type="text" placeholder="Add a comment..." />
                <button type="submit" onClick={commentpost} >Post</button>
            </form>
        </div>
    )
}

export default Posts
