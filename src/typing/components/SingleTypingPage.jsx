import { useEffect, useRef, useState } from 'react';
import Keyboard from './Keyboard';
import '../styles/mainpage.scss';
import TestTyping from './TestTyping';
import TypingResult from './TypingResult';
import SingleTyping from './SingleTyping';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
export default function SingleTypingPage({ isDarkTheme, toggleTheme, isSoundOn, toggleSound,
    selectedFont, handleFontClick, selectedSize, handleSizeClick }) {

    const typoRef = useRef(null);

    const [speed, setSpeed] = useState(0.0);
    const [accuracy, setAccuracy] = useState(0);
    const [prevSpeed, setPrevSpeed] = useState(0.0);
    const [prevAccuracy, setPrevAccuracy] = useState(0);
    const [activeTab, setActiveTab] = useState('text');
    const [choosenTime, setTime] = useState(15);
    const [result, setResult] = useState(false);

    const setNewSpeed = (wpm) => {
        setSpeed(wpm);
        setPrevSpeed(speed);
    }

    const newAccuracy = (newAccuracy) => {
        setAccuracy(newAccuracy);
        setPrevAccuracy(accuracy);
    }

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };


    const changeTime = (value) => {
        setTime(value);
    }

    const handleResetClick = () => {
        if (typoRef.current) {
            typoRef.current.resetText();
        }
    }
    return (
        <div className="single-typing">
            <Header isDarkTheme={isDarkTheme} />

            <div className={`home ${isDarkTheme ? 'dark' : ''}`}>
                {result ?
                    <TypingResult
                        speed={speed}
                        prevSpeed={prevSpeed}
                        accuracy={accuracy}
                        prevAccuracy={prevAccuracy} /> : null
                }
                <div className="toolbar-container">
                    <div className="toolbar">
                        <div className="navigation">
                            <Link to="/multiplayer/rooms" className='link'>
                                <p onClick={() => handleTabClick('multiplayer')}
                                    className={activeTab === 'multiplayer' ? 'active' : ''}>
                                    multiplayer
                                </p>
                            </Link>

                            <p onClick={() => handleTabClick('test')} className={activeTab === 'test' ? 'active' : ''}>
                                test
                            </p>
                            <p onClick={() => handleTabClick('text')} className={activeTab === 'text' ? 'active' : ''}>
                                text
                            </p>
                            <p onClick={() => handleTabClick('single')} className={activeTab === 'single' ? 'active' : ''}>
                                single
                            </p>
                            <div className="animation move">navigation</div>
                        </div>
                        <span className="separator"></span>
                        <div className="toolbar-middle">
                            {activeTab === "test" ?
                                <div className="time-options">
                                    <p onClick={() => changeTime(15)} className={choosenTime === 15 ? 'active' : ''}>15</p>
                                    <p onClick={() => changeTime(30)} className={choosenTime === 30 ? 'active' : ''}>30</p>
                                    <p onClick={() => changeTime(60)} className={choosenTime === 60 ? 'active' : ''}>60</p>
                                </div> : null
                            }
                        </div>
                        <span className="separator"></span>
                        <div className="text-config">
                            <div className="dropdown-wrapper">
                                <div className="dropdown">
                                    <p>Font</p>
                                    <ul className="dropdown-list">
                                        <li className={selectedFont === 'system-ui' ? 'selected' : ''}
                                            onClick={() => handleFontClick('system-ui')}>
                                            System-UI
                                        </li>
                                        <li className={selectedFont === 'Arial' ? 'selected' : ''}
                                            onClick={() => handleFontClick('Arial')}>
                                            Arial
                                        </li>
                                        <li className={selectedFont === 'Roboto Slab' ? 'selected' : ''}
                                            onClick={() => handleFontClick('Roboto Slab')}>
                                            Roboto Slab
                                        </li>
                                        <li className={selectedFont === 'Cambria' ? 'selected' : ''}
                                            onClick={() => handleFontClick('Cambria')}>
                                            Cambria
                                        </li>
                                    </ul>
                                </div>
                                <div className="dropdown">
                                    <p>Size</p>
                                    <ul className="dropdown-list">
                                        <li className={selectedSize === '11px' ? 'selected' : ''}
                                            onClick={() => handleSizeClick('11px')}>
                                            12px
                                        </li>
                                        <li className={selectedSize === '17px' ? 'selected' : ''}
                                            onClick={() => handleSizeClick('17px')}>
                                            18px
                                        </li>
                                        <li className={selectedSize === '22px' ? 'selected' : ''}
                                            onClick={() => handleSizeClick('22px')}>
                                            22px
                                        </li>
                                        <li className={selectedSize === '23px' ? 'selected' : ''}
                                            onClick={() => handleSizeClick('23px')}>
                                            24px
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="animation move">style</div>
                        </div>
                    </div>
                </div>
                <div className="animated-container">
                    <div className={`animated-component ${activeTab === 'text' ? 'active' : ''}`}>
                        {activeTab === 'text' && <SingleTyping
                            typoRef={typoRef}
                            isSoundOn={isSoundOn}
                            setNewSpeed={setNewSpeed}
                            newAccuracy={newAccuracy}
                            setResult={setResult}
                            isDarkTheme={isDarkTheme}
                            selectedFont={selectedFont}
                            selectedSize={selectedSize} />}
                    </div>
                    <div className={`animated-component ${activeTab === 'test' ? 'active' : ''}`}>
                        {activeTab === 'test' && <TestTyping
                            typoRef={typoRef}
                            isSoundOn={isSoundOn}
                            setNewSpeed={setNewSpeed}
                            newAccuracy={newAccuracy}
                            setResult={setResult}
                            choosenTime={choosenTime}
                            isDarkTheme={isDarkTheme}
                            selectedFont={selectedFont}
                            selectedSize={selectedSize} />}
                    </div>
                </div>

                <div className="reset-text">
                    <div className="reset-container" onClick={handleResetClick}>
                        <img src="/src/assets/refresh-button.png" alt="refresh" className="reset-img" />
                        <span>reset text</span>
                    </div>
                </div>
                <Keyboard isDarkTheme={isDarkTheme} />

            </div>
            <Footer isDarkTheme={isDarkTheme} toggleTheme={toggleTheme} isSoundOn={isSoundOn}
                toggleSound={toggleSound} />
        </div>
    )
}