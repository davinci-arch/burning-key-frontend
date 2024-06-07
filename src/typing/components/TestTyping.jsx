
import Typing from "./Typing";
import { useState, useEffect, useRef } from "react";
export default function TestTyping({ typoRef, isSoundOn, setNewSpeed, newAccuracy, setResult, choosenTime, isDarkTheme, selectedFont, selectedSize,
    textAPI, setIsReseted, isReseted, setSavedSettings, setSelectedOption, setTextDifficulty }) {

    const [timerDuration, setTimerDuration] = useState(choosenTime);
    const [isRunning, setIsRunning] = useState(false);
    const [correctKeys, setCorrectKeys] = useState(0);
    const [countKeys, setCountKeys] = useState(0);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isFocused, setFocused] = useState(false);
    const [startTime, setStartTime] = useState(0);

    const handleClick = useRef(null);

    useEffect(() => {
        handleClick.current = function (event) {
            event.stopPropagation();
        };
    }, []);

    useEffect(() => {
        let timer;

        const startTimer = () => {
            timer = setInterval(() => {
                setTimerDuration((prevTime) => {
                    if (prevTime == 1) {
                        setIsRunning(false);
                        return prevTime - 1;
                    }
                    setElapsedTime((prevTime) => prevTime + 1);
                    return prevTime - 1;
                });
            }, 1000);
        };

        if (isRunning) {
            if (startTime == 0) {
                setStartTime(new Date().getTime());
            }
            document.getElementsByClassName("time-options")[0].addEventListener('click', handleClick.current, true);
            startTimer();
        } else if (!isRunning && elapsedTime !== 0) {
            clearInterval(timer);
            finishTest();
            document.getElementsByClassName("time-options")[0].removeEventListener('click', handleClick.current, true);
        }

        return () => {
            clearInterval(timer);
        };
    }, [isRunning]);


    useEffect(() => {
        setTimerDuration(choosenTime);
    }, [choosenTime]);

    useEffect(() => {
        if (!isRunning && startTime != 0) {
            setNewSpeed((correctKeys / 5) / (((new Date().getTime() - startTime) / 1000) / 60));
            newAccuracy((correctKeys / countKeys) * 100);
            setStartTime(0);
            setCorrectKeys(0);
            setCountKeys(0);
            setResult(true);
            setTimerDuration(choosenTime);
        }
    }, [elapsedTime]);

    const finishTest = () => {
        if (typoRef.current) {
            setTimeout(() => {
                setElapsedTime(0);
                typoRef.current.timer();
                setTextDifficulty(localStorage.getItem('textDifficulty'));
                setSelectedOption(localStorage.getItem('selectedTextType'));
                setSavedSettings(JSON.parse(localStorage.getItem('wordChoiceSettings')));
            }, 0);

        }
    };

    const changeFocuse = () => {
        setFocused(false);
    };

    const handleFocuse = () => {
        if (typoRef.current) {
            typoRef.current.focusedField();
            setFocused(true);
        }
    };

    return (
        <div>
            <div className="timer-container" style={{ opacity: isRunning ? 1 : 0 }}>
                <div className="timer">
                    <p>{timerDuration}</p>
                </div>
            </div>

            <Typing
                key={choosenTime}
                ref={typoRef}
                type={"test"}
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
                    <div className={`description ${isDarkTheme ? 'dark' : ''}`} onClick={handleFocuse}>
                        <span className={`img-container ${isDarkTheme ? 'dark' : ''}`}>
                            <img src="/src/assets/cursor.png" alt="cursor" className="cursor-pointer" />
                        </span>
                        <span className="hint">Click to focus on field</span>
                    </div> : ""
                }
            </Typing>
        </div>
    );
}