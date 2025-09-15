import { useEffect, useState } from 'react'
import Header from './Header'
import Main from './Main'
import Footer from '../Page1/Footer'
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useLocation, useParams, useSearchParams } from 'react-router-dom'
import { useInView } from 'react-intersection-observer'

const Page2Search = () => {
    const [safeSearch, setSafeSearch] = useState(localStorage.getItem('safeSearch') ? localStorage.getItem('safeSearch') === 'true' ? true : false : "");

    //setting safeSearch in localStorage
    useEffect(() => {
        if (safeSearch !== "") localStorage.setItem("safeSearch", safeSearch);
    }, [safeSearch]);

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
    }, [])

    const [url, setUrl] = useState("");

    const { cat, text } = useParams();

    const [searchParam] = useSearchParams();

    const loc = useLocation();

    useEffect(() => {
        let query = "";

        if(text.trim()){
            query += `&q=${encodeURIComponent(text.trim().replace(/\s+/g, ' '))}`
        }

        query += searchParam.get("order") === "popular" ? "&order=popular" : searchParam.get("order") === "ec" ? "&editors_choice=true" :"&editors_choice=false&order=latest"

        if (searchParam.has("orientation") && ["horizontal", "vertical"].includes(searchParam.get("orientation"))) {
            query += `&orientation=${searchParam.get("orientation")}`
        }

        if (searchParam.has("min_width") && !isNaN(searchParam.get("min_width"))) {
            query += `&min_width=${searchParam.get("min_width")}`
        }

        if (searchParam.has("min_height") && !isNaN(searchParam.get("min_height"))) {
            query += `&min_height=${searchParam.get("min_height")}`
        }

        if (searchParam.has("colors")) {
            const validColor = ["grayscale", "transparent", "red", "orange", "yellow", "green", "turquoise", "blue", "lilac", "pink", "white", "gray", "black", "brown"];

            const colorArray = Array.from(new Set(searchParam.getAll("colors")));

            let allValidColor = colorArray.filter((colorele) => {
                return validColor.includes(colorele);
            })

            for (let i = 0; i < allValidColor.length; i++) {
                query += `&colors=${allValidColor[i]}`;
            }
        }

        query += safeSearch === "" ? "&safesearch=true" : `&safesearch=${safeSearch}`;

        setUrl(cat === "videos" ? `https://pixabay.com/api/videos/?key=${import.meta.env.VITE_API_KEY}&per_page=100${query}` : cat === "images" ? `https://pixabay.com/api/?key=${import.meta.env.VITE_API_KEY}&image_type=all&per_page=100${query}` : `https://pixabay.com/api/?key=${import.meta.env.VITE_API_KEY}&image_type=${cat.slice(0, -1)}&per_page=100${query}`);

    }, [searchParam, loc.pathname, safeSearch, text])

    const { ref, inView } = useInView()

    const fetchAPI = async ({ pageParam = 1, queryKey }) => {
        const [_key, urlKey] = queryKey;

        const finalUrl = urlKey + `&page=${pageParam}`

        try {
            const res = await axios.get(finalUrl);
            return res.data;
        } catch (error) {
            throw error
        }

    }

    let { data, error, isFetching, fetchNextPage } = useInfiniteQuery({
        queryKey: ["searchQuery", url],
        queryFn: fetchAPI,
        getNextPageParam: (lastPages, allPages) => {
            return lastPages.totalHits / 100 > allPages.length ? allPages.length + 1 : undefined;
        },
        staleTime: 1000 * 60 * 20,
        cacheTime: 1000 * 60 * 20,
        placeholderData: keepPreviousData,
        enabled: !!url
    })

    useEffect(() => {
        if (inView) {
            fetchNextPage()
        }
    }, [inView])

    useEffect(() => {
        document.title = `${(data && data.pages[0].total > 0) ? `${data.pages[0].total.toLocaleString("en-IN")} - Free ${text.trim().replace(/\s+/g , ' ').split(" ").map((ele)=> ele.substring(0,1).toUpperCase()+ele.substring(1)).join(" ")} ${cat.slice(0, 1).toUpperCase() + cat.slice(1)} on Pixora` : `Free ${cat.slice(0, 1).toUpperCase() + cat.slice(1)} on Pixora`}`;
    }, [loc.pathname, data])

    useEffect(() => {
        window.scrollTo({
            top: 0,
        })
    }, [cat, searchParam , text])

    if (error) return <></>

    if (!data) return <></>

    return <>
        <Header safeSearch={safeSearch} setSafeSearch={setSafeSearch} />
        <Main data={data} error={error} ref={ref} isFetching={isFetching} />
        <Footer />
    </>
}

export default Page2Search