import { useEffect, useRef, useState } from 'react';
import Typing from './Typing';
import Keyboard from './Keyboard';
import '../styles/mainpage.scss';
import TestTyping from './TestTyping';
import TypingResult from './TypingResult';
import SingleTyping1 from './SingleTyping';
export default function SingleTyping({ isSoundOn }) {

    const typoRef = useRef(null);
    const [activeTab, setActiveTab] = useState('text');

    const [speed, setSpeed] = useState(0.0);
    const [accuracy, setAccuracy] = useState(0);
    const [prevSpeed, setPrevSpeed] = useState(0.0);
    const [prevAccuracy, setPrevAccuracy] = useState(0);

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

    const handleResetClick = () => {
        if (typoRef.current) {
            typoRef.current.resetText();
        }
    }
    return (
        <>
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
                    {activeTab === 'text' && <SingleTyping1 typoRef={typoRef} isSoundOn={isSoundOn} setNewSpeed={setNewSpeed} newAccuracy={newAccuracy} setResult={setResult}/>}
                </div>
                <div className={`animated-component ${activeTab === 'test' ? 'active' : ''}`}>
                    {activeTab === 'test' && <TestTyping typoRef={typoRef} isSoundOn={isSoundOn} setNewSpeed={setNewSpeed} newAccuracy={newAccuracy} setResult={setResult} />}
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