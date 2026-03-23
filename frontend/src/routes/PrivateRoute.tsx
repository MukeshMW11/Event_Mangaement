import { Outlet, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const PrivateRoute = () => {
    const { isLoading, isAuthenticated } = useAuth();
    const location = useLocation();
    if (isLoading) return <p>Checking Authentication</p>



    return isAuthenticated ?
        (
            <Outlet />
        ) :
        (
            <Navigate to={"/login"} replace state={{ from: location }} />
        )

};


export default PrivateRoute;