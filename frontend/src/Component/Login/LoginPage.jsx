import React, { useContext, useState } from 'react'
import { GlobalContext } from '../../App';
import { GoogleAuthProvider, signInWithPopup, updateProfile } from 'firebase/auth';
import { CircularProgress } from '@mui/material';
import SignUpForm from './SignUpForm';
import LoginForm from './LoginForm';
import google from '../../Images/google-logo.png'
import '../../CSS/Login/loginpage.css'
import { auth } from '../Firebase';

const LoginPage = ({ authTrace, setAuthTrace, setIsForgot }) => {

    const { notify } = useContext(GlobalContext);

    const [socialLoader, setSocialLoader] = useState(false)
    const [loader, setLoader] = useState(false)

    const socialLogin = async () => {
        try {
            setSocialLoader(true)
            const googleProvider = new GoogleAuthProvider()
            await signInWithPopup(auth, googleProvider);
            if (auth.currentUser.photoURL.startsWith("https://")) {
                await updateProfile(auth.currentUser, {
                    photoURL: JSON.stringify({
                        userLink: "https://res.cloudinary.com/dgun0lg7q/image/upload/v1752855927/1_wjyymp.jpg",
                        public_id: "",
                    })
                })
            }
            setSocialLoader(false)
            setAuthTrace("")
            document.body.removeAttribute("class")
        } catch (error) {
            const actualerror = error.message.split("/")[1].split(")")[0] || "Something went wrong";
            notify(actualerror, "error")
            setSocialLoader(false)
        }
    }

    return <section className="hero-login-signup-con login-dialog">
        <div>
            <div className='login-signup'>
                <div className="login-signup-header">
                    <div>Sign up to download unlimited full resolution media</div>
                    <div onClick={() => {
                        if (!socialLoader && !loader) {
                            setAuthTrace("")
                            document.body.removeAttribute("class")
                        }
                    }}><i className="ri-close-line"></i></div>
                </div>
                <div className="login-signup-body">
                    <div className="login-signup-upper">
                        <div className="login-signup-option">
                            <button onClick={() => { if (!loader) { setAuthTrace("signup") } }} className={authTrace === "signup" ? 'clicked-btn' : ""}>Sign up</button>
                            <button onClick={() => { if (!loader) { setAuthTrace("login") } }} className={authTrace === "login" ? 'clicked-btn' : ""}>Log in</button>
                        </div>
                        <div className="social-login" onClick={() => {
                            if (!socialLoader && !loader) {
                                socialLogin()
                            }
                        }}>
                            <img src={google} alt="google" />
                            {socialLoader ? <div className="text" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <CircularProgress color='white' size={20} />
                            </div> : <div className="text">
                                Continue with Google
                            </div>}
                        </div>
                        <div className="hor-line">
                            <span></span>
                            <span>or</span>
                            <span></span>
                        </div>
                    </div>
                    {authTrace === "signup" ? <SignUpForm setAuthTrace={setAuthTrace} socialLoader={socialLoader} loader={loader} setLoader={setLoader} /> : <LoginForm setAuthTrace={setAuthTrace} socialLoader={socialLoader} loader={loader} setLoader={setLoader} setIsForgot={setIsForgot} />}
                </div>
            </div>
        </div>
    </section>
}

export default LoginPage