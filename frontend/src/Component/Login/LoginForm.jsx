import React, { useContext, useState } from 'react'
import { GlobalContext } from '../../App';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { CircularProgress } from '@mui/material';
import { auth } from '../Firebase';

const LoginForm = ({ setAuthTrace, socialLoader, loader, setLoader, setIsForgot }) => {
    const { notify } = useContext(GlobalContext);

    const [eye, setEye] = useState(false);

    const [logIn, setLogin] = useState({ email: "", password: "" })

    const [required, setRequired] = useState({ email: { require: false, valid: true }, password: { require: false, valid: true } })


    const login = async (e) => {
        e.preventDefault()
        // required
        let emailRequire = logIn.email.length === 0;
        let passwordRequire = logIn.password.length === 0;

        if (emailRequire || passwordRequire) {
            setRequired({ email: { require: emailRequire, valid: true }, password: { require: passwordRequire, valid: true } })
            return;
        }

        // validation
        let validEmail = logIn.email.includes("@gmail.com");
        let validPassword = (logIn.password.length >= 8);

        if (!validEmail || !validPassword) {
            setRequired({ email: { require: false, valid: validEmail }, password: { require: false, valid: validPassword } })
            return;
        }

        setRequired({ email: { require: false, valid: true }, password: { require: false, valid: true } })

        try {
            setLoader(true)
            await signInWithEmailAndPassword(auth, logIn.email, logIn.password)
            document.body.removeAttribute("class")
            setLoader(false)
            notify("Login Successfully")
            setAuthTrace("")
        } catch (error) {
            const actualerror = error?.message?.split("/")[1]?.split(")")[0] || "something went wrong";
            notify(actualerror , "error")
            setLoader(false)
        }
    }

    return <form className="login-signup-lower" onSubmit={(e) => { login(e) }}>
        <div className="email-con">
            * Email <input type="text" placeholder='example@gmail.com' name='email' value={logIn.email} onChange={(e) => { setLogin({ ...logIn, [e.target.name]: e.target.value }) }} />
            {required.email.require ? <span>required</span> : !required.email.valid ? <span>Enter a valid email.</span> : null}
        </div>
        <div className="pass-con">
            * Password
            <div className='input'>
                <input type={eye ? "text" : "password"} name='password' value={logIn.password} onChange={(e) => { setLogin({ ...logIn, [e.target.name]: e.target.value }) }} />
                <div className="eye" onClick={() => setEye(!eye)}>
                    {eye ? <i className="ri-eye-fill"></i> :
                        <i className="ri-eye-off-fill"></i>}
                </div>
            </div>
            {required.password.require ? <span>required</span> : !required.password.valid ? <span>Passwords require 8 characters and a number.</span> : null}
        </div>
        {!loader ? <button type='submit' disabled={socialLoader}>Log in</button> : <button type='button'><CircularProgress color='white' size={16} /> Logging in...</button>}
        <div className="forgot" onClick={() => {
            if (!socialLoader && !loader) {
                setAuthTrace("")
                setIsForgot(true)
            }
        }}>
            Forgot password?
        </div>
    </form>
}

export default LoginForm