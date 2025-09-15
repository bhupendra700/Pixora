import { useContext, useEffect, useRef, useState } from 'react'
import '../../CSS/Login/profilepage.css'
import { updateProfile } from 'firebase/auth';
import { CircularProgress } from '@mui/material';
import { GlobalContext } from '../../App';
import { auth } from '../Firebase';
import axios from 'axios';

const ProfilePage = ({ profile, setProfile, user, setUser, setShowDelete }) => {

    const { notify, backendURL } = useContext(GlobalContext)
    const [uploading, setUploading] = useState(false);

    const [inputFile, setInputFile] = useState(null)

    const linkArr = ["https://res.cloudinary.com/dgun0lg7q/image/upload/v1752855927/1_wjyymp.jpg", "https://res.cloudinary.com/dgun0lg7q/image/upload/v1752855924/2_crpro7.jpg", "https://res.cloudinary.com/dgun0lg7q/image/upload/v1752855926/3_f3pgm3.jpg", "https://res.cloudinary.com/dgun0lg7q/image/upload/v1752855924/4_awhaqq.jpg", "https://res.cloudinary.com/dgun0lg7q/image/upload/v1752855926/5_ewsx5q.jpg"];

    const [link, setLink] = useState("");

    useEffect(() => {
        if (user && user?.photoURL) {
            setLink(JSON.parse(user.photoURL).userLink);
        }

        if (user && user.displayName) {
            setName(user.displayName);
        }
    }, [user])

    useEffect(() => {
        if (linkArr.includes(link)) {
            setInputFile(null);
        }
        return () => {
            if (link?.startsWith("blob:")) {
                URL.revokeObjectURL(link);
            }
        }
    }, [link])

    const handleRemove = (e) => {
        setInputFile(null);
        if (user && user?.photoURL) {
            setLink(JSON.parse(user.photoURL).userLink);
        } else {
            setLink("")
        }
    }

    const handleChange = async (e) => {
        setInputFile(e.target.files[0]);
        const objectUrl = URL.createObjectURL(e.target.files[0]);
        setLink(objectUrl);
    }

    const [isNameEditing, setIsNameEditing] = useState(false)

    useEffect(() => {
        if (isNameEditing) {
            inputRef?.current?.focus()
        }
    }, [isNameEditing])

    const [name, setName] = useState(user?.displayName || "");

    const inputRef = useRef(null);

    const uploadImage = async () => {
        try {
            if (inputFile) {
                const formData = new FormData();
                formData.append("sendfile", inputFile);
                formData.append("photoURL", user?.photoURL || "");

                const res = await axios.post(`${backendURL}/upload`, formData);

                await updateProfile(auth.currentUser, {
                    photoURL: JSON.stringify({ userLink: res.data.url, public_id: res.data.public_id })
                })
            } else {
                if (JSON.parse(user?.photoURL || "{}").public_id) {
                    const data = {
                        publicId: JSON.parse(user?.photoURL).public_id
                    }
                    await axios.put(`${backendURL}/delete`, data)
                }

                await updateProfile(auth.currentUser, {
                    photoURL: JSON.stringify({ userLink: link, public_id: "" })
                })
            }
        } catch (error) {
            throw error
        }
    }

    const updateName = async () => {
        try {
            await updateProfile(auth.currentUser, {
                displayName: name,
            })
        } catch (error) {
            throw error
        }
    }

    const updateUserProfile = async () => {
        try {
            setUploading(true)

            if (inputFile || (link !== user?.photoURL)) {
                await uploadImage()
            }

            if (name !== user?.displayName) {
                await updateName()
            }

            setUser({ ...auth.currentUser });

            document.body.removeAttribute("class")
            notify("Your profile updated successfully", "success")
            setProfile(false)
            setUploading(false)
            setInputFile(null)
        } catch (error) {
            notify(error.message, "error")
            setUploading(false)
        }
    }

    const fileRef = useRef(null);

    return <div className="editprofilebox">
        <div className='editprofile'>
            <div className="headerprofile">
                <h4>Profile Picture</h4>
                <i className="ri-close-line" onClick={() => { if (!uploading) { setProfile(!profile); setInputFile(null); setLink(JSON.parse(user?.photoURL).userLink); document.body.removeAttribute("class") } }}></i>
            </div>
            <div className="profileimage">
                {link && <img src={link} alt={"user-img"} />}
            </div>
            <div className="upload-btn">
                <label htmlFor='file' className='upload'>Browse Files</label>
                {inputFile && <button className='remove' onClick={(e) => { if (!uploading) { handleRemove(e) } }}><i className="ri-delete-bin-5-fill"></i> Remove</button>}
            </div>
            <input type="file" accept='image/*' onChange={(e) => { if (!uploading) { handleChange(e) } }} id='file'
                ref={fileRef}
                onClick={() => {
                    fileRef.current.value = null;
                }} />
            <div className="option">
                <span></span>
                <span>Or choose a pattern</span>
                <span></span>
            </div>
            <div className="pattern">
                <input type="radio" name='radiobtn' className='one' onChange={() => { if (!uploading) { setLink(linkArr[0]) } }} checked={linkArr[0] === link} />
                <input type="radio" name='radiobtn' className='two' onChange={() => { if (!uploading) { setLink(linkArr[1]) } }} checked={linkArr[1] === link} />
                <input type="radio" name='radiobtn' className='three' onChange={() => { if (!uploading) { setLink(linkArr[2]) } }} checked={linkArr[2] === link} />
                <input type="radio" name='radiobtn' className='four' onChange={() => { if (!uploading) { setLink(linkArr[3]) } }} checked={linkArr[3] === link} />
                <input type="radio" name='radiobtn' className='five' onChange={() => { if (!uploading) { setLink(linkArr[4]) } }} checked={linkArr[4] === link} />
            </div>
            <div className="name">
                {!isNameEditing ? <div className="nochange">
                    <div className="text">{name || "UnKnown"}</div>
                    <i className="ri-pencil-fill" onClick={() => { if (!uploading) { setIsNameEditing(true) } }}></i>
                </div> :
                    <div className="change">
                        <input type="text" value={name} onChange={(e) => { setName(e.target.value) }} onBlur={() => { setIsNameEditing(false) }} ref={inputRef} />
                    </div>}
            </div>
            {!uploading ? <div className="apply" onClick={() => { updateUserProfile() }}>Apply</div> :
                <div className="apply"><CircularProgress size={22} color='white' /></div>}
            <div className="option">
                <span></span>
                <span className='danger'>Danger</span>
                <span></span>
            </div>
            <button className="delete-account" onClick={() => { if (!uploading) { setShowDelete(true); setProfile(false) } }}>Delete Account</button>
        </div>
    </div>
}

export default ProfilePage