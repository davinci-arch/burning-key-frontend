import { useState, useEffect, useRef } from "react";
import Typing from "./Typing";
import { getWordSets, generateRandomWords } from "../api/WordsAPI.jsx";
import { getRandomText } from "../api/TextAPI.jsx";

export default function SingleTyping({ typoRef, isSoundOn, setNewSpeed, newAccuracy, setResult, isDarkTheme, selectedFont, selectedSize,
                                         textAPI,setIsReserted,isReseted,setSavedSettings,setSelectedOption,setTextDifficulty }) {
    const [timerDuration, setTimerDuration] = useState(5);
    const [isRunning, setIsRunning] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [correctKeys, setCorrectKeys] = useState(0);
    const [countKeys, setCountKeys] = useState(0);
    const [isFocused, setFocused] = useState(false);
    const [isPause, setIsPause] = useState(false);
    const [startTime, setStartTime] = useState();
    const [pauseTime, setPauseTime] = useState(0);


    useEffect(() => {
        let timer;
        if (isRunning && !isPause) {
            setStartTime(new Date().getTime());
        } else if (!isRunning && startTime !== undefined && !isPause) {
            if (!isPause) {
                if (pauseTime > 0) {
                    setNewSpeed((correctKeys / 5) / (((((new Date().getTime() - startTime) - pauseTime)) / 1000) / 60));
                } else {
                    setNewSpeed((correctKeys / 5) / (((new Date().getTime() - startTime) / 1000) / 60));
                }
                newAccuracy((correctKeys / countKeys) * 100)
                clearInterval(timer);
                setResult(true);
                if (typoRef.current) {
                    typoRef.current.resetText();
                }
            }

        }
        return () => clearInterval(timer);
    }, [isRunning]);

    const changeFocuse = () => {
        setFocused(false);
        setIsPause(true);
        setPauseTime(new Date().getTime());
    }

    const handleFocuse = () => {
        if (typoRef.current) {
            typoRef.current.focusedField()
            setFocused(true);
            setIsPause(false);
            if (isRunning) {
                setPauseTime(new Date().getTime() - pauseTime);
            }
        }
    }

    return (
        <div className="typing-wrapper">
            <Typing
                ref={typoRef}
                type={"default"}
                isSoundOn={isSoundOn}
                setCorrectKeys={setCorrectKeys}
                setCountKeys={setCountKeys}
                setIsRunning={setIsRunning}
                isRunning={isRunning}
                changeFocuse={changeFocuse}
                isFocused={isFocused}
                isDarkTheme={isDarkTheme}
                selectedFont={selectedFont}
                selectedSize={selectedSize}
                textAPI={textAPI}
                setIsReserted={setIsReserted}
                isReseted={isReseted}
                setSavedSettings={setSavedSettings}
                setSelectedOption={setSelectedOption}
                setTextDifficulty={setTextDifficulty}
            >
                {!isFocused ?
                    <div className={`description ${isDarkTheme ? 'dark' : ''}`}
                         onClick={handleFocuse}
                    >
                        <span className={`img-container ${isDarkTheme ? 'dark' : ''}`}>
                            <img src="/src/assets/cursor.png" alt="cursor" className="cursor-pointer" />
                        </span>
                        <span className="hint">Click to focus on field</span>
                    </div> : ""
                }
            </Typing>
        </div>
    )
}
