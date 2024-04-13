import axios from "axios";
import { useEffect, useState } from "react";

const useLogin = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [user, setUser] = useState(null);
    const [token, setToken] = useState('');
    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
            if (token) {
                setToken(token);
                // Perform a GET request to the protected route
                axios.get('http://localhost:3000/api/auth/protected', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                    .then(res => {
                        // Token is valid
                        setUser(res.data.user);
                        setIsAuthenticated(true);
                    })
                    .catch(err => {
                        // Token is invalid
                        console.log(err);
                        setIsAuthenticated(false);
                    });
            } else {
                // Token not present, user is not authenticated
                setIsAuthenticated(false);
            }
        }, []);
    return({isAuthenticated, user, token});
}

export default useLogin;