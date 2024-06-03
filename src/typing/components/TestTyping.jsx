
import Typing from "./Typing";
import { useState, useEffect, useRef } from "react";
export default function TestTyping({ typoRef, isSoundOn, setNewSpeed, newAccuracy, setResult, choosenTime, isDarkTheme, selectedFont, selectedSize }) {

    const [timerDuration, setTimerDuration] = useState(choosenTime);
    const [isRunning, setIsRunning] = useState(false);
    const [correctKeys, setCorrectKeys] = useState(0);
    const [countKeys, setCountKeys] = useState(0);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isFocused, setFocused] = useState(false);

    const handleClick = useRef(null);

    useEffect(() => {
        handleClick.current = function (event) {
            event.stopPropagation();
        };
    }, []);

    useEffect(() => {
        let timer;
        if (isRunning) {
            document.getElementsByClassName("time-options")[0].addEventListener('click', handleClick.current, true);

            timer = setInterval(() => {
                setTimerDuration((prevTime) => {
                    if (prevTime <= 1) {
                        clearInterval(timer);
                        finishTest();
                        return 0;
                    }
                    setElapsedTime((prevTime) => prevTime + 1);
                    return prevTime - 1;
                });
            }, 1000);
        } else if (!isRunning && elapsedTime !== 0) {
            clearInterval(timer);
            finishTest();
        }
        return () => {
            clearInterval(timer);
            document.getElementsByClassName("time-options")[0].removeEventListener('click', handleClick.current, true);
        };
    }, [isRunning]);

    useEffect(() => {
        setTimerDuration(choosenTime);
    }, [choosenTime]);

    useEffect(() => {
        if (!isRunning && elapsedTime != 0) {
            setNewSpeed((correctKeys / 5) / (elapsedTime / 60));
            newAccuracy((correctKeys / countKeys) * 100);
            setResult(true);
            setTimerDuration(choosenTime);
        }
    }, [isRunning]);

    const finishTest = () => {
        if (typoRef.current) {
            setTimeout(() => {
                typoRef.current.timer();
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
            >
                {!isFocused ?
                    <div className="description" onClick={handleFocuse}>
                        <span className="img-container">
                            <img src="/src/assets/cursor.png" alt="cursor" className="cursor-pointer" />
                        </span>
                        <span className="hint">Click to focus on field</span>
                    </div> : ""
                }
            </Typing>
        </div>
    );
}