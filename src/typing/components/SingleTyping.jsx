import { useState, useEffect, useRef } from "react";
import Typing from "./Typing";
import { getWordSets, generateRandomWords } from "../api/WordsAPI.jsx";
import { getRandomText } from "../api/TextAPI.jsx";
import Settings from "./TextChoice.jsx";
import CryptoJS from "crypto-js";
import { saveStatistics } from "../api/StatisticAPI.jsx";

export default function SingleTyping({
    typoRef, isSoundOn, setNewSpeed, newAccuracy, setResult, isDarkTheme, selectedFont, selectedSize,
    textAPI, setIsReseted, isReseted, setSavedSettings, setSelectedOption, setTextSavedSettings }) {
    const [isRunning, setIsRunning] = useState(false);
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
                let speed;
                let timeWaste;
                if (pauseTime > 0) {
                    timeWaste = ((((new Date().getTime() - startTime) - pauseTime)) / 1000);
                    speed = (correctKeys / 5) / (timeWaste / 60);
                    setNewSpeed(speed);
                } else {
                    timeWaste = ((new Date().getTime() - startTime) / 1000);
                    speed = (correctKeys / 5) / (timeWaste / 60)
                    setNewSpeed(speed);
                }
                const accuracy = (correctKeys / countKeys) * 100;
                newAccuracy(accuracy)
                clearInterval(timer);
                setResult(true);
                setIsReseted(!isReseted);
                setTextSavedSettings(JSON.parse(localStorage.getItem('textChoiceSettings')));
                setSelectedOption(localStorage.getItem('selectedTextType'));
                setSavedSettings(JSON.parse(localStorage.getItem('wordChoiceSettings')));
                resetVariables();
                statistics(speed, accuracy, timeWaste);
            }

        }
        return () => clearInterval(timer);
    }, [isRunning]);


    const statistics = (speed, accuracy, timeWaste) => {
        const encryptedUserData = localStorage.getItem('userData');
        if (encryptedUserData) {
            const bytes = CryptoJS.AES.decrypt(encryptedUserData, 'secret_key');
            const userId = JSON.parse(bytes.toString(CryptoJS.enc.Utf8)).userId;
            const response = saveStatistics(userId, speed, accuracy, Math.ceil(timeWaste));
        }
    }

    const resetVariables = () => {
        setCountKeys(0)
        setCorrectKeys(0)
        if (typoRef.current) {
            typoRef.current.resetText();
        }
    }

    const changeFocuse = () => {
        setFocused(false);
        if (isRunning) {
            setIsPause(true);
            setPauseTime(new Date().getTime());
        }
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
                setIsReseted={setIsReseted}
                isReseted={isReseted}
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
