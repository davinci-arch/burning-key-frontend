import React, { useEffect } from 'react';

const AuthRedirectHandler = () => {
    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const token = queryParams.get('token');

        if (token) {
            localStorage.setItem('token', token);
            window.location.replace('/');
        }
    }, []);
};

export default AuthRedirectHandler;
