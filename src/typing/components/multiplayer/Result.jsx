import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import Finish from "/src/assets/finish.mp3"
import Lose from "/src/assets/lose.mp3"
export default function Result({ wordsPerMinute, accuracy, elapsedTime, mistakes, places, username, isSoundOn, textWords, wrongWordsIndexes,isDarkTheme }) {

    function convertToMinutesSeconds(seconds) {
        if (seconds > 0) {
            var minutes = Math.floor(seconds / 60);
            var seconds = seconds % 60;
            return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
        } else {
            return "0:00";

        }

    }
    const [firstPlace, setFirstPlace] = useState();
    const [secondPlace, setSecondPlace] = useState();
    const [thirdPlace, setThirdPlace] = useState();

    const playSound = (sound) => {
        if (isSoundOn) {
            var audio = new Audio(sound);
            audio.play();
        }
    }
    const prevPlacesLength = useRef(places.length);

    useEffect(() => {
        if (places.length === prevPlacesLength.current + 1) {
            const topPlaces = places.filter(v => v.position === 0 || v.position === 1 || v.position === 2);
            const first = topPlaces.find(v => v.position === 0) || null;
            const second = topPlaces.find(v => v.position === 1) || null;
            const third = topPlaces.find(v => v.position === 2) || null;
            setFirstPlace(first);
            setSecondPlace(second);
            setThirdPlace(third);
            const isInTop = (first && first.username === username) ||
                (second && second.username === username) ||
                (third && third.username === username);
            if (isInTop) {
                playSound(Finish);
            } else {
                playSound(Lose);
            }
        }
    }, [places]);


    const words = () => {
        return textWords.map((word, i) => {
            if (wrongWordsIndexes.includes(i)) {
                return (
                    <span key={i} className="incorrect-word">
                        {word}
                    </span>
                );
            } else {
                return (
                    <span key={i}>
                        {word}
                    </span>
                );
            }
        });
    };

    return (
        <div className={`result-wrapper ${isDarkTheme ? 'dark' : ''}`}>
            <div className={`result-container ${isDarkTheme ? 'dark' : ''}`}>
                <div className="result-title">
                    <h1>Result</h1>
                </div>
                <Link to='/multiplayer/rooms'>
                    <div className="back">
                        <img src="/src/assets/back.png" alt="back" />
                        <span>Back to rooms</span>
                    </div>
                </Link>

                <div className="content">
                    <div className="statistics">
                        <div className="statistics-header">
                            <h3>Statistics</h3>
                        </div>
                        <div className="statistics-data">
                            <span>WORDS PER MINUTE</span>
                            <span>{wordsPerMinute}</span>
                        </div>
                        <div className="statistics-data">
                            <span>ACCURACY</span>
                            <span>{accuracy}%</span>
                        </div>
                        <div className="statistics-data">
                            <span>ELAPSED TIME</span>
                            <span>{convertToMinutesSeconds(elapsedTime)}</span>
                        </div>
                        <div className="statistics-data">
                            <span>MISTAKES</span>
                            <span>{mistakes}</span>
                        </div>
                    </div>
                    <div className="statistics-race-result">
                        <div className="place-container">
                            <div className="place-img">
                                {/* "second-place" */}
                                <div className={secondPlace ? "second-place animate" : "second-place"}>
                                    {secondPlace && (
                                        <>
                                            <img src="/src/assets/user.png" alt="avatar" className="avatar" />
                                            {/* <span>{secondPlace.username}</span> */}
                                        </>
                                    )}
                                </div>
                                <div className={firstPlace ? "first-place animate" : "first-place"}>
                                    {firstPlace && (
                                        <>
                                            <img src="/src/assets/user.png" alt="avatar" className="avatar" />
                                            {/* <span>{firstPlace.username}</span> */}
                                        </>
                                    )}
                                </div>
                                <div className={thirdPlace ? "third-place animate" : "third-place"}>
                                    {thirdPlace && (
                                        <>
                                            <img src="/src/assets/user.png" alt="avatar" className="avatar" />
                                            {/* <span>{thirdPlace.username}</span> */}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="text-result">
                            {words()}
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )

}