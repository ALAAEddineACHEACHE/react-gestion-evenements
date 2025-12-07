import { Navigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";

export default function ProtectedUserRoute({ children }) {
    const { user } = useAuth();

    if (!user) return <Navigate to="/login" />;

    if (!user.role.includes("ROLE_USER")) {
        return <Navigate to="/forbidden" />;
    }

    return children;
}
