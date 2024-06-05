import { useState, useEffect, useRef } from "react";
import Typing from "../Typing";
import CountDown from "/src/assets/startRace.mp3"
export default function MultiplayerTyping({ typoRef, isSoundOn, setNewSpeed, newAccuracy, setResult, sendMessage, sessionId, uuid, setWords, timerToStart, amountOfPlayers}) {
    const [isRunning, setIsRunning] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [correctKeys, setCorrectKeys] = useState(0);
    const [countKeys, setCountKeys] = useState(0);
    const [isFocused, setFocused] = useState(false);
    const [wordCount, setWordCount] = useState(0);
    const [currentWord, setCurrentWord] = useState("");
    const [startTime, setStartTime] = useState();
    let regex = /.*?\s|.*?$/g;
    const [textAPI, setTextAPI] = useState("By the aid of this, every little warp thread or cluster of threads can be lifted by its own");
    const [words, setSplitWords] = useState(textAPI.match(regex));


    const [timerIsEnd, setTimer] = useState(false);

    
    useEffect(() => {
        let timer;
        if (isRunning) {
            timer = setInterval(() => {
                setElapsedTime((prevTime) => prevTime + 10); // Оновлення часу кожні 10 мілісекунд
            }, 10);
        } else if (!isRunning && elapsedTime !== 0) {
            clearInterval(timer);
            const message = {
                type: "END_RACE",
                uid: uuid
            }
            sendMessage(message);
        }
        return () => clearInterval(timer);
    }, [isRunning]);

    useEffect(() => {
        setTimer(true);
        if (timerToStart == 3) {
            playSound(CountDown)
        }
        if (timerIsEnd && timerToStart == 0) {
            setWords(words.length);
            startRace();
            setStartTime(new Date().getTime());
        }
    }, [timerToStart])

    const playSound = (sound) => {
        if (isSoundOn) {
            var audio = new Audio(sound);
            audio.play();
        }
    }
    
    const setNewData = (wordCount, word) => {
        setWordCount(wordCount + 1);
        setCurrentWord(word)
        const correct = typoRef.current.getCorrectLetter();
        const all = typoRef.current.getAllLetter();
        setCorrectKeys(correct);
        setCountKeys(all);
        const timeElapsed = ((new Date().getTime() - startTime) / 1000) / 60;
        const message = {
            type: "DATA",
            sessionId: sessionId,
            wordCount: wordCount + 1,
            currentWord: word,
            uid: uuid,
            newSpeed: (correctKeys / 5) / timeElapsed + ""
        }

        sendMessage(message);
    }

    const startRace = () => {
        setIsRunning(true);
        handleFocuse();
    }


    const changeFocuse = () => {
        if (amountOfPlayers >= 2 || isRunning) {
            setFocused(false);
        }
    }

    const handleFocuse = () => {
        if (amountOfPlayers >= 2 || isRunning) {
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
                setIsRunning={setIsRunning}
                changeFocuse={changeFocuse}
                isFocused={isFocused}
                setNewData={setNewData}
                // amountOfWords={setWords}
                textAPI={words}
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