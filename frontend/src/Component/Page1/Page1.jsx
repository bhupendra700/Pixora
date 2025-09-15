import { useEffect, useState } from "react"
import Hero from "./Hero"
import Main from "./Main"
import Footer from "./Footer";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "axios";
const Page1 = () => {
  const loc = useLocation();

  const {cat} = useParams();

  const [searchParam] = useSearchParams();

  //for safe search
  const [safeSearch, setSafeSearch] = useState(localStorage.getItem('safeSearch') ? localStorage.getItem('safeSearch') === 'true' ? true : false : "");

  //setting safeSearch in localStorage
  useEffect(() => {
    if (safeSearch !== "") localStorage.setItem("safeSearch", safeSearch);
  }, [safeSearch]);

  const [url , setUrl] = useState("");

  useEffect(()=>{
    const order = searchParam.get("order") === "popular" ? "order=popular" : searchParam.get("order") === "latest" ? "editors_choice=false&order=latest" : "editors_choice=true"

    const safeSearchquery = safeSearch === "" ? true : safeSearch;

    setUrl(cat ? cat === "videos" ? `https://pixabay.com/api/videos/?key=${import.meta.env.VITE_API_KEY}&per_page=200&${order}&safesearch=${safeSearchquery}` : `https://pixabay.com/api/?key=${import.meta.env.VITE_API_KEY}&image_type=${cat.slice(0,-1)}&per_page=200&${order}&safesearch=${safeSearchquery}` : `https://pixabay.com/api/?key=${import.meta.env.VITE_API_KEY}&image_type=all&per_page=200&${order}&safesearch=${safeSearchquery}`)

  }, [loc.pathname, searchParam, safeSearch])

  //fetch data
  const fetchData = async ({ queryKey }) => {
    let [_key, urlKey] = queryKey;

    const res = await axios.get(urlKey);
    return res.data.hits;
  }

  const { data, error } = useQuery({
    queryKey: ["Home", url],
    queryFn: fetchData,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 20,
    cacheTime: 1000 * 60 * 20,
    enabled : !!url
  })

  useEffect(() => {
    document.title = `Home - ${loc.pathname === "/" ? "Images" : loc.pathname.slice(1, 2).toUpperCase() + loc.pathname.slice(2, -1)}`;
  }, [loc.pathname])

  useEffect(() => {
    window.scrollTo({
      top: 0,
    })
  }, [loc.pathname])

  useEffect(() => {
    if (error) {
      console.log("Error: ", error);
    }
  }, [error])

  if (!data || error) return <></>

  return <>
    <Hero setSafeSearch={setSafeSearch} safeSearch={safeSearch} />
    <Main data={data} />
    <Footer />
  </>
}

export default Page1