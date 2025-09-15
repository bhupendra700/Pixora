import { useEffect, useState } from "react";

export default function useWindowSize() {
    const [size, setSize] = useState(window.innerWidth);

    const handleSize = () => {
        setSize(window.innerWidth);
    }

    useEffect(() => {
        window.addEventListener('resize', handleSize)
        return () => window.removeEventListener('resize', handleSize);
    }, [])

    return size
}
