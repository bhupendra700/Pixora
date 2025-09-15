import React, { useEffect } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'

const CleanSlash = ({children}) => {
    const loc = useLocation();
    const navigate = useNavigate();
    const [searchParam , setSearchParam] = useSearchParams();

    useEffect(() => {
        navigate(loc.pathname.split("/").filter((ele) => {
            return ele !== ""
        }).join("/")+`/?${searchParam}` , {replace : true});
    }, [loc.pathname])

    return children
}

export default CleanSlash