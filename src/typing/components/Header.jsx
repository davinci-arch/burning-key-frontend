import { Link } from "react-router-dom";
import Leaderboard from './Leaderboard';
import React, { useEffect, useState } from "react";
import { fetchData } from "../api/UserAPI.jsx";
import {fetchStatisticData} from "../api/StatisticAPI.jsx";

export default function Header({ isDarkTheme }) {
    const [linkName, setLinkName] = useState(null);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const getToken = () => {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                setToken(storedToken);
            } else {
                setLinkName("Sign in");
            }
        };
        getToken();
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (token) {
                    const userData = await fetchData(token);
                    setLinkName(userData.nickname);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                setLinkName("Sign in");
            }
        };
        fetchUserData();
    }, [token]);


    return (
        <header className={`main-header ${isDarkTheme ? 'dark' : ''}`}>
            <div style={{ display: 'flex' }}>
                <Link to="/" className="nav-link">
                    <img src="/src/assets/logo.png" alt="logo" className={`logo ${isDarkTheme ? 'dark' : ''}`} />
                </Link>
                <Leaderboard  isDarkTheme={false} />
            </div>
            <div className="user-panel">
                {linkName === null ? null : (
                    token ? (
                        <span className={`nav-link ${isDarkTheme ? 'dark' : ''}`}>
                             <Link to="/account" className={`user-avatar ${isDarkTheme ? 'dark' : ''}`}>
                             <img src="/src/assets/avatar.png" alt="User Avatar" className="avatar-image"/>
                                {linkName}
                            </Link>
                        </span>
                    ) : (
                        <span className="user-avatar">
                            <Link to="/login" className={`nav-link ${isDarkTheme ? 'dark' : ''}`}>
                                {linkName}
                            </Link>
                        </span>
                    )
                )}
            </div>
        </header>
    );
}
