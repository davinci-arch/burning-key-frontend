
import Typing from "./Typing";
import { useState, useEffect } from "react";
export default function TestTyping({ typoRef, isSoundOn, setNewSpeed, newAccuracy, setResult }) {
    const [choosenTime, setTime] = useState(15);
    const [timerDuration, setTimerDuration] = useState(choosenTime);
    const [isRunning, setIsRunning] = useState(false);
    const [correctKeys, setCorrectKeys] = useState(0);
    const [countKeys, setCountKeys] = useState(0);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isFocused, setFocused] = useState(false);

    useEffect(() => {
        let timer;
        if (isRunning) {
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
        return () => { clearInterval(timer) };
    }, [isRunning]);

    useEffect(() => {
        if (!isRunning && elapsedTime != 0) {
            setNewSpeed((correctKeys / 5) / (elapsedTime / 60));
            newAccuracy((correctKeys / countKeys) * 100)
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
    }
    const changeFocuse = () => {
        setFocused(false);
    }
    const handleFocuse = () => {
        if (typoRef.current) {
            typoRef.current.focusedField();
            setFocused(true);
        }
    }

    return (
        <div className="timer">
            <div className="time-options">
                <p onClick={() => setTime(15)}>15</p>
                <p onClick={() => setTime(30)}>30</p>
                <p onClick={() => setTime(60)}>60</p>
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
                isFocused={isFocused} >

                {!isFocused ?
                    <div className="description"
                        onClick={handleFocuse}
                    >
                        <span className="img-container">
                            <img src="src/assets/cursor.png" alt="cursor" className="cursor-pointer" />
                        </span>
                        <span className="hint">Click to focus on field</span>
                    </div> : ""
                }
            </Typing>
        </div>
    )
}