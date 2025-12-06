import { Navigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";

export default function ProtectedOrganizerRoute({ children }) {
    const { user } = useAuth();

    // pas connecté → login
    if (!user) return <Navigate to="/login" />;

    // check du role
    if (!user.roles.includes("ROLE_ORGANIZER")) {
        return <Navigate to="/forbidden" />;
    }

    return children;
}
