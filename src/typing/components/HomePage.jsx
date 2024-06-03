
import { useEffect, useRef, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import '../styles/mainpage.scss';

export default function HomePage({isDarkTheme, toggleTheme, isSoundOn, toggleSound,
                                     selectedFont, handleFontClick, selectedSize, handleSizeClick}) {
    const typoRef = useRef(null);
    const [activeTab, setActiveTab] = useState('text');
    const [speed, setSpeed] = useState(0.0);
    const [accuracy, setAccuracy] = useState(0);
    const [prevSpeed, setPrevSpeed] = useState(0.0);
    const [prevAccuracy, setPrevAccuracy] = useState(0);


    const setNewSpeed = (wpm) => {
        setSpeed(wpm);
        setPrevSpeed(speed);
    };

    const newAccuracy = (newAccuracy) => {
        setAccuracy(newAccuracy);
        setPrevAccuracy(accuracy);
    };

    const getColorClass = (current, previous) => {
        if (current > previous) {
            return 'positive';
        } else if (current < previous) {
            return 'negative';
        }
        return '';
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const handleResetClick = () => {
        if (typoRef.current) {
            typoRef.current.resetText();
        }
    };



    return (
        <div className={`home ${isDarkTheme ? 'dark' : ''}`}>
            <Header isDarkTheme={isDarkTheme} />
            <div className="toolbar-container">
                <div className="toolbar">
                    <div className="navigation">
                        <p onClick={() => handleTabClick('multiplayer')}
                           className={activeTab === 'multiplayer' ? 'active' : ''}>
                            multiplayer
                        </p>
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
                    <div className="empty-middle">
                        <div>
                            <span className="span-name">
                                Speed:
                            </span>
                            <span className="speed-value">{speed.toFixed(1)}wpm</span> (
                            <span className={getColorClass(speed, prevSpeed)}>
                                {speed - prevSpeed >= 0 ? '↑+' : '↓'}{(speed - prevSpeed).toFixed(1)}wpm
                            </span>)
                        </div>
                        <div >
                            <span className="span-name">
                                Accuracy:
                            </span>
                            <span className="accuracy-value">{accuracy.toFixed(1)}%</span> (
                            <span className={getColorClass(accuracy, prevAccuracy)}>
                                {accuracy - prevAccuracy >= 0 ? '↑+' : '↓'}{(accuracy - prevAccuracy).toFixed(1)}%
                            </span>)
                        </div>
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
                    {activeTab === 'text' &&
                        <Typing ref={typoRef} isDarkTheme={isDarkTheme} isSoundOn={isSoundOn} setNewSpeed={setNewSpeed}
                                newAccuracy={newAccuracy} selectedFont={selectedFont} selectedSize={selectedSize}/>}
                </div>
                <div className={`animated-component ${activeTab === 'test' ? 'active' : ''}`}>
                    {activeTab === 'test' && <Typing/>}
                </div>
            </div>
            <div className="reset-text">
                <div className="reset-container" onClick={handleResetClick}>
                    <img src="src/assets/refresh-button.png" alt="refresh" className="reset-img"/>
                    <span>reset text</span>
                </div>
            </div>
            <Keyboard isDarkTheme={isDarkTheme}/>
            <Footer isDarkTheme={isDarkTheme} toggleTheme={toggleTheme} isSoundOn={isSoundOn}
                    toggleSound={toggleSound}/>
        </div>
    );
}
