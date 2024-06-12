import { useState, useEffect, useRef } from "react";
import Typing from "../Typing";
import CountDown from "/src/assets/startRace.mp3"
import { saveStatistics } from "../../api/StatisticAPI";
import CryptoJS from "crypto-js";
export default function MultiplayerTyping({
    typoRef, isSoundOn, setNewSpeed, setNewAccuracy, setResult,
    sendMessage, uuid, setWords, timerToStart, amountOfPlayers,
    setDurationOfMatch, setMistakes, setWrongWords, setTextWords,
    isDarkTheme, selectedFont, selectedSize, text }) {
    const [isRunning, setIsRunning] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [correctKeys, setCorrectKeys] = useState(0);
    const [countKeys, setCountKeys] = useState(0);
    const [isFocused, setFocused] = useState(false);
    const [wordCount, setWordCount] = useState(0);
    const [currentWord, setCurrentWord] = useState("");
    const [startTime, setStartTime] = useState(0);
    const [endTime, setEndTime] = useState(0);
    let regex = /.*?\s|.*?$/g;
    const [words, setSplitWords] = useState();

    const [timerIsEnd, setTimer] = useState(false);

    useEffect(() => {
        if (text) {
            setSplitWords(text.match(regex));
        }
    }, [text])

    useEffect(() => {
        let timer;
        if (isRunning) {
            timer = setInterval(() => {
                setElapsedTime((prevTime) => prevTime + 10);
            }, 10);
        } else if (!isRunning && elapsedTime !== 0) {
            clearInterval(timer);
            const message = {
                type: "END_RACE",
                uid: uuid
            }
            const speed = (endTime - startTime) / 1000;
            const timeWaste = (endTime - startTime) / 1000;
            const accuracy = (correctKeys / countKeys) * 100
            sendMessage(message);
            setDurationOfMatch(Math.ceil(timeWaste));
            setMistakes(countKeys - correctKeys);
            setNewSpeed((correctKeys / 5) / (speed / 60));
            setNewAccuracy(accuracy);
            setResult(true);
            setTextWords(words);
            setWrongWords(typoRef.current.getWrongWordsIndexes());
            statistics(speed, accuracy, timeWaste);
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
    useEffect(() => {
        setTimer(true);
        if (timerToStart == 3) {
            // playSound(CountDown)
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

    const setNewData = (wordCount, word, correctTypingKeys, keys) => {
        setWordCount(wordCount + 1);
        setCurrentWord(word)
        const end = new Date().getTime();
        const timeElapsed = ((end - startTime) / 1000) / 60;
        setEndTime(end);
        const message = {
            type: "DATA",
            wordCount: wordCount + 1,
            currentWord: word,
            uid: uuid,
            newSpeed: (correctTypingKeys / 5) / timeElapsed + ""
        }

        sendMessage(message);
        setCorrectKeys(correctTypingKeys);
        setCountKeys(keys);
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
                textAPI={words}
                isDarkTheme={isDarkTheme}
                selectedFont={selectedFont}
                selectedSize={selectedSize}
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