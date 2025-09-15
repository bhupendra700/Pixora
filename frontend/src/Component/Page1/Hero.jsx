import { useEffect, useMemo, useState } from 'react'
import '../../CSS/Page1/hero.css'
import { Link, NavLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { signOut } from 'firebase/auth'
import { auth } from '../Firebase'
import useWindowSize from '../useWindowSize'
import { onAuthStateChanged } from 'firebase/auth';
import LoginPage from '../Login/LoginPage'
import ProfilePage from '../Login/ProfilePage'
import DeletePage from '../Login/DeletePage'
import ForgotPage from '../Login/ForgotPage'


const Hero = ({ setSafeSearch, safeSearch }) => {
    const size = useWindowSize()

    const [searchParam, setSearchParam] = useSearchParams()

    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (getuser) => {
            if (getuser) {
                setUser(getuser)
            } else {
                setUser(null)
            }
        })

        return () => unsubscribe
    }, [])

    const loc = useLocation();

    const [search, setSearch] = useState("")
    const [search2, setSearch2] = useState("")

    const handleScroll = () => {
        const header = document.getElementsByTagName("header")[0];

        if (window.scrollY > 10) {
            header?.classList?.add("light-header")
        } else {
            header?.classList?.remove("light-header")
        }
    }

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll)
    }, []);

    const url = useMemo(() => {
        return `${loc.pathname === '/videos/' || loc.pathname === '/videos' ? `https://pixabay.com/api/videos/?key=${import.meta.env.VITE_API_KEY}&per_page=100&editors_choice=true&safesearch=true` : loc.pathname === '/' ? `https://pixabay.com/api/?key=${import.meta.env.VITE_API_KEY}&image_type=all&per_page=100&editors_choice=true&safesearch=true` : `https://pixabay.com/api/?key=${import.meta.env.VITE_API_KEY}&image_type=${loc.pathname.split("/")[1].substring(0, loc.pathname.split("/")[1].length - 1)}&per_page=100&editors_choice=true&safesearch=true`}`
    }, [loc.pathname])

    const fetchBG = async ({ queryKey }) => {
        try {
            const [_key, url] = queryKey;
            const res = await axios.get(url);
            return res.data.hits;
        } catch (error) {
            throw error;
        }

    }

    const { data, error } = useQuery({
        queryKey: ["Header", url],
        queryFn: fetchBG,
        enabled: !!url,
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 20,
        cacheTime: 1000 * 60 * 20,
    })

    const [tags, setTags] = useState([]);

    useEffect(() => {
        if (data && data.length > 0) {
            let str = "";
            data.map((ele) => {
                if (str === "") {
                    str += ele.tags;
                } else {
                    str += ", " + ele.tags;
                }
                return ele;
            })

            let arr = str.split(", ");

            const map = new Map();
            arr.map((ele) => {
                map.has(ele) ? map.set(ele, map.get(ele) + 1) : map.set(ele, 1);
            })

            arr = [];
            for (const [key, value] of map) {
                arr.push([key, value, loc.pathname]);
            }

            arr.sort((a, b) => { return b[1] - a[1] })

            setTags(arr.filter((ele, idx) => {
                return idx < 20;
            }))
        }
    }, [data])

    useEffect(() => {
        if (error) {
            console.log('Error: ', error);
        }
    }, [error])

    const navigate = useNavigate();

    const [topCat, setTopCat] = useState(loc.pathname === "/" ? "All images" : loc.pathname.substring(1, 2).toUpperCase() + loc.pathname.substring(2, loc.pathname.length - 1));

    useEffect(() => {
        setTopCat(loc.pathname === "/" ? "All images" : loc.pathname.substring(1, 2).toUpperCase() + loc.pathname.substring(2, loc.pathname.length - 1))
        setSearch2("")
    }, [loc.pathname])

    const [authTrace, setAuthTrace] = useState("");

    useEffect(() => {
        if (user) {
            if (authTrace !== "") {
                setAuthTrace("")
                document.body.removeAttribute("class")
            }
        }
    }, [user])

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
        const topCatdet = document.getElementById("det1");
        if (topCatdet && !topCatdet.contains(e.target)) {
            topCatdet.removeAttribute("open");
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

    //animation to handle animation effect of hemslider
    const handleAnimation = () => {
        const go = document.getElementsByClassName("hem-menu-container")[0];
        go.addEventListener("animationend", () => {
            go.classList.remove("go");
            setHemSlider({ ...hemSlider, open: !hemSlider.open })
        }, { once: true });
    }

    const [profile, setProfile] = useState(false);

    const [showDelete, setShowDelete] = useState(false)

    const [isForgot, setIsForgot] = useState(false)

    useEffect(() => {
        if (auth.currentUser) {
            setUser(auth.currentUser)
        }
    }, [authTrace])

    const filterSearchParam = () => {
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

        query = query.slice(0, -1);
        return query;
    }

    return <>
        <div className="hero-container">
            {/* background ke liye */}
            {(data && data.length > 0) && (["film", "animation"].includes(data[99].type) ? <video src={data[99]?.videos?.medium?.url} autoPlay muted loop poster={data[99]?.videos?.medium?.thumbnail}></video> : <img className='bg-img' src={data[99].largeImageURL} alt="image" />)}

            <div className="layer"></div>

            <header>
                <NavLink to={'/'} className="logo">
                    {size <= 750 ? <div className="short">
                        px
                    </div> :
                        <div className="long">
                            Pixora
                        </div>}
                </NavLink>
                {size > 330 && <div className="search">
                    <i className="search-icon ri-search-line" onClick={() => {
                        const query = filterSearchParam();
                        if (search2 !== "") {
                            navigate(topCat === "All images" ? `/images/search/${search2.toLowerCase()}/${query ? `?${query}` : ""}` : `/${topCat.toLowerCase()}/search/${search2.toLowerCase()}/${query ? `?${query}` : ""}`)
                        } else {
                            navigate(topCat === "All images" ? `/images/search/${query ? `?${query}` : ""}` : `/${topCat.toLowerCase()}/search/${query ? `?${query}` : ""}`)
                        }
                    }}></i>
                    <input type="search" placeholder='Search Pixabay' onChange={(e) => { setSearch2(e.target.value) }} value={search2} onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            const query = filterSearchParam();
                            if (search2 !== "") {
                                navigate(topCat === "All images" ? `/images/search/${search2.toLowerCase()}/${query ? `?${query}` : ""}` : `/${topCat.toLowerCase()}/search/${search2.toLowerCase()}/${query ? `?${query}` : ""}`)
                            } else {
                                navigate(topCat === "All images" ? `/images/search/${query ? `?${query}` : ""}` : `/${topCat.toLowerCase()}/search/${query ? `?${query}` : ""}`)
                            }
                        }
                    }}
                    />
                    {size > 750 && <details id='det1'>
                        <summary>
                            {topCat} <i className="ri-arrow-down-s-line"></i>
                        </summary>
                        <div>
                            <span className={topCat === "All images" ? 'cat-1 green' : "cat-1"} onClick={() => {
                                setTopCat("All images")
                                document.getElementById("det1").removeAttribute("open")
                            }}>
                                <i className="ri-image-fill"></i> All images
                            </span>
                            <span className='cat-2'>
                                <p className={topCat === "Photos" ? 'green' : ""} onClick={() => {
                                    setTopCat("Photos")
                                    document.getElementById("det1").removeAttribute("open")
                                }}><i className="ri-camera-fill"></i> Photos</p>
                                <p className={topCat === "Illustrations" ? 'green' : ""} onClick={() => {
                                    setTopCat("Illustrations")
                                    document.getElementById("det1").removeAttribute("open")
                                }}><i className="ri-ball-pen-fill"></i> Illustrations</p>
                                <p className={topCat === "Vectors" ? 'green' : ""} onClick={() => {
                                    setTopCat("Vectors")
                                    document.getElementById("det1").removeAttribute("open")
                                }}><i className="ri-pen-nib-fill"></i> Vectors</p>
                            </span>
                            <span className={topCat === "Videos" ? 'cat-3 green' : "cat-3"} onClick={() => {
                                setTopCat("Videos");
                                document.getElementById("det1").removeAttribute("open");
                            }}>
                                <i className="ri-video-on-fill"></i> Videos
                            </span>
                        </div>
                    </details>}
                </div>}
                {/* Account */}
                {
                    user ?
                        <>
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

                {/* user ka hameburgur icon */}
                {size <= 750 && <div className="user-hameburgur" onClick={() => { setHemSlider({ ...hemSlider, track: "hem", open: hemSlider.track === "hem" ? !hemSlider.open : true }) }}>
                    <i className="ri-menu-fill"></i>
                </div>}

            </header>

            {/* hemburgur */}
            {(hemSlider.track !== "unknown" && hemSlider.track === "user" ? size <= 750 ? hemSlider.open : false : hemSlider.open) && <div className="hem-menu-container">
                <div className={hemSlider.track === "user" ? "hem-menu login" : hemSlider.track === "hem" ? "hem-menu hem" : "hem-menu"}>
                    <div className="hem-menu-header">
                        {hemSlider.track === "hem" && <div className="logo">
                            px
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
                                <div className={topCat === "All images" ? "allimages green" : "allimages"} onClick={() => {
                                    setTopCat("All images")
                                    document.getElementsByClassName("hem-menu-container")[0].classList.add("go");
                                    handleAnimation();
                                }}><i className="ri-image-fill"></i> All Images</div>
                                <div className={topCat === "Photos" ? "photos green" : "photos"} onClick={() => {
                                    setTopCat("Photos")
                                    document.getElementsByClassName("hem-menu-container")[0].classList.add("go");
                                    handleAnimation();
                                }}><i className="ri-camera-fill"></i> Photos</div>
                                <div className={topCat === "Illustrations" ? "illustrations green" : "illustrations"} onClick={() => {
                                    setTopCat("Illustrations")
                                    document.getElementsByClassName("hem-menu-container")[0].classList.add("go");
                                    handleAnimation();
                                }}><i className="ri-ball-pen-fill"></i> Illustrations</div>
                                <div className={topCat === "Vectors" ? "vectors green" : "vectors"} onClick={() => {
                                    setTopCat("Vectors")
                                    document.getElementsByClassName("hem-menu-container")[0].classList.add("go");
                                    handleAnimation();
                                }}><i className="ri-pen-nib-fill"></i> Vectors</div>
                                <div className={topCat === "Videos" ? "videos green" : "videos"} onClick={() => {
                                    setTopCat("Videos")
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

            <div className="hero-main-con">
                {size > 1000 ? <div className="hero-main-title">Stunning royalty-free images & royalty-free stock</div> : null}
                <div className="hero-main-cat">
                    <NavLink to={'/'} className="allimages cat-div">All Images</NavLink>
                    <NavLink to={'/photos/'} className="photos cat-div">Photos</NavLink>
                    <NavLink to={'/illustrations/'} className="illustrations cat-div">Illustrations</NavLink>
                    <NavLink to={'/vectors/'} className="vectors cat-div">Vectors</NavLink>
                    <NavLink to={'/videos/'} className="videos cat-div">Videos</NavLink>
                </div>
                <div className="hero-main-search">
                    <i className="ri-search-line" onClick={() => {
                        const query = filterSearchParam()
                        if (search !== "") {
                            navigate(loc.pathname === "/" ? `/images/search/${search.toLowerCase()}/${query ? `?${query}` : ""}` : `${loc.pathname}search/${search.toLowerCase()}/${query ? `?${query}` : ""}`)
                        } else {
                            navigate(loc.pathname === "/" ? `/images/search/${query ? `?${query}` : ""}` : `${loc.pathname}search/${query ? `?${query}` : ""}`)
                        }
                    }}></i>
                    <input placeholder={`Search for ${loc.pathname === "/" ? "photos , vectors & illustrations" : loc.pathname.substring(1, loc.pathname.length - 1)} `} value={search} onChange={(e) => { setSearch(e.target.value) }} type="text" onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            const query = filterSearchParam();
                            if (search !== "") {
                                navigate(loc.pathname === "/" ? `/images/search/${search.toLowerCase()}/${query ? `?${query}` : ""}` : `${loc.pathname}search/${search.toLowerCase()}/${query ? `?${query}` : ""}`)
                            } else {
                                navigate(loc.pathname === "/" ? `/images/search/${query ? `?${query}` : ""}` : `${loc.pathname}search/${query ? `?${query}` : ""}`)
                            }
                        }
                    }} />
                    <i className="ri-close-line" onClick={() => { setSearch("") }}></i>
                </div>
                {tags.length > 0 && <div className="hero-main-keyword">
                    {tags.map((ele, idx) => {
                        return <div key={idx}><NavLink className="keyword-div" to={`${ele[2] === "/" ? '/images/' : ele[2]}search/${ele[0]}/`}>{ele[0]}</NavLink></div>
                    })}
                </div>}
            </div>

            {(data && data.length > 0) && <div className="hero-footer-con">
                <div className="left">Free image by <NavLink to={`${["film", "animation"].includes(data[99].type) ? "/videos" : "/" + data[99].type.split("/")[0] + "s"}/${data[99].tags.replaceAll(" ", "-").split(",").slice(0, 3).join("")}-${data[99].id}`} className={"div-span"}>{data[0].user}</NavLink></div>
            </div>}
        </div>

        {(!user && authTrace) && <LoginPage authTrace={authTrace} setAuthTrace={setAuthTrace} setIsForgot={setIsForgot} />}

        {profile && <ProfilePage profile={profile} setProfile={setProfile} user={user} setUser={setUser} setShowDelete={setShowDelete} />}

        {showDelete && <DeletePage setShowDelete={setShowDelete} user={user} />}

        {isForgot && <ForgotPage setIsForgot={setIsForgot} />}
    </>
}

export default Hero