
import Typing from "./Typing";
import { useState, useEffect, useRef } from "react";
export default function TestTyping({ typoRef, isSoundOn, setNewSpeed, newAccuracy, setResult, choosenTime, isDarkTheme, selectedFont, selectedSize }) {

    const [timerDuration, setTimerDuration] = useState(choosenTime);
    const [isRunning, setIsRunning] = useState(false);
    const [correctKeys, setCorrectKeys] = useState(0);
    const [countKeys, setCountKeys] = useState(0);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isFocused, setFocused] = useState(false);
    let regex = /.*?\s|.*?$/g;
    const [textAPI, setTextAPI] = useState("Sukumar Azhikode defined a short story as 'a brief story story as 'a brief story");
    const [words, setWords] = useState(textAPI.match(regex));
    const [startTime, setStartTime] = useState(0);

    const handleClick = useRef(null);

    useEffect(() => {
        handleClick.current = function (event) {
            event.stopPropagation();
        };
    }, []);

    useEffect(() => {
        let timer;
        if (isRunning) {
            if (startTime == 0) {
                setStartTime(new Date().getTime());
            }
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
        if (!isRunning && elapsedTime != 0) {
            console.log(startTime)
            setNewSpeed((correctKeys / 5) / (((new Date().getTime() - startTime) / 1000) / 60));
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
                textAPI={words}
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