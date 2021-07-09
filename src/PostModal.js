import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Link } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import ModeCommentOutlinedIcon from '@material-ui/icons/ModeCommentOutlined';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Popover from '@material-ui/core/Popover';
import Button from '@material-ui/core/Button';
import { useContext } from 'react';
import { Context } from './context/Provider';

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

const useStyle = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        top: "0px",
        bottom: "0px",
        right: "0px",
        left: "0px",
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        outline: "none",
        height: "450px",
        width: "40rem",
        display: "flex",
        justifyContent: "space-between",
    },
}));

const useStyl = makeStyles((theme) => ({
    typography: {
        padding: theme.spacing(1.5),
    },
}));


function PostModal({ id, commentusersdetails, likepost, commentopen, commentmodalClose, imgurl, userimage, name, caption, unlike, toggle, comments, postcomments, commentpost, savedtoggle, savepost, unsavepost, deletepost }) {
    const classe = useStyle();
    const [modalStyle] = React.useState(getModalStyle);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const clas = useStyl();
    const { state } = useContext(Context)

    const handleOpenpopover = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClosepopover = () => {
        setAnchorEl(null);
    };

    const opening = Boolean(anchorEl);
    const ids = opening ? 'simple-popover' : undefined;

    return (
        <Modal
            open={commentopen}
            onClose={commentmodalClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            <div
                style={modalStyle} className={classe.paper}
            >
                <div className="commentmodal_image" >
                    <img src={imgurl} alt="Any pic" onDoubleClick={() => likepost()} />
                </div>
                <div className="commentmodal_options" >
                    <div className="commentmodal_options_header" >
                        <strong className="postcomment_header" > <Avatar src={userimage} /> <Link to={`/profile/${name}`} > {name} </Link>  </strong>
                        {
                            name === state.displayName ?
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
                                        <Button className={`${clas.typography} postdel_btn`} onClick={() => deletepost(id)} > Delete </Button>
                                    </Popover>
                                </> : null
                        }
                    </div>
                    <p> {caption} </p>
                    <div className="commentmodal_comments" >
                        {
                            commentusersdetails?.map((comment) => {
                                return <p className="commentmodalcomments" > <div className="commentmodalcomments_image" ><Avatar src={comment.img} /> </div>  <Link to={`/profile/${comment.name}`} ><h3> {comment.name} </h3></Link>  <span> {comment.usercomment} </span> </p>
                            })
                        }
                    </div>
                    <div className="post_functions" >
                        <div className="postright_functions" >
                            <button onClick={() => unlike()} className={toggle ? "active liked_button" : "liked_button"} ><i className="fas fa-heart"></i></button>
                            <ModeCommentOutlinedIcon className="post_commenticon" />
                        </div>
                        {
                            savedtoggle ?
                                <button className="save_picturebutton" onClick={() => unsavepost(id)} >
                                    <i className="fas fa-bookmark" />
                                </button> :
                                <button className="save_picturebutton" onClick={() => savepost(id)} >
                                    <i className="far fa-bookmark" />
                                </button>
                        }
                    </div>
                    <form className="post_form" >
                        <input onChange={(e) => comments(e)} value={postcomments} type="text" placeholder="Add a comment..." />
                        <button type="submit" onClick={(e) => {
                            commentpost(e)
                        }} >Post</button>
                    </form>
                </div>
            </div>
        </Modal>
    )
}

export default PostModal
