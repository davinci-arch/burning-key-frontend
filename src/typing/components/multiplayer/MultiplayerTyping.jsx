import { useState, useEffect, useRef } from "react";
import Typing from "../Typing";
export default function MultiplayerTyping({ typoRef, isSoundOn, setNewSpeed, newAccuracy, setResult, sendMessage, sessionId, uuid, setWords }) {
    const [isRunning, setIsRunning] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [correctKeys, setCorrectKeys] = useState(0);
    const [countKeys, setCountKeys] = useState(0);
    const [isFocused, setFocused] = useState(false);
    const [wordCount, setWordCount] = useState(0);
    const [currentWord, setCurrentWord] = useState("");

    useEffect(() => {
        let timer;
        if (isRunning) {
            timer = setInterval(() => {
                setElapsedTime((prevTime) => prevTime + 1);
            }, 1000);
        } else if (!isRunning && elapsedTime !== 0) {
            clearInterval(timer);
            // if (typoRef.current) {
            //     typoRef.current.resetText();
            // }
        }
        return () => clearInterval(timer);
    }, [isRunning]);


    const setNewData = (wordCount, word) => {
        setWordCount(wordCount + 1);
        setCurrentWord(word)
    
        const message = {
            type: "DATA",
            sessionId: sessionId,
            wordCount: wordCount + 1,
            currentWord: word,
            uid: uuid
        }

        sendMessage(message);
    }
    

    const changeFocuse = () => {
        setFocused(false);
    }

    const handleFocuse = () => {
        if (typoRef.current) {
            typoRef.current.focusedField()
            setFocused(true);
        }
    }

   

    return (
        <div className="typing-wrapper">
            <Typing
                ref={typoRef}
                type={"multiplayer"}
                isSoundOn={isSoundOn}
                setCorrectKeys={setCorrectKeys}
                setCountKeys={setCountKeys}
                setIsRunning={setIsRunning}
                isRunning={isRunning}
                changeFocuse={changeFocuse}
                isFocused={isFocused}
                setNewData={setNewData}
                amountOfWords ={setWords}
                >

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