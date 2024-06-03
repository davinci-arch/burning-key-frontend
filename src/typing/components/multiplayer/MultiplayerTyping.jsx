import { useState, useEffect, useRef } from "react";
import Typing from "../Typing";
export default function MultiplayerTyping({ typoRef, isSoundOn, setNewSpeed, newAccuracy, setResult, sendMessage, sessionId, uuid, setWords, timerToStart, amountOfPlayers }) {
    const [isRunning, setIsRunning] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [correctKeys, setCorrectKeys] = useState(0);
    const [countKeys, setCountKeys] = useState(0);
    const [isFocused, setFocused] = useState(false);
    const [wordCount, setWordCount] = useState(0);
    const [currentWord, setCurrentWord] = useState("");

    const [timerIsEnd, setTimer] = useState(false);
    useEffect(() => {
        let timer;
        if (isRunning) {
            timer = setInterval(() => {
                setElapsedTime((prevTime) => prevTime + 10); // Оновлення часу кожні 10 мілісекунд
            }, 10);
        } else if (!isRunning && elapsedTime !== 0) {
            clearInterval(timer);
        }
        return () => clearInterval(timer);
    }, [isRunning]);

    useEffect(() => {
        setTimer(true);
        if (timerIsEnd && timerToStart == 0) {
            startRace();
        }
    }, [timerToStart])

    const setNewData = (wordCount, word) => {
        setWordCount(wordCount + 1);
        setCurrentWord(word)
        const correct = typoRef.current.getCorrectLetter();
        const all = typoRef.current.getAllLetter();
        setCorrectKeys(correct);
        setCountKeys(all);
        
        const message = {
            type: "DATA",
            sessionId: sessionId,
            wordCount: wordCount + 1,
            currentWord: word,
            uid: uuid,
            newSpeed: (correctKeys / 5) / ((elapsedTime / 1000) / 60) + ""
        }

        sendMessage(message);
    }

    const startRace = () => {
        setIsRunning(true);
        handleFocuse();
    }


    const changeFocuse = () => {
        if (amountOfPlayers >= 2) {
            setFocused(false);
        }
    }

    const handleFocuse = () => {
        if (amountOfPlayers >= 2) {
            if (typoRef.current) {
                typoRef.current.focusedField()
                setFocused(true);
            }
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
                isRunning={isRunning}
                changeFocuse={changeFocuse}
                isFocused={isFocused}
                setNewData={setNewData}
                amountOfWords={setWords}
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