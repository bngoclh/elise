import { useState, useEffect } from 'react';
import axios from "axios";
import { Heading } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';


const AuthCredential = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [user, setUser] = useState(null);

    useEffect(() => {
        // Check if token is present in localStorage
        const token = localStorage.getItem('jwtToken');
        if (token) {
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

    const handleLogout = () => {
        // Perform a GET request to the logout route
        axios.get('http://localhost:3000/api/auth/logout')
            .then(res => {
                // Clear the token from localStorage
                localStorage.removeItem('jwtToken');
                setIsAuthenticated(false);
                alert(res.data.message);
                window.location.href = '/';
            })
            .catch(err => {
                // Print the error message from the server
                alert(err.response.data.message);
            });
    }


    
    return (
        <>
            {isAuthenticated ? (
                <div>
    
                    <Heading marginBottom={2} cursor='pointer' onClick={() => window.location.href = '/user/' + user._id}>
                        Hello, {user.name}
                    </Heading>
                    <button style={{width: "auto"}} onClick={handleLogout}>
                        <p style={{fontSize: 30}}>Logout</p>
                        </button>
                </div>
            ) : (
                <div>
                    {/* Button redirecting to login page */}
                        <Heading marginBottom={2} cursor='pointer' onClick={() => window.location.href = '/login'
                        }>
                            Login 
                        </Heading>
            </div>


            )}
        
        </>
    );
}

export default AuthCredential;
