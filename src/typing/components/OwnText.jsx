import { useState, useEffect, useRef } from "react";
import Typing from "./Typing";
import '../styles/owntext.scss';

export default function OwnText({
                                         typoRef, isSoundOn, setNewSpeed, newAccuracy, setResult, isDarkTheme, selectedFont, selectedSize,
                                          setIsReseted, isReseted
                                     }) {
    const [isRunning, setIsRunning] = useState(false);
    const [correctKeys, setCorrectKeys] = useState(0);
    const [countKeys, setCountKeys] = useState(0);
    const [isFocused, setFocused] = useState(false);
    const [isPause, setIsPause] = useState(false);
    const [startTime, setStartTime] = useState();
    const [pauseTime, setPauseTime] = useState(0);
    const [isTextInputVisible, setIsTextInputVisible] = useState(true);
    const [customText, setCustomText] = useState("");
    const [words, setWords] = useState([]);
    const regex = /.*?\s|.*?$/g;

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
                setIsReseted(!isReseted);
                resetVariables()
            }

        }
        return () => clearInterval(timer);
    }, [isRunning]);

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

    const handleTextSubmit = () => {
        setIsTextInputVisible(false);
        if(customText === "")
        setWords("You have been warned...".match(regex));
        else
        setWords(customText.match(regex));
    }

    const handleTextClear = () => {
        setCustomText("");
    }

    const handleTextChange = (e) => {
        setCustomText(e.target.value);
    }

    const handleBackToInput = () => {
        setIsTextInputVisible(true);
        resetVariables();
    }

    return (
        <div className={`typing-wrapper ${isDarkTheme ? 'dark' : ''}`}>
            {isTextInputVisible ? (
                <div className="own-text-container">
                    <div className={`text-input-wrapper ${isDarkTheme ? 'dark' : ''}`}>
          <textarea
              value={customText}
              onChange={handleTextChange}
              placeholder="Enter your text here..."
          />
                        <div className="button-container">
                        <button onClick={handleTextSubmit} style={{marginRight: "3px"}}>Submit</button>
                        <button onClick={handleTextClear} style={{marginLeft: "3px"}}>Clear</button>
                    </div>
                    </div>
                </div>
            ) : (
                <>
                    <div className="own-type-container ">
                        <span className="change-text-button" onClick={handleBackToInput}>Click here to change text!
                        </span>
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
                            textAPI={words}
                            setIsReseted={setIsReseted}
                            isReseted={isReseted}
                        >
                            {!isFocused ?
                                <div className={`description ${isDarkTheme ? 'dark' : ''}`}
                                     onClick={handleFocuse}
                                >
                <span className={`img-container ${isDarkTheme ? 'dark' : ''}`}>
                  <img src="/src/assets/cursor.png" alt="cursor" className="cursor-pointer"/>
                </span>
                                    <span className="hint">Click to focus on field</span>
                                </div> : ""
                            }
                        </Typing>
                    </div>
                </>
            )}
        </div>
    )
}
