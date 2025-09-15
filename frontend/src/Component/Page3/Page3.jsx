import Header from './Header'
import Main from './Main'
import Footer from '../Page1/Footer'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import Error from '../Error/Error'
import { auth } from '../Firebase'
import { onAuthStateChanged } from 'firebase/auth'

const Page3 = () => {
  const [url, setUrl] = useState("")
  const loc = useLocation();
  const navigate = useNavigate()
  const { cat, id } = useParams()

  const [safeSearch, setSafeSearch] = useState(localStorage.getItem('safeSearch') ? localStorage.getItem('safeSearch') === 'true' ? true : false : "");

  useEffect(() => {
    if (safeSearch !== "") localStorage.setItem("safeSearch", safeSearch);
  }, [safeSearch]);

  const [searchParam , setSearchParam] = useSearchParams()

  useEffect(() => {
    let queryId = parseInt(id.split('-').pop());

    setUrl(cat === 'videos' ? `https://pixabay.com/api/videos/?key=${import.meta.env.VITE_API_KEY}&id=${queryId}` : `https://pixabay.com/api/?key=${import.meta.env.VITE_API_KEY}&id=${queryId}`)

  }, [loc.pathname])

  const fetchAPI = async () => {
    try {
      const res = await axios.get(url)
      return res.data;
    } catch (error) {
      throw error
    }
  }

  const { data: singleData, error } = useQuery({
    queryKey: ["individual_data", url],
    queryFn: fetchAPI,
    staleTime: 1000 * 60 * 20,
    cacheTime: 1000 * 60 * 20,
    enabled: !!url,
    placeholderData: keepPreviousData,
  })

  useEffect(() => {
    if (singleData && singleData.total > 0) {
      let customeId = `${singleData.hits[0].tags.replaceAll(" ", "-").split(",").slice(0, 3).join("")}-${singleData.hits[0].id}`;

      let type = ["film", "animation"].includes(singleData.hits[0].type) ? "videos" : singleData.hits[0].type.split("/")[0] + "s"

      const prevParam = searchParam.toString();
      
      type !== cat ? navigate(`/${type}/${customeId}/${prevParam ? "?" + prevParam : ""}`, { replace: true }) : customeId !== id ? navigate(`/${type}/${customeId}/${prevParam ? "?" + prevParam : ""}`, { replace: true }) : null
    }
  }, [singleData])

  const [authTrace, setAuthTrace] = useState("");

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

  useEffect(() => {
    document.title = `${(singleData && singleData.total > 0) ? `${singleData?.hits[0]?.tags.split(",").slice(0,3).join("").split(" ").map((ele)=> ele.substring(0,1).toUpperCase() + ele.substring(1)).join(" ")} - Free ${cat.slice(0, 1).toUpperCase() + cat.slice(1)} on Pixora` : `Free ${cat.slice(0, 1).toUpperCase() + cat.slice(1)}`}`;
  }, [loc.pathname, singleData])

  useEffect(() => {
    window.scrollTo({
      top: 0,
    })
  }, [cat, searchParam, singleData])

  if (error) return <Error />

  if (!singleData) return <></>

  return <>
    <Header safeSearch={safeSearch} setSafeSearch={setSafeSearch} authTrace={authTrace} setAuthTrace={setAuthTrace} user={user} setUser={setUser} />
    <Main singleData={singleData} safeSearch={safeSearch} setSafeSearch={setSafeSearch} authTrace={authTrace} setAuthTrace={setAuthTrace} user={user} setUser={setUser} />
    <Footer />
  </>
}

export default Page3