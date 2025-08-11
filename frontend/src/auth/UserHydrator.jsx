import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { fetchUser } from "@/redux/userSlice";

export default function UserHydrator() {
    const dispatch = useDispatch();
    const bootedRef = useRef(false);

    useEffect(() => {
        console.log("[Hydrator] mount → fetchUser()");
        if (!bootedRef.current) {
            bootedRef.current = true; // StrictMode 중복 방지
            dispatch(fetchUser());
        }
        const onFocus = () => dispatch(fetchUser());
        window.addEventListener("focus", onFocus);
        return () => window.removeEventListener("focus", onFocus);
    }, [dispatch]);

    return null;
}
