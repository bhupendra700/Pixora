import { useEffect, useState } from 'react'
import '../../CSS/Error/error.css'
import { Link, NavLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../Firebase';
import useWindowSize from '../useWindowSize';
import LoginPage from '../../Component/Login/LoginPage'
import ProfilePage from '../Login/ProfilePage';
import DeletePage from '../Login/DeletePage';
import ForgotPage from '../Login/ForgotPage';

const Error = () => {
    const [safeSearch, setSafeSearch] = useState(localStorage.getItem('safeSearch') ? localStorage.getItem('safeSearch') === 'true' ? true : false : "");

    useEffect(() => {
        if (safeSearch !== "") localStorage.setItem("safeSearch", safeSearch);
    }, [safeSearch]);

    const size = useWindowSize()

    const [searchParam] = useSearchParams();

    const loc = useLocation()

    const isValidCat = (catpara) => {
        return ["images", "photos", "vectors", "illustrations", "videos"].includes(catpara)
    }

    const [topCat, setTopCat] = useState(isValidCat(loc.pathname.split("/")[0]) ? loc.pathname.split("/")[0] : "images")

    useEffect(() => {
        setTopCat(isValidCat(loc.pathname.split("/")[0]) ? loc.pathname.split("/")[0] : "images");
    }, [loc.pathname])

    const handleAnyWhereError = (e) => {
        const errordet = document.getElementById("errordet");

        if (!errordet?.contains(e.target)) {
            errordet?.parentElement?.removeAttribute("open")
        }
    }

    useEffect(() => {
        window.addEventListener("click", handleAnyWhereError);

        return () => window.removeEventListener("click", handleAnyWhereError);
    }, [])


    //start
    const [user, setUser] = useState(null)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (curruser) => {
            if (curruser) {
                setUser(curruser)
            } else {
                setUser(null);
            }
        })

        return () => unsubscribe
    }, [])

    const [hemSlider, setHemSlider] = useState({ track: "unknown", open: false });

    useEffect(() => {
        if (size <= 750 && hemSlider.track !== "unknown" && hemSlider.open) {
            document.body.setAttribute("class", "hidescroll");
        } else if (authTrace !== "") {
            document.body.setAttribute("class", "hidescroll");
        } else if (isForgot) {
            document.body.setAttribute("class", "hidescroll");
        } else if (profile) {
            document.body.setAttribute("class", "hidescroll");
        } else if (showDelete) {
            document.body.setAttribute("class", "hidescroll");
        } else {
            document.body.removeAttribute("class")
        }
    }, [size, hemSlider]);

    const handleAnyWhere = (e) => {
        const topCatDet = document.getElementById("det1");
        if (topCatDet && !topCatDet.contains(e.target)) {
            topCatDet.parentElement.removeAttribute("open");
        }

        const user = document.getElementById("det2");
        const hem = document.getElementsByClassName("user-hameburgur")[0];

        if (!hem && user && !user.contains(e.target)) {
            setHemSlider({ ...hemSlider, open: false })
        }
    }

    useEffect(() => {
        document.addEventListener("click", handleAnyWhere);

        return () => document.removeEventListener("click", handleAnyWhere);
    }, [])

    const handleAnimation = () => {
        const go = document.getElementsByClassName("hem-menu-container")[0];
        go.addEventListener("animationend", () => {
            go.classList.remove("go");
            setHemSlider({ ...hemSlider, open: !hemSlider.open })
        }, { once: true });
    }
    //end
    const [inputquery, setInputQuery] = useState("")

    const navigate = useNavigate();

    const [authTrace, setAuthTrace] = useState("");

    useEffect(() => {
        if (user) {
            if (authTrace !== "") {
                setAuthTrace("")
                document.body.removeAttribute("class")
            }
        }
    }, [user])

    useEffect(() => {
        if (auth.currentUser) {
            setUser(auth.currentUser)
        }
    }, [authTrace])

    const [profile, setProfile] = useState(false);

    const [showDelete, setShowDelete] = useState(false)

    const [isForgot, setIsForgot] = useState(false)

    const filterSearchParam = (status) => {
        let query = "";

        if (searchParam.has("order") && ["ec", "latest", "popular"].includes(searchParam.get("order"))) {
            query += `order=${searchParam.get("order")}&`
        }

        if (searchParam.has("orientation") && ["horizontal", "vertical"].includes(searchParam.get("orientation"))) {
            query += `orientation=${searchParam.get("orientation")}&`
        }

        if (searchParam.has("min_width") && !isNaN(searchParam.get("min_width"))) {
            query += `min_width=${searchParam.get("min_width")}&`
        }

        if (searchParam.has("min_height") && !isNaN(searchParam.get("min_height"))) {
            query += `min_height=${searchParam.get("min_height")}&`
        }

        if (searchParam.has("colors")) {
            const validColor = ["grayscale", "transparent", "red", "orange", "yellow", "green", "turquoise", "blue", "lilac", "pink", "white", "gray", "black", "brown"];

            const colorArray = Array.from(new Set(searchParam.getAll("colors")));

            let allValidColor = colorArray.filter((colorele) => {
                return validColor.includes(colorele);
            })

            for (let i = 0; i < allValidColor.length; i++) {
                query += `colors=${allValidColor[i]}&`;
            }
        }

        if (status === "full") {
            navigate(`/${topCat}/search/${inputquery.toLowerCase()}/${query !== "" ? `?${query.slice(0, -1)}` : ""}`);
        } else {
            navigate(`/${topCat}/search/${query !== "" ? `?${query.slice(0, -1)}` : ""}`);
        }
    }

    return <>
        <div className="error-con">
            <header className='error-header'>
                <Link to={'/'} className="logo">
                    {size <= 750 ? <div className="short">
                        px
                    </div> :
                        <div className="long">
                            Pixora
                        </div>}
                </Link>
                <div className="auth">
                    {
                        user ? <>
                            <details className='user' id='det2' open={hemSlider.track === "user" ? hemSlider.open : false}>
                                <summary onClick={(e) => { e.preventDefault(); setHemSlider({ ...hemSlider, track: "user", open: hemSlider.track === "user" ? !hemSlider.open : true }) }}><img src={(() => {
                                    try {
                                        if (user?.photoURL) {
                                            return JSON.parse(user?.photoURL)?.userLink
                                        }
                                    } catch (error) {
                                        return "https://res.cloudinary.com/dgun0lg7q/image/upload/v1752855927/1_wjyymp.jpg"
                                    }
                                })()} /></summary>
                                {size > 750 && <div className='profile'>
                                    <div className='name'>{user.displayName ? user.displayName : "UnKnown"}</div>
                                    <div className='box'>{user.email}</div>
                                    <div onClick={() => { setProfile(!profile); setHemSlider({ ...hemSlider, track: "user", open: hemSlider.track === "user" ? !hemSlider.open : true }) }} className='box'>Edit Profile</div>
                                    <div className='safesearch'>
                                        <label htmlFor="switchbtn" className='switchlabel'>
                                            <div className='safeSearch-container'>
                                                <div className={safeSearch ? "switchon switch" : "switch"}>
                                                    <input
                                                        checked={safeSearch}
                                                        onChange={() => { setSafeSearch(!safeSearch) }}
                                                        id="switchbtn" type="checkbox" />
                                                </div>
                                                SafeSearch
                                            </div>
                                            <div className='safesearch-info'>
                                                <i onClick={(e) => { e.stopPropagation() }} className="ri-question-line" ></i>
                                                <span className='safesearchmessage'>If you’re using Pixabay in a school or workplace, you can prevent most adult content from showing up by turning on the SafeSearch setting.
                                                </span>
                                            </div>
                                        </label>
                                    </div>
                                    <button onClick={async () => { await signOut(auth); setHemSlider({ ...hemSlider, track: "user", open: hemSlider.track === "user" ? !hemSlider.open : true }) }}>Logout</button>
                                </div>}
                            </details>
                            {size > 750 && <button className='logout' onClick={async () => { await signOut(auth) }}>Logout</button>}
                        </>
                            : <>
                                {size > 750 && <div className="login" onClick={() => {
                                    document.body.setAttribute("class", "hidescroll");
                                    setAuthTrace("login");
                                }}>
                                    <button>
                                        Log in
                                    </button>
                                </div>}
                                <div className="join" onClick={() => {
                                    document.body.setAttribute("class", "hidescroll");
                                    setAuthTrace("signup")
                                }}
                                >
                                    <button>
                                        Join
                                    </button>
                                </div>
                            </>
                    }

                    {size <= 750 && <div className="user-hameburgur" onClick={() => { setHemSlider({ ...hemSlider, track: "hem", open: hemSlider.track === "hem" ? !hemSlider.open : true }) }}>
                        <i className="ri-menu-fill"></i>
                    </div>}
                </div>

            </header>

            {(hemSlider.track !== "unknown" && hemSlider.track === "user" ? size <= 750 ? hemSlider.open : false : hemSlider.open) && <div className="hem-menu-container">
                <div className={hemSlider.track === "user" ? "hem-menu login" : hemSlider.track === "hem" ? "hem-menu hem" : "hem-menu"}>
                    <div className="hem-menu-header">
                        {hemSlider.track === "hem" && <div className="logo">
                            pc
                        </div>}
                        {hemSlider.track === "user" && <div className="accaunt-logo">
                            <div className='account-img'>
                                {user && <img src={(() => {
                                    try {
                                        if (user?.photoURL) {
                                            return JSON.parse(user?.photoURL)?.userLink
                                        }
                                    } catch (error) {
                                        return "https://res.cloudinary.com/dgun0lg7q/image/upload/v1752855927/1_wjyymp.jpg"
                                    }
                                })()} alt="pattern" />}
                            </div>
                            {user && <div className='account-name'>{user.displayName ? user.displayName : "UnKnown"}</div>}
                        </div>}
                        <i className="ri-close-fill" onClick={() => {
                            document.getElementsByClassName("hem-menu-container")[0].classList.add("go");
                            handleAnimation();
                        }}
                        ></i>
                    </div>
                    <div className="hem-menu-slider">
                        {hemSlider.track === "user" ? <div className="hem-menu-main-user">
                            {user && <div className="hem-menu-email">{user.email}</div>}
                            <div className="hem-menu-main-editprofile" onClick={() => {
                                setProfile(true)
                                document.getElementsByClassName("hem-menu-container")[0].classList.add("go");
                                handleAnimation();
                            }}>Edit Profile</div>
                            <div className="hem-menu-safeSearch">
                                <label className="hi" htmlFor="hem-menu-checkbox">
                                    <input checked={safeSearch}
                                        onChange={() => { setSafeSearch(!safeSearch) }} type="checkbox" id='hem-menu-checkbox' />
                                    <div className="safeSearch-con">
                                        <div className="text">SafeSearch</div>
                                        <div className="switch-con">
                                            <div></div>
                                        </div>
                                    </div>
                                    <div className="safeSearch-message">
                                        If you’re using Pixabay in a school or workplace, you can prevent most adult content from showing up by turning on the SafeSearch setting.
                                    </div>
                                </label>
                            </div>
                            <button onClick={async () => {
                                await signOut(auth); document.getElementsByClassName("hem-menu-container")[0].classList.add("go");
                                handleAnimation();
                            }}>Logout</button>
                        </div> :
                            <div className="hem-menu-main-hem">
                                <div className="media">Media</div>
                                <div className={topCat === "images" ? "allimages green" : "allimages"} onClick={() => {
                                    setTopCat("images")
                                    document.getElementsByClassName("hem-menu-container")[0].classList.add("go");
                                    handleAnimation();
                                }}><i className="ri-image-fill"></i> All Images</div>
                                <div className={topCat === "photos" ? "photos green" : "photos"} onClick={() => {
                                    setTopCat("photos")
                                    document.getElementsByClassName("hem-menu-container")[0].classList.add("go");
                                    handleAnimation();
                                }}><i className="ri-camera-fill"></i> Photos</div>
                                <div className={topCat === "illustrations" ? "illustrations green" : "illustrations"} onClick={() => {
                                    setTopCat("illustrations")
                                    document.getElementsByClassName("hem-menu-container")[0].classList.add("go");
                                    handleAnimation();
                                }}><i className="ri-ball-pen-fill"></i> Illustrations</div>
                                <div className={topCat === "vectors" ? "vectors green" : "vectors"} onClick={() => {
                                    setTopCat("vectors")
                                    document.getElementsByClassName("hem-menu-container")[0].classList.add("go");
                                    handleAnimation();
                                }}><i className="ri-pen-nib-fill"></i> Vectors</div>
                                <div className={topCat === "videos" ? "videos green" : "videos"} onClick={() => {
                                    setTopCat("videos")
                                    document.getElementsByClassName("hem-menu-container")[0].classList.add("go");
                                    handleAnimation();
                                }}><i className="ri-video-on-fill"></i> Videos</div>
                            </div>}
                        <div className="hem-menu-footer">
                            <Link to='google.com' target='_blank' className="insta"><i className="ri-instagram-fill"></i></Link>
                            <Link to='google.com' target='_blank' className="pinterest"><i className="ri-pinterest-fill"></i></Link>
                            <Link to='google.com' target='_blank' className="twitter"><i className="ri-twitter-x-line"></i></Link>
                            <Link to='google.com' target='_blank' className="fb"><i className="ri-facebook-circle-fill"></i></Link>
                        </div>
                    </div>
                </div>
            </div>}
            <main className='error-main'>
                <div className="message">
                    <p>Error 404</p>
                    <h1>Page not found</h1>
                </div>
                <div className="search">
                    <i className="ri-search-line" onClick={() => {
                        if (inputquery !== "") {
                            filterSearchParam("full")
                        } else {
                            filterSearchParam("empty")
                        }
                    }}></i>
                    <input type="text" placeholder={`Search ${topCat === "images" ? "images , photos , illustartions and vectors" : topCat}`} value={inputquery} onChange={(e) => { setInputQuery(e.target.value) }} onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            if (inputquery !== "") {
                                filterSearchParam("full")
                            } else {
                                filterSearchParam("empty")
                            }
                        }
                    }} />
                    {size > 750 && <details>
                        <summary id='errordet'>{topCat === "images" ? "All images" : topCat.charAt(0).toUpperCase() + topCat.substring(1)}<i className="ri-arrow-down-s-line"></i></summary>
                        <div>
                            <div onClick={() => { setTopCat("images") }} className={topCat === "images" ? 'cat1 green' : "cat1"}>All Images</div>
                            <div className='cat2'>
                                <p onClick={() => { setTopCat("photos") }} className={topCat === "photos" ? "green" : ""}>Photos</p>
                                <p onClick={() => { setTopCat("illustrations") }} className={topCat === "illustrations" ? "green" : ""}>Illustrations</p>
                                <p onClick={() => { setTopCat("vectors") }} className={topCat === "vectors" ? "green" : ""}>Vectors</p>
                            </div>
                            <div onClick={() => { setTopCat("videos") }} className={topCat === "videos" ? 'cat1 green' : "cat1"}>Videos</div>
                        </div>
                    </details>}
                </div>
            </main>
            <footer className='error-footer'>
                <h2><Link className='link' to={'/'}>Pixora</Link></h2>
                <div className="social">
                    <NavLink className={"icon insta"} to={'https://www.instagram.com/pixabay/'} target='_blank'>
                        <i className="ri-instagram-fill"></i>
                    </NavLink>
                    <NavLink className={"icon pinterest"} to={'https://www.pinterest.com/pixabay/'} target='_blank'>
                        <i className="ri-pinterest-fill"></i>
                    </NavLink>
                    <NavLink className={"icon twitter"} to={'https://x.com/pixabay'} target='_blank'>
                        <i className="ri-twitter-x-fill"></i>
                    </NavLink>
                    <NavLink className={"icon fb"} to={'https://www.facebook.com/pixabay'} target='_blank'>
                        <i className="ri-facebook-fill"></i>
                    </NavLink>
                </div>
                <p>© 2025 Pixora. Built for educational use only.</p>
            </footer>
        </div>

        {(!user && authTrace) && <LoginPage authTrace={authTrace} setAuthTrace={setAuthTrace} setIsForgot={setIsForgot} />}

        {profile && <ProfilePage profile={profile} setProfile={setProfile} user={user} setUser={setUser} setShowDelete={setShowDelete} />}

        {showDelete && <DeletePage setShowDelete={setShowDelete} user={user} />}

        {isForgot && <ForgotPage setIsForgot={setIsForgot} />}
    </>
}

export default Error