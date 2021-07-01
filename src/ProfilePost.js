import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { database } from './firebase';
import "./ProfilePost.css"
import FavoriteIcon from '@material-ui/icons/Favorite';
import ModeCommentIcon from '@material-ui/icons/ModeComment';
import PostModal from './PostModal';
import { Context } from './context/Provider';

function ProfilePost({ url, id, caption, name }) {
    const { state } = useContext(Context)
    const { profilename } = useParams();
    const [like, setlike] = useState([])
    const [comment, setcomment] = useState([])
    const [userimage, setuserimage] = useState("")
    const [toggle, settoggle] = useState(false)
    const [commentopen, setcommentOpen] = React.useState(false);
    const [postcomments, setpostcomments] = useState("")
    const [commentdetails, setcommentdetails] = useState([])
    const [commentusersdetails, setcommentusersdetails] = useState([])
    const [savedtoggle, setsavedtoggle] = useState(false)
    const [checkingsavedpost, setcheckingsavedpost] = useState([])

    useEffect(() => {
        if (name) {
            database.collection("users").doc(`${name}`).collection("posts").doc(`${id}`).collection("likes").onSnapshot(snapshot => {
                setlike(snapshot.docs.map((doc) => {
                    return {
                        id: doc.id,
                    }
                }))
            })
        }
        else {
            database.collection("users").doc(`${profilename}`).collection("posts").doc(`${id}`).collection("likes").onSnapshot(snapshot => {
                setlike(snapshot.docs.map((doc) => {
                    return {
                        id: doc.id,
                    }
                }))
            })
        }

    }, [profilename, id, name])

    useEffect(() => {
        like.map((user) => {
            if (user.id === state.displayName) {
                settoggle(true)
            }
        })
    }, [like, state])

    useEffect(() => {
        if (name) {
            database.collection("users").doc(`${name}`).collection("posts").doc(`${id}`).collection("comments").onSnapshot(snapshot => {
                setcomment(snapshot.docs.map((doc) => {
                    return {
                        id: doc.id,
                        comment: doc.data().comment
                    }
                }))
            })
        } else {
            database.collection("users").doc(`${profilename}`).collection("posts").doc(`${id}`).collection("comments").onSnapshot(snapshot => {
                setcomment(snapshot.docs.map((doc) => {
                    return {
                        id: doc.id,
                        comment: doc.data().comment
                    }
                }))
            })
        }
    }, [profilename, id, name])

    useEffect(() => {
        if (name) {
            database.collection("users").doc(`${name}`).get()
                .then(user => {
                    setuserimage(user.data()?.pictureURL)
                })
        }
        else {
            database.collection("users").doc(`${profilename}`).get()
                .then(user => {
                    setuserimage(user.data()?.pictureURL)
                })
        }
    }, [profilename, name])

    const unlike = () => {
        settoggle(false)
        if (name) {
            database.collection("users").doc(`${name}`).collection("posts").doc(`${id}`).collection("likes").doc(`${state.displayName}`).delete()
        }
        else {
            database.collection("users").doc(`${profilename}`).collection("posts").doc(`${id}`).collection("likes").doc(`${state.displayName}`).delete()
        }
    }

    const liked = () => {
        settoggle(true)
        if (name) {
            database.collection("users").doc(`${name}`).collection("posts").doc(`${id}`).collection("likes").doc(`${state.displayName}`).set({
                name: state.displayName
            })
        } else {
            database.collection("users").doc(`${profilename}`).collection("posts").doc(`${id}`).collection("likes").doc(`${state.displayName}`).set({
                name: state.displayName
            })
        }
    }

    const commentmodalOpen = () => {
        setcommentOpen(true);
    };

    const commentmodalClose = () => {
        setcommentOpen(false);
    };

    const comments = (e) => {
        setpostcomments(e.target.value)
    }

    const commentpost = (e) => {
        e.preventDefault()
        if (name) {
            database.collection("users").doc(`${name}`).collection("posts").doc(`${id}`).collection("comments").doc(`${state.displayName}`).set({
                name: state.displayName,
                comment: postcomments,
            })
        } else {
            database.collection("users").doc(`${profilename}`).collection("posts").doc(`${id}`).collection("comments").doc(`${state.displayName}`).set({
                name: state.displayName,
                comment: postcomments,
            })
        }

        setpostcomments("")
    }

    useEffect(() => {
        if (name) {
            database.collection("users").doc(`${name}`).collection("posts").doc(`${id}`).collection("comments").onSnapshot(snapshot => {
                setcommentdetails(snapshot.docs.map((doc) => {
                    return {
                        name: doc.id,
                        comment: doc.data().comment,
                    }
                }))
            })
        }
        else {
            database.collection("users").doc(`${profilename}`).collection("posts").doc(`${id}`).collection("comments").onSnapshot(snapshot => {
                setcommentdetails(snapshot.docs.map((doc) => {
                    return {
                        name: doc.id,
                        comment: doc.data().comment,
                    }
                }))
            })
        }
    }, [profilename, id, name])

    useEffect(() => {
        setcommentusersdetails([])
        commentdetails.map((val) => {
            database.collection("users").doc(`${val.name}`).get()
                .then(user => {
                    setcommentusersdetails((value) => {
                        return [...value, { img: user.data()?.pictureURL, usercomment: val.comment, name: val.name }]
                    })
                })
        })
    }, [commentdetails])

    useEffect(() => {
        if (name) {
            setsavedtoggle(true);
        }
        else {
            database.collection("users").doc(`${state.displayName}`).collection("saved").onSnapshot(snapshot => {
                setcheckingsavedpost(snapshot.docs.map(doc => (
                    { id: doc.id }
                )))
            })
        }
    }, [name, state, id])

    useEffect(() => {
        checkingsavedpost.map(post => {
            if (post.id === id) {
                setsavedtoggle(true)
            }
        })
    }, [checkingsavedpost, id])

    const savepost = (_id) => {
        database.collection("users").doc(`${state.displayName}`).collection("saved").doc(`${_id}`).set({
            name: profilename,
            id: _id,
        })
        setsavedtoggle(true)
    }

    const unsavepost = (_id) => {
        database.collection("users").doc(`${state.displayName}`).collection("saved").doc(`${_id}`).delete();
        setsavedtoggle(false)
    }

    return (
        <>
            <div className="ProfilePost" onClick={commentmodalOpen} >
                <img src={url} alt="" />
                <p><span><FavoriteIcon />{like.length}</span> <span><ModeCommentIcon />{comment.length}</span> </p>
            </div>
            <PostModal id={id} imgurl={url} caption={caption} name={name ? name : profilename} userimage={userimage} toggle={toggle} unlike={unlike} commentopen={commentopen} commentmodalClose={commentmodalClose} postcomments={postcomments} commentpost={commentpost} comments={comments} likepost={liked} commentusersdetails={commentusersdetails} savedtoggle={savedtoggle} savepost={savepost} unsavepost={unsavepost} />
        </>
    )
}

export default ProfilePost
