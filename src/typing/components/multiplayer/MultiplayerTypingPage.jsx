import { useState, useRef, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import MultiplayerTyping from "./MultiplayerTyping";
import "../../styles/multiplayer.scss"
import Result from "./Result";
import Header from "../Header";
import Footer from "../Footer";

export default function MultiplayerTypingPage({
    isDarkTheme, toggleTheme, isSoundOn, toggleSound,
    selectedFont, handleFontClick, selectedSize, handleSizeClick
}) {
    const typoRef = useRef(null);
    const { uuid } = useParams();

    const [speed, setSpeed] = useState(0.0);
    const [accuracy, setAccuracy] = useState(0);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [mistakes, setMistakes] = useState(0);
    const [activeTab, setActiveTab] = useState('text');
    const [result, setResult] = useState(false);
    const [wrongWordsIndexes, setWrongWords] = useState([]);
    const [textWords, setTextWords] = useState([]);

    const [words, setWords] = useState(0);
    const [users, setUsers] = useState([]);
    const [isLoaded, setLoaded] = useState(false);
    const [isConnected, setConnected] = useState(false);
    const [timerToStart, setTimerToStart] = useState();
    const [isStart, setStart] = useState(false);
    const [amountOfPlayers, setAmountOfPlayers] = useState(0);
    const socket = useRef();
    const usersRef = useRef(users);
    const amountWords = useRef(words);
    const navigate = useNavigate();
    const [isRedirect, setIsRedirect] = useState(false);
    const [redirectTime, setRedirectTime] = useState(10);
    const [playersPosition, setPlayersPosition] = useState([]);
    const [positions, setPositions] = useState([]);
    const [username, setUsername] = useState("");
    const [textAPI, setTextAPI] = useState("");
    const [redirectMessage, setRedirectMessage] = useState("");
    useEffect(() => {
        usersRef.current = users;
        setAmountOfPlayers(usersRef.current.length);
    }, [users]);
    useEffect(() => {
        amountWords.current = words;
    }, [words]);
    useEffect(() => {
        setLoaded(true);
        if (isLoaded) {
            connect();
        }
        return () => {
            if (socket.current) {
                socket.current.close();
            }
        };
    }, [isLoaded]);

    useEffect(() => {
        let timer;
        if (isRedirect && redirectTime > 0) {
            timer = setInterval(() => {
                setRedirectTime((prevTime) => prevTime - 1);
            }, 1000);
        } else if (isRedirect && redirectTime <= 0) {
            clearInterval(timer);
            navigate("/multiplayer/rooms");
        }

        return () => clearInterval(timer);
    }, [isRedirect, redirectTime]);

    const setNewSpeed = (speed) => {
        setSpeed(speed.toFixed(2));
    }

    const newAccuracy = (accuracy) => {
        setAccuracy(Math.ceil(accuracy));
    }

    const calculateProgress = (wordPosition) => {
        const completeTextPercent = (wordPosition * 100) / amountWords.current;
        return completeTextPercent;
    }

    const handleResetClick = () => {
        if (typoRef.current) {
            typoRef.current.resetText();
        }
    }

    const connect = () => {
        socket.current = new WebSocket("ws://localhost:8080/multiplayer/rooms/room");
        socket.current.onopen = () => {
            // console.log("Room connected")
            setConnected(true);
            const user = "Visitor " + Math.floor(Math.random() * (1000 + 1));
            setUsername(user);
            const message = {
                type: "CONNECT",
                username: user,
                uid: uuid,
            }
            sendMessage(message);
        }
        socket.current.onmessage = (event) => {
            const message = event.data;
            const data = JSON.parse(message);

            if (data.type == "STARTED") {
                setRedirectMessage("The match already started, you will be redirected after: ")
                setIsRedirect(true);
            } else if (data.type == "EXPIRED_ROOM") {
                setRedirectMessage("This room already closed, you will be redirected after: ")
                setIsRedirect(true);
            } else if (data.type == "ROOM_FILLED") {
                setRedirectMessage("This room already filled, you will be redirected after: ")
                setIsRedirect(true);
            } else if (data.type === "CONNECT") {
                addUsers(data.data);
            } else if (data.type === "CONNECT_USER") {
                setTextAPI(data.text);
                addUser(data.data);
            } else if (data.type === "DISCONNECT") {
                setUsers(prevUsers => prevUsers.filter(user => user.sessionId !== data.data.sessionId));
            } else if (data.type === "DATA") {
                updateCurrentUserWord(data.currentWord, data.sessionId, data.currentWordPosition, data.newSpeed);
            } else if (data.type === "TIMER") {
                setTimerToStart(data.duration);
            } else if (data.type === "END_RACE") {
                handleEndRace(data);
            }
        }

        socket.current.onclose = () => {
            // console.log("Room socket was closed");
        }

        socket.current.onerror = () => {
            console.log("something went wrong");
        }
    }
    const updateCurrentUserWord = (currentWord, id, position, speed) => {
        setUsers(prevUsers => {
            const updatedUsers = prevUsers.map(user => {
                if (user.sessionId === id) {
                    return { ...user, currentWord: currentWord, completeText: calculateProgress(position), currentSpeed: speed };
                }
                return user;
            });
            usersRef.current = updatedUsers;
            return updatedUsers;
        });
    };
    useEffect(() => {
        if (playersPosition.length > 0) {
            const lastUserId = playersPosition[playersPosition.length - 1];
            const user = usersRef.current.find(user => user.sessionId === lastUserId);
            if (user) {
                const userPosition = playersPosition.length - 1;
                setPositions(prevPositions => [
                    ...prevPositions,
                    { username: user.username, position: userPosition }
                ]);
            }
        }
    }, [playersPosition]);

    const handleEndRace = (data) => {
        setPlayersPosition(prev => {
            const newPositions = [...prev, data.userId];

            const userPosition = newPositions.length - 1;
            const updatedUsers = usersRef.current.map(user => {
                if (user.sessionId === data.userId) {
                    return { ...user, finished: userPosition };
                }
                return user;
            });

            setUsers(updatedUsers);

            return newPositions;
        });
    };

    const addUser = (user) => {
        setUsers(user);
    }
    const addUsers = (users) => {
        setUsers(prev => [...prev, users])
    }

    const sendMessage = (message) => {
        socket.current.send(JSON.stringify(message));
    }

    return (
        <>
            <div className={`multiplayer-wrapper ${isDarkTheme ? 'dark' : ''}`}>

                {timerToStart > 0 ?
                    <div className="start-race-timer-container">
                        <div className="start-race-timer">
                            {timerToStart}
                        </div>
                    </div> : null
                }
                <Header isDarkTheme={isDarkTheme} />



                {isRedirect ?
                    <div className="redirect-message">
                        {redirectMessage}{redirectTime}s
                    </div> :

                    <div className="middle-container">

                        {result ? <Result
                            wordsPerMinute={speed}
                            accuracy={accuracy}
                            mistakes={mistakes}
                            elapsedTime={elapsedTime}
                            places={positions}
                            username={username}
                            isSoundOn={isSoundOn}
                            textWords={textWords}
                            wrongWordsIndexes={wrongWordsIndexes}
                            isDarkTheme={isDarkTheme}
                        /> :
                            <>
                                <div className="toolbar-container">
                                    <div className={`toolbar ${isDarkTheme ? 'dark' : ''}`}>
                                        <div className="navigation">
                                            <Link className='single' to="/">
                                                <p>single</p>
                                            </Link>
                                            <div className="animation move">navigation</div>
                                        </div>
                                        <span className="separator"></span>
                                        <div className="text-config">
                                            <div className="dropdown-wrapper">
                                                <div className="dropdown">
                                                    <p>Font</p>
                                                    <ul className="dropdown-list">
                                                        <li className={selectedFont === 'system-ui' ? 'selected' : ''}
                                                            onClick={() => handleFontClick('system-ui')}>
                                                            System-UI
                                                        </li>
                                                        <li className={selectedFont === 'Arial' ? 'selected' : ''}
                                                            onClick={() => handleFontClick('Arial')}>
                                                            Arial
                                                        </li>
                                                        <li className={selectedFont === 'Roboto Slab' ? 'selected' : ''}
                                                            onClick={() => handleFontClick('Roboto Slab')}>
                                                            Roboto Slab
                                                        </li>
                                                        <li className={selectedFont === 'Cambria' ? 'selected' : ''}
                                                            onClick={() => handleFontClick('Cambria')}>
                                                            Cambria
                                                        </li>
                                                    </ul>
                                                </div>
                                                <div className="dropdown">
                                                    <p>Size</p>
                                                    <ul className="dropdown-list">
                                                        <li className={selectedSize === '11px' ? 'selected' : ''}
                                                            onClick={() => handleSizeClick('11px')}>
                                                            12px
                                                        </li>
                                                        <li className={selectedSize === '17px' ? 'selected' : ''}
                                                            onClick={() => handleSizeClick('17px')}>
                                                            18px
                                                        </li>
                                                        <li className={selectedSize === '22px' ? 'selected' : ''}
                                                            onClick={() => handleSizeClick('22px')}>
                                                            22px
                                                        </li>
                                                        <li className={selectedSize === '23px' ? 'selected' : ''}
                                                            onClick={() => handleSizeClick('23px')}>
                                                            24px
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div className="animation move">style</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="animated-container">
                                    <div className={`animated-component ${activeTab === 'text' ? 'active' : ''}`}>
                                        {activeTab === 'text' && <MultiplayerTyping
                                            typoRef={typoRef}
                                            isSoundOn={isSoundOn}
                                            setNewSpeed={setNewSpeed}
                                            setNewAccuracy={newAccuracy}
                                            setResult={setResult}
                                            sendMessage={sendMessage}
                                            uuid={uuid}
                                            setWords={setWords}
                                            timerToStart={timerToStart}
                                            amountOfPlayers={amountOfPlayers}
                                            setMistakes={setMistakes}
                                            setDurationOfMatch={setElapsedTime}
                                            setWrongWords={setWrongWords}
                                            setTextWords={setTextWords}
                                            isDarkTheme={isDarkTheme}
                                            selectedFont={selectedFont}
                                            selectedSize={selectedSize}
                                            text={textAPI}
                                        />}
                                    </div>
                                </div>
                            </>
                        }
                        <div className="players" >
                            {users.map((user, index) => (
                                <div className={user.username == username ? "players-row current-user" : "players-row"} key={index}>
                                    <div className="data">
                                        <img src="/src/assets/user.png" className="user-avatar" alt="user" />
                                        <p>{user.username}</p>
                                    </div>
                                    <div className="data">
                                        <div className="progress-bar">
                                            <div className="progress-smooth" style={{ width: `${user.completeText}%` }}></div>
                                            <div className="current-word">
                                                {user.currentWord ? user.currentWord : null}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="data">
                                        {user.finished !== undefined && (
                                            user.finished === 0 ? (
                                                <img src="/src/assets/fireBlue.png" className="fire" alt="" />
                                            ) : (
                                                <span>{(user.finished + 1)}nd</span>
                                            )
                                        )}
                                        <p>WPM:{user.currentSpeed ? user.currentSpeed : 0.0}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                }
                <Footer isDarkTheme={isDarkTheme} toggleTheme={toggleTheme} isSoundOn={isSoundOn}
                    toggleSound={toggleSound} />
            </div>


        </>

    )
}