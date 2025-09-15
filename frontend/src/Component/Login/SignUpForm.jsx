import { useContext, useState } from 'react'
import { GlobalContext } from '../../App';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../Firebase';
import { CircularProgress } from '@mui/material';

const SignUpForm = ({ socialLoader, loader, setLoader ,setAuthTrace }) => {
    const { notify } = useContext(GlobalContext);
    const [eye, setEye] = useState(false);

    const [signUp, setSignUp] = useState({ name: "", email: "", password: "" });

    const [required, setRequired] = useState({ name: false, email: { require: false, valid: true }, password: { require: false, valid: true } })

    const signup = async (e) => {
        e.preventDefault()
        // required
        let nameRequire = signUp.name.length === 0;
        let emailRequire = signUp.email.length === 0;
        let passwordRequire = signUp.password.length === 0;

        if (nameRequire || emailRequire || passwordRequire) {
            setRequired({ name: nameRequire, email: { require: emailRequire, valid: true }, password: { require: passwordRequire, valid: true } })
            return;
        }

        // validation
        let validEmail = signUp.email.includes("@gmail.com");
        let validPassword = (signUp.password.length >= 8);

        if (!validEmail || !validPassword) {
            setRequired({ name: false, email: { require: false, valid: validEmail }, password: { require: false, valid: validPassword } })
            return;
        }

        setRequired({ name: false, email: { require: false, valid: true }, password: { require: false, valid: true } })

        try {
            setLoader(true)
            await createUserWithEmailAndPassword(auth, signUp.email, signUp.password);
            await updateProfile(auth.currentUser, {
                displayName: signUp.name,
                photoURL : JSON.stringify({
                    userLink : "https://res.cloudinary.com/dgun0lg7q/image/upload/v1752855927/1_wjyymp.jpg" , 
                    public_id : "",
                })
            })
            notify("Signup Successfully", "success");
            setLoader(false)
            setAuthTrace("")
            document.body.removeAttribute("class")
        } catch (error) {
            const actualerror = error.message.split("/")[1].split(")")[0] || "Something went wrong";
            notify(actualerror, "error")
            setLoader(false)
        }
    }

    return <form className="login-signup-lower" onSubmit={(e) => { signup(e) }}>
        <div className="name-con">
            * Name <input type="text" placeholder='e.g. jhone doe' name='name' value={signUp.name} onChange={(e) => { setSignUp({ ...signUp, [e.target.name]: e.target.value }) }} />
            {required.name && <span>required</span>}
        </div>
        <div className="email-con">
            * Email <input type="text" placeholder='example@gmail.com' name='email' value={signUp.email} onChange={(e) => { setSignUp({ ...signUp, [e.target.name]: e.target.value }) }} />
            {required.email.require ? <span>required</span> : !required.email.valid ? <span>Enter a valid email.</span> : null}
        </div>
        <div className="pass-con">
            * Password
            <div className='input'>
                <input type={eye ? "text" : "password"} name='password' value={signUp.password} onChange={(e) => { setSignUp({ ...signUp, [e.target.name]: e.target.value }) }} />
                <div className="eye" onClick={() => setEye(!eye)}>
                    {eye ? <i className="ri-eye-fill"></i> :
                        <i className="ri-eye-off-fill"></i>}
                </div>
            </div>
            {required.password.require ? <span>required</span> : !required.password.valid ? <span>Passwords require 8 characters and a number.</span> : null}
            <div className="message">* at least 8 characters long</div>
        </div>
        {!loader ? <button disabled={socialLoader} type='submit'>Join</button> : <button type='button'><CircularProgress color='white' size={16} /> Signing up...</button>}
    </form>
}

export default SignUpForm