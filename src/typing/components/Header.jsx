import { Link } from "react-router-dom";
import Leaderboard from './Leaderboard';
import React from "react";

export default function Header({ isDarkTheme }) {
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
                <span><Link to="/login" className={`nav-link ${isDarkTheme ? 'dark' : ''}`}>Sign in</Link></span>
            </div>
        </header>
    )
}
