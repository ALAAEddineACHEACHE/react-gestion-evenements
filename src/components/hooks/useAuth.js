// src/hooks/useAuth.js
import { useContext } from "react";
import { registerUser, verifyUser, loginUser } from "../services/authService";
import {AuthContext} from "../../providers/AuthProvider";

export default function useAuth() {
    const { user, token, login, logout } = useContext(AuthContext);

    const register = async (form) => {
        return await registerUser(form);
    };

    const verifyAccount = async (email, code) => {
        return await verifyUser(email, code);
    };

    const authenticate = async (form) => {
        try {
            console.log('🔍 [useAuth] Calling login API with:', form);
            const response = await loginUser(form);

            console.log('🔍 [useAuth] Raw API response:', response);

            // Normaliser la réponse selon différentes structures possibles
            let normalizedData;

            if (response.token) {
                // Structure 1: { token, type, id, username, email, roles: [] }
                normalizedData = {
                    token: response.token,
                    user: {
                        id: response.id,
                        email: response.email,
                        username: response.username,
                        role: response.roles?.[0] || response.role
                    }
                };
            } else if (response.accessToken) {
                // Structure 2: { accessToken, tokenType, id, username, email, roles: [] }
                normalizedData = {
                    token: response.accessToken,
                    user: {
                        id: response.id,
                        email: response.email,
                        username: response.username,
                        role: response.roles?.[0] || response.role
                    }
                };
            } else if (response.data) {
                // Structure 3: { data: { token, user: {...} } }
                normalizedData = {
                    token: response.data.token || response.data.accessToken,
                    user: {
                        id: response.data.user?.id || response.data.id,
                        email: response.data.user?.email || response.data.email,
                        username: response.data.user?.username || response.data.username,
                        role: response.data.user?.role || response.data.roles?.[0]
                    }
                };
            } else {
                // Structure par défaut
                normalizedData = {
                    token: response.jwt || response.access_token,
                    user: {
                        id: response.userId || response.id,
                        email: response.email,
                        username: response.username,
                        role: response.role || response.authorities?.[0]?.authority
                    }
                };
            }

            console.log('🔍 [useAuth] Normalized data:', normalizedData);

            // Vérifier que les données essentielles sont présentes
            if (!normalizedData.token) {
                throw new Error('No token received from server');
            }

            if (!normalizedData.user.role) {
                console.warn('⚠️ No role found in response, defaulting to ROLE_USER');
                normalizedData.user.role = 'ROLE_USER';
            }

            // Appeler la fonction login du contexte
            if (login) {
                login(normalizedData);
            }

            return normalizedData;
        } catch (error) {
            console.error('❌ [useAuth] Authentication error:', error);
            console.error('❌ Error details:', error.response?.data || error.message);
            throw error;
        }
    };

    const logoutUser = () => {
        // Nettoyer localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        localStorage.removeItem('userId');

        // Appeler logout du contexte
        if (logout) {
            logout();
        }

        // Déclencher les événements
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new CustomEvent('auth-change'));
    };

    return {
        user,
        token,
        login,
        logout: logoutUser,
        register,
        verifyAccount,
        authenticate
    };
}