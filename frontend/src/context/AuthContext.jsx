import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import api from "../services/api";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchCurrentUser = async () => {
        try {
            const response = await api.get(
                "/users/profile"
            );

            const currentUser = response.data.user;

            setUser(currentUser);

            return currentUser;

        } catch (error) {

            console.error(
                "FETCH CURRENT USER:",
                error.response?.data || error.message
            );

            setUser(null);

            return null;

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCurrentUser();
    }, []);

    const logout = async () => {
        try {
            await api.post("/users/logout");
        } catch (error) {
            console.error(
                error.response?.data || error.message
            );
        } finally {
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                loading,
                fetchCurrentUser,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () =>
    useContext(AuthContext);