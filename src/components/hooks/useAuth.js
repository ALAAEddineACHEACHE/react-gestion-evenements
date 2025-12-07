import { useContext } from "react";
import { AuthContext } from "../../providers/AuthProvider";

import { registerUser, verifyUser, loginUser } from "../services/authService";

export default function useAuth() {
    const { user, token, login, logout } = useContext(AuthContext);

    const register = async (form) => {
        return await registerUser(form);
    };

    const verifyAccount = async (email, code) => {
        return await verifyUser(email, code);
    };

    const authenticate = async (form) => {
        const data = await loginUser(form); // { token, user }
        login(data); // stocke token + user
        return data;
    };

    return { user, token, login, logout, register, verifyAccount, authenticate };
}
