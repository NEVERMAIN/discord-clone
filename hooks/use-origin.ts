import { useEffect, useState } from "react"
/**
 * 获取当前服务器的地址 ip+port
 * @returns 
 */
export const useOrigin = ()=>{
    const [mounted,setMounted] = useState(false);

    useEffect(()=>{
        setMounted(true);
    },[])

    const origin = typeof window !== "undefined" && window.location.origin ? window.location.origin : "";

    if(!mounted){
        return "";
    }

    return origin;
}