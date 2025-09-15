import React, { useContext, useEffect, useRef, useState } from 'react'
import Header from './Header'
import Main from './Main'
import Footer from '../Page1/Footer'
import { useLocation, useParams, useSearchParams } from 'react-router-dom'
import { GlobalContext } from '../../App'
import axios from 'axios'
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query'
import { useInView } from 'react-intersection-observer'

const Page2 = () => {
    const loc = useLocation();

    const [safeSearch, setSafeSearch] = useState(localStorage.getItem('safeSearch') ? localStorage.getItem('safeSearch') === 'true' ? true : false : "");

    useEffect(() => {
        if (safeSearch !== "") localStorage.setItem("safeSearch", safeSearch);
    }, [safeSearch]);

    const [url, setUrl] = useState("");

    const { cat } = useParams();

    const [searchParam, setSearchParam] = useSearchParams();

    useEffect(() => {
        let query = "";

        query += searchParam.get("order") === "popular" ? "&order=popular" : searchParam.get("order") === "latest" ? "&editors_choice=false&order=latest" : "&editors_choice=true"

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

    }, [searchParam, loc.pathname, safeSearch])

    const { ref, inView } = useInView()

    const fetchAPI = async ({ pageParam = 1, queryKey }) => {
        const [_key, uryKey] = queryKey

        const finalUrl = uryKey + `&page=${pageParam}`;

        try {
            const res = await axios.get(finalUrl);
            return res.data;
        } catch (error) {
            throw error
        }
    }

    let { data, error, isFetching, fetchNextPage } = useInfiniteQuery({
        queryKey: ["search", url],
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
        if (inView && !isFetching) {
            fetchNextPage()
        }
    }, [inView , isFetching])

    useEffect(() => {
        document.title = `${(data && data.pages[0].total > 0) ? `${data.pages[0].total.toLocaleString("en-IN")} - Free ${cat.slice(0, 1).toUpperCase() + cat.slice(1)} on Pixora` : `Free ${cat.slice(0, 1).toUpperCase() + cat.slice(1)} on Pixora`}`;
    }, [loc.pathname, data])

    useEffect(() => {
        window.scrollTo({
            top: 0,
        })
    }, [cat, searchParam])

    if (error) return <></>
    
    if (!data) return <></>

    return <>
        <Header safeSearch={safeSearch} setSafeSearch={setSafeSearch} />
        <Main data={data} error={error} ref={ref} isFetching={isFetching} />
        <Footer />
    </>
}

export default Page2