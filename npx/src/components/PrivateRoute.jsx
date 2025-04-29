import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children, allowedRoles = [] }) => {
    const { user, isLoading } = useContext(AuthContext);
    console.log(user);
    
    const location = useLocation();

    if (isLoading) return <div>Loading...</div>;

    if (!user) {
        return <Navigate to="/signin" state={{ from: location }} replace />;
    }
    debugger
    if (allowedRoles.length > 0 && !allowedRoles.some(role => user.role?.includes(role))) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default PrivateRoute;