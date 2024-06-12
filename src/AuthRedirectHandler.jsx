import React, { useEffect } from 'react';
import {fetchData, fetchImage} from './typing/api/UserAPI.jsx';
import CryptoJS from 'crypto-js';

const AuthRedirectHandler = () => {
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await fetchData(token);
                const encryptedUserData = CryptoJS.AES.encrypt(
                    JSON.stringify(userData),
                    'secret_key'
                ).toString();
                localStorage.setItem('userData', encryptedUserData);
                const userImage = await fetchImage(userData.userId);
                localStorage.setItem('userImage', userImage);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        const queryParams = new URLSearchParams(window.location.search);
        const token = queryParams.get('token');

        if (token) {
            localStorage.setItem('token', token);
            window.location.replace('/');
        }

        fetchUserData();
    }, []);

    return null;
};

export default AuthRedirectHandler;
