import React, { useContext, useEffect, useState } from 'react'
import { Context } from './context/Provider';
import { auth, database } from './firebase';
import "./SignUp.css"

function SignUp({ toggling }) {
    const { name, state } = useContext(Context)
    const [toggle, settoggle] = useState(false)
    const [signupdetails, setsignupdetails] = useState({
        email: "",
        fullname: "",
        username: "",
        password: "",
    })

    useEffect(() => {
        document.title = "Instagram ⚪ SignUp"
    }, [])

    const signupuser = (e) => {
        const { name, value } = e.target;
        setsignupdetails((val) => {
            return {
                ...val,
                [name]: value
            }
        })
    }

    const signup = () => {
        // console.log("here")
        // database.collection("users").onSnapshot(snapshot => {
        //     // console.log(snapshot)
        //     snapshot.docs.map(doc => {
        //         if (doc.id === signupdetails.username) {
        //             settoggle(false)
        //             alert("Username Already Taken")
        //         }
        //         else {
        //             settoggle(true)
        //         }
        //     })
        //     if(snapshot.docs.length < 1){
        //         settoggle(true)
        //     }
        // })
        settoggle(true)

        if (toggle) {
            auth.createUserWithEmailAndPassword(signupdetails.email, signupdetails.password)

            name({ username: signupdetails.username, payload: "SETTING_USERNAME" })

            setsignupdetails({
                email: "",
                fullname: "",
                username: "",
                password: "",
            })
        }
    }

    return (
        <div className="signup_outerdiv" >
            <div className="signup" >
                <img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="" />
                <input className="login_inputs" name="email" onChange={signupuser} value={signupdetails.email} placeholder="Email" />
                <input className="login_inputs" name="fullname" onChange={signupuser} value={signupdetails.fullname} placeholder="Full Name" />
                <input className="login_inputs" name="username" onChange={signupuser} value={signupdetails.username} placeholder="Username" />
                <input className="login_inputs" name="password" onChange={signupuser} value={signupdetails.password} placeholder="Password" />
                <button className="login_button" onClick={signup} >Sign Up</button>
            </div>
            <div className="signup_seconddiv">
                <p>Have an account? <span className="signuplogin_button" onClick={() => toggling(true)} >Log In</span></p>
            </div>
        </div>
    )
}

export default SignUp
