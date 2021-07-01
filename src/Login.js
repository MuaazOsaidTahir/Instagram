import React, { useEffect, useState } from 'react'
import "./Login.css"
import Carousel from 'react-bootstrap/Carousel'
import SignUp from './SignUp'
import { auth } from './firebase'

function Login() {
    const [toggle, settoggle] = useState(true)
    const [logindetails, setlogindetails] = useState({
        email: "",
        password: "",
    })

    useEffect(() => {
        document.title = "Instagram⚪LogIn"
    }, [])

    const toggled = (para) => {
        settoggle(para);
    }

    const logincredentials = (e) => {
        const { name, value } = e.target;
        setlogindetails((val) => {
            return {
                ...val,
                [name]: value
            }
        })
    }

    const loginuser = (e) => {
        e.preventDefault()
        auth.signInWithEmailAndPassword(logindetails.email, logindetails.password)
    }

    return (
        <div className="login" >
            <Carousel>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src="https://www.instagram.com/static/images/homepage/screenshot2.jpg/6f03eb85463c.jpg"
                        alt="First slide"
                    />
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src="https://www.instagram.com/static/images/homepage/screenshot1.jpg/d6bf0c928b5a.jpg"
                        alt="Second slide"
                    />
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src="https://www.instagram.com/static/images/homepage/screenshot4.jpg/842fe5699220.jpg"
                        alt="Third slide"
                    />
                </Carousel.Item>
            </Carousel>
            <div className="login_innerdiv" >
                <img src="https://www.instagram.com/static/images/homepage/home-phones.png/38825c9d5aa2.png" alt="" />
                {
                    toggle ?
                        <div className="login_formdiv" >
                            <form>
                                <img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="logo" />
                                <input className="login_inputs" name="email" onChange={logincredentials} type="text" value={logindetails.email} placeholder="Email" />
                                <input className="login_inputs" name="password" type="password" onChange={logincredentials} value={logindetails.password} placeholder="Password" />
                                <button className="login_button" onClick={loginuser} >Log In</button>
                            </form>
                            <div style={{ position: "relative" }} >
                                <div className="login_divider" ></div>
                                <p className="login_dividertext" >OR</p>
                            </div>
                            <p className="login_signup" >Don't have an account? <span onClick={() => settoggle(false)} >Sign Up</span></p>
                        </div> : <SignUp toggling={toggled} />
                }
            </div>
        </div>
    )
}

export default Login
