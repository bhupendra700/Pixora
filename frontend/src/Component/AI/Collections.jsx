import { useContext, useEffect, useState } from 'react';
import test from '../../Images/logo.png'
import { CircularProgress } from '@mui/material';
import CollectionHeader from './CollectionHeader';
import Footer from '../Page1/Footer';
import '../../CSS/AI/collection.css'
import useWindowSize from '../useWindowSize';
import { GlobalContext } from '../../App';
import axios from 'axios';

const Collections = () => {
    const size = useWindowSize();

    const { notify, user } = useContext(GlobalContext);

    const [count, setCount] = useState(window.innerWidth > 1280 ? 4 : window.innerWidth > 1024 ? 3 : window.innerWidth > 769 ? 2 : 1)

    useEffect(() => {
        setCount(size > 1280 ? 4 : size > 1024 ? 3 : size > 769 ? 2 : 1);
    }, [size]);

    const [collection, setCollection] = useState([
        "https://picsum.photos/400/300?random=1",
        "https://picsum.photos/400/300?random=2",
        "https://picsum.photos/400/300?random=3",
        "https://picsum.photos/400/300?random=4",
        "https://picsum.photos/400/300?random=5",
        "https://picsum.photos/400/300?random=6",
        "https://picsum.photos/400/300?random=7",
        "https://picsum.photos/400/300?random=8",
        "https://picsum.photos/400/300?random=9",
        "https://picsum.photos/400/300?random=10",
        "https://picsum.photos/400/300?random=11",
        "https://picsum.photos/400/300?random=12",
        "https://picsum.photos/400/300?random=13",
        "https://picsum.photos/400/300?random=14",
        "https://picsum.photos/400/300?random=15",
        "https://picsum.photos/400/300?random=16",
        "https://picsum.photos/400/300?random=17",
        "https://picsum.photos/400/300?random=18",
        "https://picsum.photos/400/300?random=19",
        "https://picsum.photos/400/300?random=20",
        "https://picsum.photos/400/300?random=21",
        "https://picsum.photos/400/300?random=22",
        "https://picsum.photos/400/300?random=23",
        "https://picsum.photos/400/300?random=24",
        "https://picsum.photos/400/300?random=25",
        "https://picsum.photos/400/300?random=26",
        "https://picsum.photos/400/300?random=27",
        "https://picsum.photos/400/300?random=28",
        "https://picsum.photos/400/300?random=29",
        "https://picsum.photos/400/300?random=30",
        "https://picsum.photos/400/300?random=31",
        "https://picsum.photos/400/300?random=32",
        "https://picsum.photos/400/300?random=33",
        "https://picsum.photos/400/300?random=34",
        "https://picsum.photos/400/300?random=35",
        "https://picsum.photos/400/300?random=36",
        "https://picsum.photos/400/300?random=37",
        "https://picsum.photos/400/300?random=38",
        "https://picsum.photos/400/300?random=39",
        "https://picsum.photos/400/300?random=40",
        "https://picsum.photos/400/300?random=41",
        "https://picsum.photos/400/300?random=42",
        "https://picsum.photos/400/300?random=43",
        "https://picsum.photos/400/300?random=44",
        "https://picsum.photos/400/300?random=45",
        "https://picsum.photos/400/300?random=46",
        "https://picsum.photos/400/300?random=47",
        "https://picsum.photos/400/300?random=48",
        "https://picsum.photos/400/300?random=49",
        "https://picsum.photos/400/300?random=50",
        "https://picsum.photos/400/300?random=51",
        "https://picsum.photos/400/300?random=52",
        "https://picsum.photos/400/300?random=53",
        "https://picsum.photos/400/300?random=54",
        "https://picsum.photos/400/300?random=55",
        "https://picsum.photos/400/300?random=56",
        "https://picsum.photos/400/300?random=57",
        "https://picsum.photos/400/300?random=58",
        "https://picsum.photos/400/300?random=59",
        "https://picsum.photos/400/300?random=60",
        "https://picsum.photos/400/300?random=61",
        "https://picsum.photos/400/300?random=62",
        "https://picsum.photos/400/300?random=63",
        "https://picsum.photos/400/300?random=64",
        "https://picsum.photos/400/300?random=65",
        "https://picsum.photos/400/300?random=66",
        "https://picsum.photos/400/300?random=67",
        "https://picsum.photos/400/300?random=68",
        "https://picsum.photos/400/300?random=69",
        "https://picsum.photos/400/300?random=70",
        "https://picsum.photos/400/300?random=71",
        "https://picsum.photos/400/300?random=72",
        "https://picsum.photos/400/300?random=73",
        "https://picsum.photos/400/300?random=74",
        "https://picsum.photos/400/300?random=75",
        "https://picsum.photos/400/300?random=76",
        "https://picsum.photos/400/300?random=77",
        "https://picsum.photos/400/300?random=78",
        "https://picsum.photos/400/300?random=79",
        "https://picsum.photos/400/300?random=80",
        "https://picsum.photos/400/300?random=81",
        "https://picsum.photos/400/300?random=82",
        "https://picsum.photos/400/300?random=83",
        "https://picsum.photos/400/300?random=84",
        "https://picsum.photos/400/300?random=85",
        "https://picsum.photos/400/300?random=86",
        "https://picsum.photos/400/300?random=87",
        "https://picsum.photos/400/300?random=88",
        "https://picsum.photos/400/300?random=89",
        "https://picsum.photos/400/300?random=90",
        "https://picsum.photos/400/300?random=91",
        "https://picsum.photos/400/300?random=92",
        "https://picsum.photos/400/300?random=93",
        "https://picsum.photos/400/300?random=94",
        "https://picsum.photos/400/300?random=95",
        "https://picsum.photos/400/300?random=96",
        "https://picsum.photos/400/300?random=97",
        "https://picsum.photos/400/300?random=98",
        "https://picsum.photos/400/300?random=99",
        "https://picsum.photos/400/300?random=100"
    ]);

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

            // const res = await axios.delete(`/deleteimage/${user.uid}/${public_id}`)
            // if (res.success) {
            //     notify("success", "Image deleted successfully");
            //     setCollection(prev => prev.filter((ele) => ele.public_id !== public_id))
            // }

            await new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(true);
                }, 1000 * 60 * 5);
            })

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
            notify("error", error.message);
        }
    }

    return <section className='collection'>
        <CollectionHeader />
        <section className="collection-con">
            {collection.length ? <div className='card-con-main'>
                <div>
                    {collection.map((ele, idx) => {
                        if (idx % count === 0) {
                            return <div className="image-card" key={idx}>
                                <div className="image">
                                    <img src={ele} alt="your_image" height={100} />
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
                                    <img src={ele} alt="your_image" height={100} />
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
                                    <img src={ele} alt="your_image" height={10} />
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
                                    <img src={ele} alt="your_image" height={100} />
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
                </div>}
        </section>
        <Footer />
    </section>
}

export default Collections