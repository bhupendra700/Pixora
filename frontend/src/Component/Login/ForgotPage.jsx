import { CircularProgress } from '@mui/material'
import { useContext, useState } from 'react'
import { GlobalContext } from '../../App';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../Firebase';
import '../../CSS/Login/forgotPage.css'

const ForgotPage = ({ setIsForgot }) => {
    const { notify } = useContext(GlobalContext);

    const [loader, setLoader] = useState(false)

    const [email, setEmail] = useState("")

    const [send, setSend] = useState(false);

    const handleForget = async (e) => {
        e.preventDefault();
        try {
            setLoader(true);
            await sendPasswordResetEmail(auth, email);
            setSend(true)
            setLoader(false);
        } catch (error) {
            const actualerror = error.message.split("/")[1].split(")")[0];
            notify(actualerror, "error");
            setSend(false)
            setLoader(false);
        }
    }

    return (
        <section className='forgot-pass-dialog'>
            <div className="forgot-con">
                {!send ? <>
                    <div className="forgot-header">
                        <div className="forgot-header-div">
                            <h2>Forgot your password?</h2>
                            <i onClick={() => {
                                setIsForgot(false)
                                document.body.removeAttribute("class")
                            }} className="ri-close-fill"></i>
                        </div>
                        <div className="message">
                            No worries! Fill in your email and we'll send you a link to reset your password
                        </div>
                    </div>
                    <form onSubmit={(e) => { handleForget(e) }}>
                        <input type="email" placeholder='example@gmail.com' required value={email} onChange={(e) => { setEmail(e.target.value) }} />
                        {!loader ? <button type='submit'>Reset password</button> :
                            <button type='button'><CircularProgress size={20} color='white' /> Sending...</button>}
                    </form>
                </> :
                    <>
                        <div className="icons">
                            <i className="ri-checkbox-circle-fill"></i>
                            <i onClick={() => {
                                setIsForgot(false)
                                document.body.removeAttribute("class")
                            }} className="ri-close-fill"></i>
                        </div>
                        <div className="success-message">
                            We've sent you a link to reset your password.
                        </div>
                    </>
                }
            </div>
        </section>
    )
}

export default ForgotPage