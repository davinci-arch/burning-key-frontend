import { useState, useRef, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import MultiplayerTyping from "./MultiplayerTyping";
import "../../styles/multiplayer.scss"
export default function MultiplayerTypingPage({ isSoundOn }) {
    const typoRef = useRef(null);
    const { uuid } = useParams();

    const [speed, setSpeed] = useState(0.0);
    const [accuracy, setAccuracy] = useState(0);
    const [prevSpeed, setPrevSpeed] = useState(0.0);
    const [prevAccuracy, setPrevAccuracy] = useState(0);
    const [activeTab, setActiveTab] = useState('text');
    const [result, setResult] = useState(false);
    const [words, setWords] = useState(0);
    const [users, setUsers] = useState([]);
    const [isLoaded, setLoaded] = useState(false);
    const [isConnected, setConnected] = useState(false);
    const [sessionId, setSessionId] = useState("");
    const [timerToStart, setTimerToStart] = useState();
    const [isStart, setStart] = useState(false);
    const [amountOfPlayers, setAmountOfPlayers] = useState(0);
    const socket = useRef();
    const usersRef = useRef(users);
    const sessionIdRef = useRef(sessionId);
    const amountWords = useRef(words);
    const navigate = useNavigate();
    const [isRedirect, setIsRedirect] = useState(false);
    const [redirectTime, setRedirectTime] = useState(10);
    const [playersPosition, setPlayersPosition] = useState([]);

    useEffect(() => {
        usersRef.current = users;
        setAmountOfPlayers(usersRef.current.length);
    }, [users]);
    useEffect(() => {
        sessionIdRef.current = sessionId;
    }, [sessionId]);
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

    const setNewSpeed = (wpm) => {
        setSpeed(wpm);
        setPrevSpeed(speed);
    }

    const newAccuracy = (newAccuracy) => {
        setAccuracy(newAccuracy);
        setPrevAccuracy(accuracy);
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
            setConnected(true);
            const message = {
                type: "CONNECT",
                username: Math.floor(Math.random() * (1000 - 0 + 1)) + 0 + "",
                uid: uuid,
            }
            sendMessage(message);
        }
        socket.current.onmessage = (event) => {
            const message = event.data;
            const data = JSON.parse(message);

            if (data.type == "STARTED") {
                console.log("The match already started, you will be redirected");
                setIsRedirect(true);
            } else if (data.type == "EXPIRED_ROOM") {
                console.log("This room already closed, you will be redirected");
                setIsRedirect(true);
            } else if (data.type === "CONNECT") {
                addUsers(data.data);
            } else if (data.type === "CONNECT_USER") {
                addUser(data.data);
                setSessionId(data.sessionId);
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
            console.log("socket was closed");
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
            {/* {result ?
                <TypingResult
                    speed={speed}
                    prevSpeed={prevSpeed}
                    accuracy={accuracy}
                    prevAccuracy={prevAccuracy} /> : null
            } */}
            {isRedirect > 0 ?
                <div>
                    You will be redirected after {redirectTime}
                </div>
                : null
            }
            {timerToStart > 0 ?
                <div className="start-race-timer-container">
                    <div className="start-race-timer">
                        {timerToStart}
                    </div>
                </div> : null
            }

            <div className="toolbar-container">
                <div className="toolbar">
                    <div className="navigation">
                        <Link to="multiplayer" className='link'>
                            <p onClick={() => handleTabClick('multiplayer')}
                                className={activeTab === 'multiplayer' ? 'active' : ''}>
                                multiplayer
                            </p>
                        </Link>
                        <p onClick={() => handleTabClick('test')} className={activeTab === 'test' ? 'active' : ''}>
                            test
                        </p>
                        <p onClick={() => handleTabClick('text')} className={activeTab === 'text' ? 'active' : ''}>
                            text
                        </p>
                        <p onClick={() => handleTabClick('single')} className={activeTab === 'single' ? 'active' : ''}>
                            single
                        </p>
                        <div className="animation move">navigation</div>
                    </div>
                    <span className="separator"></span>
                    <div className="toolbar-middle">
                        {activeTab === "test" ?
                            <div className="time-options">
                                <p onClick={() => changeTime(15)} className={choosenTime === 15 ? 'active' : ''}>15</p>
                                <p onClick={() => changeTime(30)} className={choosenTime === 30 ? 'active' : ''}>30</p>
                                <p onClick={() => changeTime(60)} className={choosenTime === 60 ? 'active' : ''}>60</p>
                            </div> : null
                        }
                    </div>
                    <span className="separator"></span>
                    <div className="text-config">
                        <p>font</p>
                        <p>size</p>
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
                        newAccuracy={newAccuracy}
                        setResult={setResult}
                        sendMessage={sendMessage}
                        sessionId={sessionId}
                        uuid={uuid}
                        setWords={setWords}
                        timerToStart={timerToStart}
                        amountOfPlayers={amountOfPlayers}
                    />}
                </div>
            </div>
            <div className="players" >
                {users.map((user, index) => (
                    <div className="players-row" key={index}>
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
        </>
    )
}