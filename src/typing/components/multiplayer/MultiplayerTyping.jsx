import { useState, useRef, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import SingleTyping from "../SingleTyping";
import "../../styles/multiplayer.scss"
export default function MultiplayerTyping({ isSoundOn }) {
    const typoRef = useRef(null);
    const { uuid } = useParams();

    const [speed, setSpeed] = useState(0.0);
    const [accuracy, setAccuracy] = useState(0);
    const [prevSpeed, setPrevSpeed] = useState(0.0);
    const [prevAccuracy, setPrevAccuracy] = useState(0);
    const [activeTab, setActiveTab] = useState('text');
    const [result, setResult] = useState(false);
    const [words, setWords] = useState(25);
    const [completeText, setCompleteText] = useState(0);
    const [users, setUsers] = useState([]);
    const [isLoaded, setLoaded] = useState(false);
    const [isConnected, setConnected] = useState(false);

    const socket = useRef();
    const usersRef = useRef(users);

    // Update usersRef whenever users state changes
    useEffect(() => {
        usersRef.current = users;
    }, [users]);

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

    const setNewSpeed = (wpm) => {
        setSpeed(wpm);
        setPrevSpeed(speed);
    }

    const newAccuracy = (newAccuracy) => {
        setAccuracy(newAccuracy);
        setPrevAccuracy(accuracy);
    }

    const calculateProgress = (wordPosition) => {
        const completeTextPercent = (wordPosition * 100) / 25;
        setCompleteText(completeTextPercent);
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
                username: "Visitor",
                uid: uuid,
            }

            sendMessage(message);
        }

        socket.current.onmessage = (event) => {
            const message = event.data;
            const data = JSON.parse(message);

            if (data.type === "CONNECT") {
                addUsers(data.data);
            } else if (data.type === "CONNECT_USER") {
                addUser(data.data);
            } else if (data.type === "DISCONNECT") {
                setUsers(prevUsers => prevUsers.filter(user => user.sessionId !== data.data.sessionId));
            }
        }

        socket.current.onclose = () => {
            console.log("socket was closed");
        }

        socket.current.onerror = () => {
            console.log("something went wrong");
        }
    }

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
                    {activeTab === 'text' && <SingleTyping
                        typoRef={typoRef}
                        isSoundOn={isSoundOn}
                        setNewSpeed={setNewSpeed}
                        newAccuracy={newAccuracy}
                        setResult={setResult} />}
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
                                <div className="progress-smooth" style={{ width: `${completeText}%` }}></div>
                                <div className="current-word">word</div>
                            </div>
                        </div>
                        <div className="data">
                            <img src="/src/assets/fireBlue.png" className="fire" alt="" />
                            <p>WPM:XXX</p>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}