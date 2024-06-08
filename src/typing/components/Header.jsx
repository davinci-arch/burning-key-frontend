import { Link } from "react-router-dom";
import Leaderboard from './Leaderboard';
import React, { useEffect, useState } from "react";
import {getRandomText} from "../api/TextAPI.jsx";
import {fetchData} from "../api/UserAPI.jsx";

export default function Header({ isDarkTheme }) {
    const [linkName, setLinkName] = useState("Sign in");
    const [token, setToken] = useState(null);


    useEffect(() => {
        const getToken = () => {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                setToken(storedToken);
            }
        };

        getToken();
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (token) {
                    const userData = await fetchData(token);
                    setLinkName(userData.email);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [token]);


    
    const data = Array.from({ length: 50 }, (_, index) => ({
        username: `User${index + 1}`,
        speed: Math.floor(Math.random() * (100 - 60 + 1)) + 60,
        accuracy: Math.floor(Math.random() * (100 - 90 + 1)) + 90
    }));

    return (
        <header className={`main-header ${isDarkTheme ? 'dark' : ''}`}>
            <div style={{display:'flex'}}>
                <Link to="/" className="nav-link">
                    <img src="/src/assets/logo.png" alt="logo" className={`logo ${isDarkTheme ? 'dark' : ''}`} />
                </Link>
                <Leaderboard data={data} isDarkTheme={false} />
            </div>
            <div className="user-panel">
                {token ? (
                    <span><Link to="/account" className={`nav-link ${isDarkTheme ? 'dark' : ''}`}>{linkName}</Link></span>
                ) : (
                    <span><Link to="/login" className={`nav-link ${isDarkTheme ? 'dark' : ''}`}>{linkName}</Link></span>
                )}
            </div>
        </header>
    );
}
