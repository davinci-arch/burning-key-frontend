import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './typing/styles/index.scss';
import HomePage from './typing/components/HomePage';
import SignPage from './typing/components/SigninPage';
ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Router >
            <HomePage />
        </Router>
            
    </React.StrictMode>,
);