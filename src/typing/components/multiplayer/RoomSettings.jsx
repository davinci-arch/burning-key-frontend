import { useRef, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
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
        control,
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
                console.log("mes: " + JSON.stringify(message));
                createRoom(message);

            }
        } else if (selectedOption === "words") {
            const getRandomWords = await generateRandomWords({
                wordSetName: wordSet,
                numWords: numberOfWords,
                numSignsPercent: signPercent,
                numUpperCasePercent: upperCasePercent
            });
            const message = {
                type: "CREATE",
                title: title,
                maxAmountOfPlayers: amountOfPlayers,
                timeToStart: parseInt(timeToStart),
                text: getRandomWords.content
            };
            createRoom(message);
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
    const handleToggle = () => {
        setStatistics(prevState => !prevState);
    };
    return (
        <>
            <div className="wrapper-settings">
                <Header />
                <div className="content-settings">
                    <form action="" onSubmit={handleSubmit(handleSaveRoom)}>
                        <div className="content-settings-navigation">
                            <div className="back-to-page">
                                <img src="/src/assets/back.png" alt="back to page" className="toPage" />
                                <span>Back to rooms</span>
                            </div>
                            <div>
                                <button>Save settings</button>
                            </div>
                        </div>
                        <div className="form">
                            <div className="field-container">
                                <div className="field">
                                    <Controller
                                        control={control}
                                        name="title"
                                        defaultValue={title}
                                        rules={{
                                            required: "Field must not be empty!",
                                        }}
                                        onChange={(e) => setTitle(e.target.value)}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                id="outlined-basic"
                                                label="Title"
                                                variant="outlined"
                                                error={!!errors?.title}
                                                sx={{
                                                    width: '300px',
                                                }}
                                                InputProps={{
                                                    sx: {
                                                        height: '50px',
                                                    },
                                                    onChange: (e) => {
                                                        field.onChange(e);
                                                        setTitle(e.target.value);
                                                    }
                                                }}
                                            />
                                        )}
                                    />

                                    <span className={errors?.title ? "error" : "error error-hidden"}>
                                        {errors?.title?.message || "Error"}
                                    </span>
                                </div>
                                <div className="field">
                                    <Controller
                                        control={control}
                                        name="amountOfPlayers"
                                        defaultValue={amountOfPlayers}
                                        rules={{
                                            required: "Field must not be empty!",
                                            pattern: {
                                                value: /^\d+$/,
                                                message: "Only numbers are allowed!"
                                            },
                                            min: {
                                                value: 2,
                                                message: "Value must be greater than 1!"
                                            }
                                        }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                id="outlined-basic"
                                                label="Max amount of players"
                                                variant="outlined"
                                                error={!!errors?.amountOfPlayers}
                                                sx={{
                                                    width: '300px',
                                                }}
                                                InputProps={{
                                                    sx: {
                                                        height: '50px',
                                                    },
                                                    onChange: (e) => {
                                                        field.onChange(e);
                                                        setAmountOfPlayers(e.target.value);
                                                    }
                                                }}
                                            />
                                        )}
                                    />

                                    <span className={errors?.amountOfPlayers ? "error" : "error error-hidden"}>
                                        {errors?.amountOfPlayers?.message || "Error"}
                                    </span>

                                </div>
                                <div className="field">
                                    <Controller
                                        control={control}
                                        name="maxAmountOfPlayers"
                                        defaultValue={timeToStart}
                                        rules={{
                                            required: "Field must not be empty!",
                                            pattern: {
                                                value: /^\d+$/,
                                                message: "Only numbers are allowed!"
                                            },
                                            min: {
                                                value: 5,
                                                message: "Value must be at least 5!"
                                            }
                                        }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                id="outlined-basic"
                                                label="Time to start"
                                                variant="outlined"
                                                error={!!errors?.maxAmountOfPlayers}
                                                sx={{
                                                    width: '300px',
                                                }}
                                                InputProps={{
                                                    sx: {
                                                        height: '50px',
                                                    },
                                                    onChange: (e) => {
                                                        field.onChange(e);
                                                        setTimeToStart(e.target.value);
                                                    }
                                                }}
                                            />
                                        )}
                                    />

                                    <span className={errors?.maxAmountOfPlayers ? "error" : "error error-hidden"}>
                                        {errors?.maxAmountOfPlayers?.message || "Error"}
                                    </span>


                                </div>
                                {/* <div className={`toggle-button ${isStatistics ? 'on' : 'off'}`} onClick={handleToggle}>
                                    <div className="toggle-ball"></div>
                                </div> */}

                                <div className="settings-options">
                                    <div className="radio-options">
                                        <div className="radio-option-container">
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
                                        <div className="radio-option-container">
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
                                            <TextField
                                                value={numberOfWords}
                                                onChange={(e) => setNumberOfWords(e.target.value)}
                                                id="outlined-basic"
                                                label="Number of words"
                                                variant="outlined"
                                                sx={{
                                                    width: '300px',
                                                }}
                                                InputProps={{
                                                    sx: {
                                                        height: '50px',
                                                    },
                                                }}
                                            />
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
                        </div>
                    </form>
                </div>
                <Footer />
            </div>

        </>

    )
}