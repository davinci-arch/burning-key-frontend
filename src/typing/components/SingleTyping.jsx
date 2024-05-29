import { useEffect, useRef, useState } from 'react';
import Typing from './Typing';
import Keyboard from './Keyboard';
import '../styles/mainpage.scss';

export default function SingleTyping({ isSoundOn }) {

    const typoRef = useRef(null);
    const [activeTab, setActiveTab] = useState('text');

    const [speed, setSpeed] = useState(0.0);
    const [accuracy, setAccuracy] = useState(0);
    const [prevSpeed, setPrevSpeed] = useState(0.0);
    const [prevAccuracy, setPrevAccuracy] = useState(0);

    const setNewSpeed = (wpm) => {
        setSpeed(wpm);
        setPrevSpeed(speed);
    }

    const newAccuracy = (newAccuracy) => {
        setAccuracy(newAccuracy);
        setPrevAccuracy(accuracy);
    }

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
    }
    return (
        <>
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
                        <div className="speed-container">
                            <span style={{ marginLeft: '25px', marginRight: '3px', color: 'indigo', fontSize: '17px' }}>
                                Speed:
                            </span>
                            <span className="speed-value">{speed.toFixed(1)}wpm</span> (
                            <span className={getColorClass(speed, prevSpeed)}>
                                {speed - prevSpeed >= 0 ? '↑+' : '↓'}{(speed - prevSpeed).toFixed(1)}wpm
                            </span>)
                        </div>
                        <div className="accuracy-container">
                            <span style={{ marginLeft: '30px', marginRight: '3px', color: 'indigo', fontSize: '17px' }}>
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
                        <p>font</p>
                        <p>size</p>
                        <div className="animation move">style</div>
                    </div>
                </div>
            </div>
            <div className="animated-container">
                <div className={`animated-component ${activeTab === 'text' ? 'active' : ''}`}>
                    {activeTab === 'text' && <Typing ref={typoRef} isSoundOn={isSoundOn} setNewSpeed={setNewSpeed} newAccuracy={newAccuracy} />}
                </div>
                <div className={`animated-component ${activeTab === 'test' ? 'active' : ''}`}>
                    {activeTab === 'test' && <Typing />}
                </div>
            </div>

            <div className="reset-text">
                <div className="reset-container" onClick={handleResetClick}>
                    <img src="src/assets/refresh-button.png" alt="refresh" className="reset-img" />
                    <span>reset text</span>
                </div>
            </div>
            <Keyboard />
        </>
    )
}