import { Link } from "react-router-dom";
import Leaderboard from './Leaderboard';
import React, {useEffect, useState} from "react";
import CryptoJS from "crypto-js";

export default function Header({ isDarkTheme }) {
    const [userData, setUserData] = useState(() => {
        const encryptedUserData = localStorage.getItem('userData');
        if (encryptedUserData) {
            const bytes = CryptoJS.AES.decrypt(encryptedUserData, 'secret_key');
            const decryptedUserData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            return decryptedUserData;
        }
        return {};
    });
    const [img, setImg] = useState(() => {
        localStorage.getItem('userImage') || null
    });

    useEffect(() => {
        const encryptedUserData = localStorage.getItem('userData');
        if (encryptedUserData) {
            const bytes = CryptoJS.AES.decrypt(encryptedUserData, 'secret_key');
            const decryptedUserData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            setUserData(decryptedUserData);
        }
    }, [localStorage.getItem('userData')]);

    useEffect(() => {
        if(localStorage.getItem('userImage') !== img)
        setImg(localStorage.getItem('userImage'))
    }, [localStorage.getItem('userImage')]);

    const linkName = userData.nickname || "Sign In";

    return (
        <header className={`main-header ${isDarkTheme ? 'dark' : ''}`}>
            <div style={{ display: 'flex' }}>
                <Link to="/" className="nav-link">
                    <img src="/src/assets/logo.png" alt="logo" className={`logo ${isDarkTheme ? 'dark' : ''}`} />
                </Link>
                <Leaderboard />
            </div>
            <div className="user-panel" style={{ display: 'flex' }}>
                {localStorage.getItem('token') ? (
                    <span className={`nav-link ${isDarkTheme ? 'dark' : ''}`}>
                        <Link to="/account" className={`user-avatar ${isDarkTheme ? 'dark' : ''}`}>
                            <img src={`data:image/jpeg;charset=utf-8;base64,${img}`} alt="User Avatar" className="avatar-image" />
                            {linkName}
                        </Link>
                    </span>
                ) : (
                    <span className="user-avatar" style={{ marginRight: "20px" }}>
                        <Link to="/login" className={`nav-link ${isDarkTheme ? 'dark' : ''}`}>
                            {linkName}
                        </Link>
                    </span>
                )}
            </div>
        </header>
    );
}
