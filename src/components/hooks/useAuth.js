import { useContext } from "react";
import { registerUser, verifyUser, loginUser } from "../services/authService";
import {AuthContext} from "../../providers/AuthProvider";

export default function useAuth() {
    const { login } = useContext(AuthContext);

    const register = async (form) => {
        return await registerUser(form);
    };

    const verifyAccount = async (email, code) => {
        return await verifyUser(email, code);
    };

    const authenticate = async (form) => {
        const data = await loginUser(form);
        login(data);
        return data;
    };

    return { register, verifyAccount, authenticate };
}
