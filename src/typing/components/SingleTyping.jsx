import { useState, useEffect } from "react";
import Typing from "./Typing";
export default function SingleTyping({ typoRef, isSoundOn, setNewSpeed, newAccuracy, setResult }) {
    const [timerDuration, setTimerDuration] = useState(5);
    const [isRunning, setIsRunning] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [correctKeys, setCorrectKeys] = useState(0);
    const [countKeys, setCountKeys] = useState(0);
    const [isFocused, setFocused] = useState(false);
    const [isPause, setIsPause] = useState(false);
    useEffect(() => {
        let timer;
        if (isRunning) {
            timer = setInterval(() => {
                if (!isPause) {
                    setElapsedTime((prevTime) => prevTime + 1);
                }
            }, 1000);
        } else if (!isRunning && elapsedTime !== 0 && !isPause) {
            if (!isPause) {
                setNewSpeed((correctKeys / 5) / (elapsedTime / 60));
                newAccuracy((correctKeys / countKeys) * 100)
                clearInterval(timer);
                setResult(true);
                if (typoRef.current) {
                    typoRef.current.resetText();
                }
            }

        }
        return () => clearInterval(timer);
    }, [isRunning, isFocused]);

    const changeFocuse = () => {
        setFocused(false);
        setIsPause(true);
    }

    const handleFocuse = () => {
        if (typoRef.current) {
            typoRef.current.focusedField()
            setFocused(true);
            setIsPause(false);
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
                isFocused={isFocused}>

                {!isFocused ?
                    <div className="description"
                        onClick={handleFocuse}
                    >
                        <span className="img-container">
                            <img src="/src/assets/cursor.png" alt="cursor" className="cursor-pointer" />
                        </span>
                        <span className="hint">Click to focus on field</span>
                    </div> : ""
                }
            </Typing>
        </div>
    )

}