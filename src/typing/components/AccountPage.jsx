import "../styles/accountpage.scss";
import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import {deleteUser, fetchData, fetchImage, updateUser, uploadImage} from "../api/UserAPI";
import {logoutUser} from "../api/AuthAPI.jsx";
import CryptoJS from "crypto-js";


export default function AccountPage({ isDarkTheme, toggleTheme, isSoundOn, toggleSound }) {
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState(() => {
        const encryptedUserData = localStorage.getItem('userData');
        if (encryptedUserData) {
            const bytes = CryptoJS.AES.decrypt(encryptedUserData, 'secret_key');
            const decryptedUserData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            return decryptedUserData;
        }
        return {};
    });
    const [username, setUsername] = useState(userData.nickname || "nickname");
    const [email, setEmail] = useState(userData.email || "email");
    const [userIdLocal, setUserId] = useState(userData.userId || null);
    const [editMode, setEditMode] = useState(false);
    const [editedUsername, setEditedUsername] = useState('');
    const [editedEmail, setEditedEmail] = useState('');
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const storedToken = localStorage.getItem('token');

    useEffect(() => {
        const encryptedUserData = localStorage.getItem('userData');
        if (encryptedUserData) {
            const bytes = CryptoJS.AES.decrypt(encryptedUserData, 'secret_key');
            const decryptedUserData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            setUserData(decryptedUserData);
        }
    }, [localStorage.getItem('userData')]);


    const toggleEditMode = () => {
        setEditedUsername(username);
        setEditedEmail(email);
        setEditMode(!editMode);
    };

    const handleUsernameChange = (event) => {
        setEditedUsername(event.target.value);
    };

    const handleEmailChange = (event) => {
        setEditedEmail(event.target.value);
    };

    const handleCancel = () => {
        setEditMode(false);
        setAvatarPreview(null);
    };

    const handleLogout = async () => {
        try {
            const response = await logoutUser();
            localStorage.removeItem('token');
            localStorage.removeItem('userData');
            localStorage.removeItem('userImage');;
            window.location.replace('/');
        } catch (error) {
            console.error('Error logging out user:', error);
        }
    };


    const handleDeleteAccount = async () => {
        try {
        const userData =   await deleteUser(userIdLocal);
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
            localStorage.removeItem('userImage');
        window.location.replace('/');
        } catch (error) {
            console.error('Error fetching user data:', error);
            setError("Failed to fetch user data.");
        }
    };
    const fetchUserData = async () => {
        try {
            const userData = await fetchData(storedToken);
            const encryptedUserData = CryptoJS.AES.encrypt(
                JSON.stringify(userData),
                'secret_key'
            ).toString();

            localStorage.setItem('userData', encryptedUserData);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };
    const handleApply = async () => {
        setUsername(editedUsername);
        setEmail(editedEmail);
        const userUpdate = await updateUser(userIdLocal, {nickname: editedUsername});
        setEditMode(false);
        if (avatarFile) {
            const success = await uploadImage(userIdLocal, avatarFile);
            const userImage = await fetchImage(userData.userId);
            localStorage.setItem('userImage', userImage);
        }
        fetchUserData();
        setTimeout(() => {
            window.location.reload();
        }, 500);
    };


    const handleAvatarChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarFile(file);
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }

    };



    return (
        <div className={`account ${isDarkTheme ? 'dark' : ''}`}>
            <Header isDarkTheme={isDarkTheme} />
            <div className="account-container">
                {error && <p className="error-message">{error}</p>}
                <div className="user-details">
                    <div className="user-details-full">
                        {!editMode ? (
                            <img src={`data:image/jpeg;charset=utf-8;base64,${localStorage.getItem('userImage')}`} alt="User Avatar"
                                 className="account-avatar-image"/>
                        ) : (
                            <label htmlFor="avatar-upload" className="account-avatar-image-editable">
                                <input
                                    type="file"
                                    id="avatar-upload"
                                    onChange={handleAvatarChange}
                                    accept="image/*"
                                    style={{display: "none"}}
                                />
                                <div className="avatar-wrapper">
                                    <img
                                        src={avatarPreview || `data:image/jpeg;charset=utf-8;base64,${localStorage.getItem('userImage')}`}
                                        alt="User Avatar"
                                        className="account-avatar-image"
                                    />
                                    <img
                                        src={"/src/assets/edit.png"}
                                        alt="Edit Avatar"
                                        className="edit-icon"
                                    />
                                </div>
                            </label>
                        )}
                        <div>
                            {!editMode ? (
                                <div>
                                    <div>
                                        <p style={{marginBottom: "20px"}}>Name: {username}</p>
                                        <p>Email: {email}</p>
                                    </div>
                                    <button className="custom-button-user" onClick={toggleEditMode}>Edit</button>
                                </div>
                            ) : (
                                <div>
                                    <div style={{marginBottom: "0px"}}>
                                        <p style={{
                                            display: "flex",
                                            alignItems: "center"
                                        }}>Name: <input
                                            className="custom-input-user" type="text" value={editedUsername}
                                            onChange={handleUsernameChange}/></p>
                                        <p style={{
                                            marginTop: "10px",
                                            display: "flex",
                                            alignItems: "center"
                                        }}>Email: <input disabled
                                            className="custom-input-user" type="email" value={editedEmail}
                                            onChange={handleEmailChange}/></p>
                                    </div>
                                    <div className="modal-grid">
                                        <button className="custom-button-user"  onClick={handleCancel}>Cancel</button>
                                        <button className="custom-button-user" onClick={handleApply}>Apply</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="user-statistic">
                    <h2>Statistic</h2>
                </div>
                <div className="user-logout">
                    <h2>Another options</h2>
                    <div className="modal-grid">
                        <button className="custom-button-user" onClick={handleLogout}>Log Out</button>
                        <button className="custom-button-user" onClick={handleDeleteAccount}>Delete account</button>
                    </div>
                </div>
            </div>
            <Footer
                isDarkTheme={isDarkTheme}
                toggleTheme={toggleTheme}
                isSoundOn={isSoundOn}
                toggleSound={toggleSound}
            />
        </div>
    );
}
