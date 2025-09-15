import { useContext, useState } from 'react'
import { auth } from '../Firebase';
import { deleteUser, EmailAuthProvider, GoogleAuthProvider, reauthenticateWithCredential, reauthenticateWithPopup } from 'firebase/auth';
import axios from 'axios';
import { CircularProgress } from '@mui/material';
import "../../CSS/Login/deletePage.css"
import { GlobalContext } from '../../App';


const DeletePage = ({ setShowDelete, user }) => {

    const { notify, backendURL } = useContext(GlobalContext)
    const [deleting, setDeleting] = useState(false)
    const [password, setPassword] = useState("")

    const handleDeleting = async (e) => {
        e.preventDefault();
        try {
            const loginUser = auth.currentUser
            setDeleting(true)

             if (password) {
                const credential = EmailAuthProvider.credential(loginUser.email, password);
                await reauthenticateWithCredential(loginUser, credential)
            } else {
                await reauthenticateWithPopup(loginUser, new GoogleAuthProvider())
            }

            if (JSON.parse(loginUser?.photoURL || "{}").public_id) {
                const data = {
                    publicId: JSON.parse(loginUser?.photoURL).public_id
                }
                await axios.put(`${backendURL}/delete`, data)
            }

            await axios.delete(`${backendURL}/deleteFolder/${loginUser.uid}`);

            await deleteUser(loginUser)

            document.body.removeAttribute("class");
            setShowDelete(false)
            setDeleting(false)
        } catch (error) {
            notify(error.message, "error")
            setDeleting(false)
        }
    }

    return <div className="delete-container">
        <div className="delete-account">
            <div className="delete-header">
                <h3>Delete account</h3>
                <i onClick={() => { if (!deleting) { setShowDelete(false); document.body.removeAttribute("class") } }} className="ri-close-fill"></i>
            </div>
            <div className="delete-message">
                <p><i className="ri-information-2-fill"></i> Are you sure?</p>
                <p>Deleting your account will permanently remove your data and anonymize your profile.
                </p>
            </div>
            <form action="#" autoComplete='off' onSubmit={(e) => { handleDeleting(e) }}>
                {((user && user.providerData[0].providerId === "password") || password) && <div className="password-box">
                    Password
                    <input type="password" placeholder='Enter Password' required value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>}
                <div className="buttons">
                    <button className='cancel' type='button' onClick={() => { if (!deleting) { setShowDelete(false); document.body.removeAttribute("class") } }}>Cancel</button>
                    <button className='delete' type='submit' disabled={deleting}>{!deleting ? "Delete Account" : <CircularProgress size={20} color='white' />}</button>
                </div>
            </form>
        </div>
    </div>
}

export default DeletePage