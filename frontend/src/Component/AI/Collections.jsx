import { useContext, useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import CollectionHeader from './CollectionHeader';
import Footer from '../Page1/Footer';
import '../../CSS/AI/collection.css'
import useWindowSize from '../useWindowSize';
import { GlobalContext } from '../../App';
import { customAlphabet } from 'nanoid';
import axios from 'axios';


const Collections = () => {
    const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const nanoid = customAlphabet(alphabet, 20);

    const size = useWindowSize();

    const { notify, user, backendURL } = useContext(GlobalContext);

    const [collection , setCollection] = useState([]);

    const [loader  ,setLoader] = useState(false);

    useEffect(() => {
        const fetchCollection = async () => {
            try {
                setLoader(true);
                const { data } = await axios.get(`${backendURL}/getcollection/${user.uid}`);

                setCollection(data?.collection || []);
                setLoader(false)
            } catch (error) {
                setLoader(false)
                console.log(error.message);
                setCollection([]);
            }
        }

        if (user) {
            fetchCollection()
        } else {
            setCollection([]);
        }

    }, [user])

    const [count, setCount] = useState(window.innerWidth > 1280 ? 4 : window.innerWidth > 1024 ? 3 : window.innerWidth > 769 ? 2 : 1)

    useEffect(() => {
        setCount(size > 1280 ? 4 : size > 1024 ? 3 : size > 769 ? 2 : 1);
    }, [size]);

    const [downloadLoaderSet, setDownloadLoaderSet] = useState(new Set());

    const handleDownload = async (secure_url, idx) => {
        try {
            setDownloadLoaderSet(prev => {
                const newSet = new Set(prev);
                newSet.add(idx);
                return newSet;
            })

            let url = secure_url.replace("/upload/", '/upload/fl_attachment/');
            const link = document.createElement("a");
            link.href = url;
            link.download = `Pixora_Ai_Generated-Image_${nanoid()}`
            link.click();

            setDownloadLoaderSet(prev => {
                const newSet = new Set(prev);
                newSet.delete(idx);
                return newSet
            })
        } catch (error) {
            setDownloadLoaderSet(prev => {
                const newSet = new Set(prev);
                newSet.delete(idx);
                return newSet
            })
            console.log("Error: ", error.message);
        }
    }

    const [deleteCollection, setDeleteCollection] = useState(new Set());

    const deleteCol = async (public_id, idx) => {
        try {

            setDeleteCollection(prev => {
                const newSet = new Set(prev);
                newSet.add(idx);
                return newSet;
            })

            const res = await axios.delete(`${backendURL}/deleteimage/${user.uid}/${encodeURIComponent(public_id)}`)

            if (res.data.success) {
                notify("Image deleted successfully", "success");
                setCollection(prev => prev.filter((ele) => ele.public_id !== public_id))
            }

            setDeleteCollection(prev => {
                const newSet = new Set(prev);
                newSet.delete(idx);
                return newSet;
            })

        } catch (error) {
            setDeleteCollection(prev => {
                const newSet = new Set(prev);
                newSet.delete(idx);
                return newSet;
            })
            notify(error.message, "error");
        }
    }

    return <section className='collection'>
        <CollectionHeader />
        <section className="collection-con">
            {!loader ? collection.length ? <div className='card-con-main'>
                <div>
                    {collection.map((ele, idx) => {
                        if (idx % count === 0) {
                            return <div className="image-card" key={idx}>
                                <div className="image">
                                    <img src={ele.secure_url} alt="your_image" height={100} />
                                </div>
                                <div className="button">
                                    {!deleteCollection.has(idx) ? <div onClick={() => { deleteCol(ele.public_id, idx) }}>
                                        <i className="ri-delete-bin-line"></i>
                                    </div> : <div><CircularProgress size={20} className='circularloader' /></div>}
                                    {!downloadLoaderSet.has(idx) ? <div onClick={() => { handleDownload(ele.secure_url, idx) }}>
                                        <i className="ri-download-line"></i>
                                    </div> : <div><CircularProgress size={20} className='circularloader' /></div>}
                                </div>
                            </div>
                        }
                    })}
                </div>
                {size > 769 && <div>
                    {collection.map((ele, idx) => {
                        if (idx % count === 1) {
                            return <div className="image-card">
                                <div className="image">
                                    <img src={ele.secure_url} alt="your_image" height={100} />
                                </div>
                                <div className="button">
                                    {!deleteCollection.has(idx) ? <div onClick={() => { deleteCol(ele.public_id, idx) }}>
                                        <i className="ri-delete-bin-line"></i>
                                    </div> : <div><CircularProgress size={20} className='circularloader' /></div>}
                                    {!downloadLoaderSet.has(idx) ? <div onClick={() => { handleDownload(ele.secure_url, idx) }}>
                                        <i className="ri-download-line"></i>
                                    </div> : <div><CircularProgress size={20} className='circularloader' /></div>}
                                </div>
                            </div>
                        }
                    })}
                </div>}
                {size > 1024 && <div>
                    {collection.map((ele, idx) => {
                        if (idx % count === 2) {
                            return <div className="image-card">
                                <div className="image">
                                    <img src={ele.secure_url} alt="your_image" height={10} />
                                </div>
                                <div className="button">
                                    {!deleteCollection.has(idx) ? <div onClick={() => { deleteCol(ele.public_id, idx) }}>
                                        <i className="ri-delete-bin-line"></i>
                                    </div> : <div><CircularProgress size={20} className='circularloader' /></div>}
                                    {!downloadLoaderSet.has(idx) ? <div onClick={() => { handleDownload(ele.secure_url, idx) }}>
                                        <i className="ri-download-line"></i>
                                    </div> : <div><CircularProgress size={20} className='circularloader' /></div>}
                                </div>
                            </div>
                        }
                    })}
                </div>}
                {size > 1280 && <div>
                    {collection.map((ele, idx) => {
                        if (idx % count === 3) {
                            return <div className="image-card">
                                <div className="image">
                                    <img src={ele.secure_url} alt="your_image" height={100} />
                                </div>
                                <div className="button">
                                    {!deleteCollection.has(idx) ? <div onClick={() => { deleteCol(ele.public_id, idx) }}>
                                        <i className="ri-delete-bin-line"></i>
                                    </div> : <div><CircularProgress size={20} className='circularloader' /></div>}
                                    {!downloadLoaderSet.has(idx) ? <div onClick={() => { handleDownload(ele.secure_url, idx) }}>
                                        <i className="ri-download-line"></i>
                                    </div> : <div><CircularProgress size={20} className='circularloader' /></div>}
                                </div>
                            </div>
                        }
                    })}
                </div>}
            </div> :
                <div className="empty">
                    No Collection Save
                </div> : <div className='empty'>Loading...</div>}
        </section>
        <Footer />
    </section>
}

export default Collections