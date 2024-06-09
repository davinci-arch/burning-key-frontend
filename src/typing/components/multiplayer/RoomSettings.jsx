import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import "../../styles/room-settings.scss";
import Footer from "../Footer.jsx";
import Header from "../Header.jsx";
import { TextField, Autocomplete, Box, Slider } from "@mui/material";

import { getWordSets, generateRandomWords } from "../../api/WordsAPI.jsx";
import { getRandomText } from "../../api/TextAPI.jsx";
export default function RoomSettings() {


    const socket = useRef();
    const [title, setTitle] = useState("");
    const [timeToStart, setTimeToStart] = useState(5);
    const [isStatistics, setStatistics] = useState(true);
    const [amountOfPlayers, setAmountOfPlayers] = useState(2);
    const [numberOfWords, setNumberOfWords] = useState(0);
    const [difficulties, setDifficultyies] = useState([
        "Easy",
        "Medium",
        "Hard"
    ]);
    const [isLoad, setIsLoad] = useState(false);
    const [signPercent, setSignPercent] = useState(0);
    const [upperCasePercent, setUpperCasePercent] = useState(0);

    const [selectedOption, setSelectedOption] = useState('texts');
    const [wordsSets, setWordSets] = useState([]);
    const [wordSet, setWordSet] = useState("");
    const [difficulty, setDifficulty] = useState(difficulties[0]);

    useEffect(() => {
        setIsLoad(true);
        if (!isLoad) {
            const fetchWordSets = async () => {
                try {
                    const wordSets = await getWordSets();
                    if (wordSet !== undefined) {
                        setWordSets(wordSets);
                        setWordSet(wordSets[0])
                    }
                } catch (error) {
                    console.error('Failed to fetch word sets:', error);
                }
            };
            fetchWordSets();
        }
    }, [isLoad])
    const {
        register,
        formState: {
            errors
        },
        setValue,
        handleSubmit,
    } = useForm({
        mode: "onChange"
    });

    const navigate = useNavigate();

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const createRoom = (message) => {
        socket.current = new WebSocket("ws://localhost:8080/multiplayer/rooms");
        socket.current.onopen = () => {
            sendMessage(message);
        }
        socket.current.onmessage = (event) => {
            const message = event.data;
            const data = JSON.parse(message);
            if (data.type === "DATA") {
                socket.current.close();
                navigate(`/multiplayer/rooms/room/${data.data.uid}`);
            }

        }

        socket.current.onclose = () => {
            console.log("socket was closed");
        }

        socket.current.onerror = () => {
            console.log("something went wrong");
        }
    }

    const handleSaveRoom = async () => {
        if (selectedOption === "texts") {
            const getText = await getRandomText(difficulty);
            if (getText !== undefined) {
                const message = {
                    type: "CREATE",
                    title: title,
                    maxAmountOfPlayers: amountOfPlayers,
                    timeToStart: parseInt(timeToStart),
                    text: getText
                };
                createRoom(message);
            }
        } else if (selectedOption === "words") {
            console.log(wordSet + " " + numberOfWords + " " + signPercent + " " + upperCasePercent)
            const getRandomWords = await generateRandomWords(wordSet, numberOfWords, signPercent, upperCasePercent, null);
            if (getRandomWords !== undefined) [
                console.log("random words: ")
            ]
        }

    }
    const sendMessage = (message) => {
        socket.current.send(JSON.stringify(message));
    }

    const handleSignPercentSlider = (event, newValue) => {
        setSignPercent(newValue)
    }
    const handleUpperCasepercent = (event, newValue) => {
        setUpperCasePercent(newValue)
    }
    return (
        <>
            <Header />
            <div className="content-settings">
                <div className="form">
                    <form action="" onSubmit={handleSubmit(handleSaveRoom)}>
                        <div className="field-container">
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Title"
                                id="title"
                            />
                            <label htmlFor="titile">Title</label>
                            <input
                                type="number"
                                value={amountOfPlayers}
                                onChange={(e) => setAmountOfPlayers(e.target.value)}
                                placeholder="Max amount of players"
                                id="max-amount-of-players"
                            />
                            <label htmlFor="max-amount-of-players">Max amount of players</label>
                            <input
                                type="text"
                                value={timeToStart}
                                onChange={(e) => setTimeToStart(e.target.value)}
                                placeholder="Time to start"
                                id="time-to-start" />
                            <label htmlFor="time-to-start">Time to start</label>
                            <input
                                type="checkbox"
                                checked={isStatistics}
                                onChange={(e) => setStatistics(e.target.checked)}
                                placeholder="Statistics off/on" />
                            <div className="settings-options">
                                <div className="radio-options">
                                    <div>
                                        <input
                                            type="radio"
                                            id="texts"
                                            name="options"
                                            value="texts"
                                            checked={selectedOption === 'texts'}
                                            onChange={handleOptionChange}
                                        />
                                        <label htmlFor="texts">texts</label>
                                    </div>
                                    <div>
                                        <input
                                            type="radio"
                                            id="words"
                                            name="options"
                                            value="words"
                                            checked={selectedOption === 'words'}
                                            onChange={handleOptionChange}
                                        />
                                        <label htmlFor="words">words</label>
                                    </div>
                                </div>
                                {selectedOption === "texts" ?

                                    <div className="texts-option">
                                        <Autocomplete
                                            id="difficulties"
                                            sx={{ width: 300 }}
                                            options={difficulties}
                                            value={difficulty}
                                            onChange={(event, newValue) => setDifficulty(newValue)}
                                            autoHighlight
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Choose a difficulties"
                                                    inputProps={{
                                                        ...params.inputProps,
                                                        autoComplete: 'Easy', // disable autocomplete and autofill
                                                    }}
                                                />
                                            )}
                                        />
                                    </div>
                                    :
                                    <div className="words-option">
                                        <Autocomplete
                                            id="word-set"
                                            sx={{ width: 300 }}
                                            options={wordsSets}
                                            value={wordSet}
                                            onChange={(event, newValue) => setWordSet(newValue)}
                                            autoHighlight
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Choose a word set"
                                                    inputProps={{
                                                        ...params.inputProps,
                                                        autoComplete: 'Easy', // disable autocomplete and autofill

                                                    }}
                                                />
                                            )}
                                        />
                                        <input
                                            type="number"
                                            id="number-of-words"
                                            placeholder="Number of words"
                                            value={numberOfWords}
                                            onChange={(e) => setNumberOfWords(e.target.value)}
                                        />
                                        <label htmlFor="number-of-words">Number of words</label>
                                        <div>Number of Signs Percent: {signPercent}%</div>
                                        <Box sx={{ width: 300 }}>
                                            <Slider defaultValue={0}
                                                aria-label="Default"
                                                valueLabelDisplay="off"
                                                onChange={handleSignPercentSlider} />
                                        </Box>
                                        <div>Number of Upper Case Percent: {upperCasePercent}%</div>
                                        <Box sx={{ width: 300 }}>
                                            <Slider defaultValue={0}
                                                aria-label="Default"
                                                valueLabelDisplay="off"
                                                onChange={handleUpperCasepercent} />
                                        </Box>
                                    </div>

                                }

                            </div>
                        </div>
                        <button>Save settings</button>

                    </form>
                </div>
            </div>
            <Footer />
        </>

    )
}