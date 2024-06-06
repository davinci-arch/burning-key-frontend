import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './typing/styles/index.scss';
import SignPage from './typing/components/SigninPage';
import SingleTypingPage from './typing/components/SingleTypingPage';
import Rooms from './typing/components/multiplayer/Rooms';
import MultiplayerTypingPage from './typing/components/multiplayer/MultiplayerTypingPage';
import RoomSettings from './typing/components/multiplayer/RoomSettings';
function App() {
    const [isSoundOn, setSoundState] = useState(() => {
        const savedSound = localStorage.getItem('sound');
        return savedSound === 'on';
    });

    const [isDarkTheme, setIsDarkTheme] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme === 'dark';
    });

    const [selectedFont, setSelectedFont] = useState(() => {
        return localStorage.getItem('font') || 'system-ui';
    });

    const [selectedSize, setSelectedSize] = useState(() => {
        return localStorage.getItem('size') || '22px';
    });

    const toggleTheme = () => {
        setIsDarkTheme(prevTheme => !prevTheme);
    };

    const toggleSound = () => {
        setSoundState(prevSound => !prevSound);
    };

    const handleFontClick = (font) => {
        setSelectedFont(font);
    };

    const handleSizeClick = (size) => {
        setSelectedSize(size);
    };

    useEffect(() => {
        localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
    }, [isDarkTheme]);

    useEffect(() => {
        localStorage.setItem('sound', isSoundOn ? 'on' : 'off');
    }, [isSoundOn]);

    useEffect(() => {
        localStorage.setItem('font', selectedFont);
    }, [selectedFont]);

    useEffect(() => {
        localStorage.setItem('size', selectedSize);
    }, [selectedSize]);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<SingleTypingPage
                    isDarkTheme={isDarkTheme}
                    toggleTheme={toggleTheme}
                    isSoundOn={isSoundOn}
                    toggleSound={toggleSound}
                    selectedFont={selectedFont}
                    handleFontClick={handleFontClick}
                    selectedSize={selectedSize}
                    handleSizeClick={handleSizeClick}
                />} />
                <Route path="/login" element={<SignPage
                    isDarkTheme={isDarkTheme}
                    toggleTheme={toggleTheme}
                    isSoundOn={isSoundOn}
                    toggleSound={toggleSound}
                    selectedFont={selectedFont}
                    handleFontClick={handleFontClick}
                    selectedSize={selectedSize}
                    handleSizeClick={handleSizeClick}
                />} />
                <Route path="/multiplayer/rooms" element={<Rooms />} />
                <Route path="/multiplayer/rooms/room/:uuid" element={<MultiplayerTypingPage />} />
                <Route path="/multiplayer/rooms/room-settings" element={<RoomSettings />} />
            </Routes>
        </Router>
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
