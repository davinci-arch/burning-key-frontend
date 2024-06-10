import { useRef, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import "../../styles/room-settings.scss";
import Footer from "../Footer.jsx";
import Header from "../Header.jsx";
import { TextField, Autocomplete, Box, Slider } from "@mui/material";
import { getWordSets, generateRandomWords } from "../../api/WordsAPI.jsx";
import { getRandomText } from "../../api/TextAPI.jsx";

export default function RoomSettings({ isDarkTheme, toggleTheme, isSoundOn, toggleSound }) {


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
            <div className={`wrapper-settings ${isDarkTheme ? 'dark' : ''}`}>
                <Header isDarkTheme={isDarkTheme} />
                <div className={`content-settings ${isDarkTheme ? 'dark' : ''}`}>
                    <form action="" onSubmit={handleSubmit(handleSaveRoom)}>
                        <div className="content-settings-navigation">
                            <Link to='/multiplayer/rooms' style={{textDecoration:"none"}}>
                            <div className="back-to-page">
                                <img src="/src/assets/back.png" alt="back to page" className="toPage" />
                                <span>Back to rooms</span>
                            </div>
                            </Link>
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
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                id="outlined-basic"
                                                label="Title"
                                                variant="outlined"
                                                error={!!errors?.title}
                                                sx={{
                                                    width: '300px',
                                                    // Умовна логіка для зміни кольору в залежності від теми
                                                    '& .MuiOutlinedInput-root': {
                                                        '& fieldset': {
                                                            borderColor: isDarkTheme ? '#778183' : '',
                                                        },
                                                        '&:hover fieldset': {
                                                            borderColor: isDarkTheme ? '#d6d2bc' : '',
                                                        },
                                                        '&.Mui-focused fieldset': {
                                                            borderColor: isDarkTheme ? '#d6d2bc' : '',
                                                        },
                                                        '& input': {
                                                            color: isDarkTheme ? '#d6d2bc' : '',
                                                        },
                                                    },
                                                    '& .MuiInputLabel-root': {
                                                        color: isDarkTheme ? '#d6d2bc' : '',
                                                    },
                                                    '& .MuiInputLabel-root.Mui-focused': {
                                                        color: isDarkTheme ? '#d6d2bc' : '',
                                                    },
                                                }}
                                                InputProps={{
                                                    sx: {
                                                        height: '50px',
                                                    },
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
                                                className='textfield_room'
                                                {...field}
                                                id="outlined-basic"
                                                label="Max amount of players"
                                                variant="outlined"
                                                error={!!errors?.amountOfPlayers}
                                                sx={{
                                                    width: '300px',
                                                    '& .MuiOutlinedInput-root': {
                                                        '& fieldset': {
                                                            borderColor: isDarkTheme ? '#778183' : '',
                                                        },
                                                        '&:hover fieldset': {
                                                            borderColor: isDarkTheme ? '#d6d2bc' : '',
                                                        },
                                                        '&.Mui-focused fieldset': {
                                                            borderColor: isDarkTheme ? '#d6d2bc' : '',
                                                        },
                                                        '& input': {
                                                            color: isDarkTheme ? '#d6d2bc' : '',
                                                        },
                                                    },
                                                    '& .MuiInputLabel-root': {
                                                        color: isDarkTheme ? '#d6d2bc' : '',
                                                    },
                                                    '& .MuiInputLabel-root.Mui-focused': {
                                                        color: isDarkTheme ? '#d6d2bc' : '',
                                                    },
                                                }}
                                                InputProps={{
                                                    sx: {
                                                        height: '50px',
                                                    },
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
                                                    // Умовна логіка для зміни кольору в залежності від теми
                                                    '& .MuiOutlinedInput-root': {
                                                        '& fieldset': {
                                                            borderColor: isDarkTheme ? '#778183' : '',
                                                        },
                                                        '&:hover fieldset': {
                                                            borderColor: isDarkTheme ? '#d6d2bc' : '',
                                                        },
                                                        '&.Mui-focused fieldset': {
                                                            borderColor: isDarkTheme ? '#d6d2bc' : '',
                                                        },
                                                        '& input': {
                                                            color: isDarkTheme ? '#d6d2bc' : '',
                                                        },
                                                    },
                                                    '& .MuiInputLabel-root': {
                                                        color: isDarkTheme ? '#d6d2bc' : '',
                                                    },
                                                    '& .MuiInputLabel-root.Mui-focused': {
                                                        color: isDarkTheme ? '#d6d2bc' : '',
                                                    },
                                                }}
                                                InputProps={{
                                                    sx: {
                                                        height: '50px',
                                                    },
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
                                                            autoComplete: 'Easy',
                                                        }}
                                                        sx={{
                                                            '& .MuiOutlinedInput-root': {
                                                                '& fieldset': {
                                                                    borderColor: isDarkTheme ? '#778183' : '',
                                                                },
                                                                '&:hover fieldset': {
                                                                    borderColor: isDarkTheme ? '#d6d2bc' : '',
                                                                },
                                                                '&.Mui-focused fieldset': {
                                                                    borderColor: isDarkTheme ? '#d6d2bc' : '',
                                                                },
                                                                '& input': {
                                                                    color: isDarkTheme ? '#d6d2bc' : '',
                                                                },
                                                            },
                                                            '& .MuiInputLabel-root': {
                                                                color: isDarkTheme ? '#d6d2bc' : '',
                                                            },
                                                            '& .MuiInputLabel-root.Mui-focused': {
                                                                color: isDarkTheme ? '#d6d2bc' : '',
                                                            },
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
                                                            autoComplete: 'Easy',
                                                        }}
                                                        sx={{
                                                            '& .MuiOutlinedInput-root': {
                                                                '& fieldset': {
                                                                    borderColor: isDarkTheme ? '#778183' : '',
                                                                },
                                                                '&:hover fieldset': {
                                                                    borderColor: isDarkTheme ? '#d6d2bc' : '',
                                                                },
                                                                '&.Mui-focused fieldset': {
                                                                    borderColor: isDarkTheme ? '#d6d2bc' : '',
                                                                },
                                                                '& input': {
                                                                    color: isDarkTheme ? '#d6d2bc' : '',
                                                                },
                                                            },
                                                            '& .MuiInputLabel-root': {
                                                                color: isDarkTheme ? '#d6d2bc' : '',
                                                            },
                                                            '& .MuiInputLabel-root.Mui-focused': {
                                                                color: isDarkTheme ? '#d6d2bc' : '',
                                                            },
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
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        '& fieldset': {
                                                            borderColor: isDarkTheme ? '#778183' : '',
                                                        },
                                                        '&:hover fieldset': {
                                                            borderColor: isDarkTheme ? '#d6d2bc' : '',
                                                        },
                                                        '&.Mui-focused fieldset': {
                                                            borderColor: isDarkTheme ? '#d6d2bc' : '',
                                                        },
                                                        '& input': {
                                                            color: isDarkTheme ? '#d6d2bc' : '',
                                                        },
                                                    },
                                                    '& .MuiInputLabel-root': {
                                                        color: isDarkTheme ? '#d6d2bc' : '',
                                                    },
                                                    '& .MuiInputLabel-root.Mui-focused': {
                                                        color: isDarkTheme ? '#d6d2bc' : '',
                                                    },
                                                }}
                                            />
                                            <div>Number of Signs Percent: {signPercent}%</div>
                                            <Box sx={{ width: 300, color: '#3a3c3d',
                                                '& .MuiSlider-thumb': {
                                                    backgroundColor: '#85898a',
                                                },
                                                '& .MuiSlider-rail': {
                                                    backgroundColor: '#666e70',
                                                },
                                                '& .MuiSlider-track': {
                                                    backgroundColor: '#677070',
                                                }, }}>
                                                <Slider defaultValue={0}
                                                    aria-label="Default"
                                                    valueLabelDisplay="off"
                                                    onChange={handleSignPercentSlider} />
                                            </Box>
                                            <div>Number of Upper Case Percent: {upperCasePercent}%</div>
                                            <Box sx={{ width: 300, color: '#3a3c3d',
                                                '& .MuiSlider-thumb': {
                                                    backgroundColor: '#85898a',
                                                },
                                                '& .MuiSlider-rail': {
                                                    backgroundColor: '#666e70',
                                                },
                                                '& .MuiSlider-track': {
                                                    backgroundColor: '#677070',
                                                }, }}>
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
                <Footer isDarkTheme={isDarkTheme} toggleTheme={toggleTheme} isSoundOn={isSoundOn}
                        toggleSound={toggleSound} />
            </div>

        </>

    )
}