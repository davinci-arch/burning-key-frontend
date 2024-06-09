import { useRef } from "react";
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import "../../styles/rooms.scss"
import Footer from "../Footer.jsx"
import Header from "../Header.jsx"
import RoomItem from "./RoomItem.jsx";
export default function Rooms({ isDarkTheme, toggleTheme, isSoundOn, toggleSound }) {

    const [isLoaded, setLoaded] = useState(false);
    const [rooms, setRooms] = useState([]);
    const navigate = useNavigate();
    const socket = useRef();

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

    const connect = () => {
        socket.current = new WebSocket("ws://localhost:8080/multiplayer/rooms");
        socket.current.onopen = () => {
            // console.log("Rooms conneceted")
        }

        socket.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === "CONNECT") {
                addListData(data.data);
            } else if (data.type === "DATA") {
                addRoom(data.data)
            } else if (data.type === "REMOVE_ROOM") {
                setRooms(prevRoom => prevRoom.filter(room => room.uid !== data.data.uid));
            } else if (data.type === "CONNECT_USER") {
                addUserToRoom(data.uid, data.username, data.isTimerCountDown)
            }
        }

        socket.current.onclose = () => {
            // console.log("Rooms socket was closed")
        }

        socket.current.onerror = () => {
            // console.log("something went wrong")
        }
    }

    const addUserToRoom = (idRoom, username, isTimerCountDown) => {
        setRooms(prevRooms => {
            return prevRooms.map(room => {
                if (room.uid === idRoom) {
                    return {
                        ...room,
                        activeUsers: room.activeUsers ? [...room.activeUsers, { username, isTimerCountDown }] : [{ username, isTimerCountDown }]
                    };
                }
                return room;
            });
        });
    };
    const addListData = (data) => {
        setRooms(data);
    }

    const addRoom = (room) => {
        setRooms(prev => [...prev, room])
    }

    const sendMessage = (message) => {
        socket.current.send(JSON.stringify(message));
    }

    const handleNewRoom = () => {
        navigate("/multiplayer/rooms/room-settings")
    }

    return (
        <>
            <div className={`container ${isDarkTheme ? 'dark' : ''}`}>

                <Header isDarkTheme={isDarkTheme} />
                <div className="wrapper">
                    <div className="content">
                        <div className="navigation">
                            <Link to='/'>
                                <div className="toPage">
                                    <div>
                                        <img src="/src/assets/back.png" alt="back-img" />
                                    </div>
                                    <div>Back to main</div>
                                </div>
                            </Link>

                            <div className="create-room-btn" onClick={handleNewRoom}>
                                <span>
                                    Create room
                                </span>
                            </div>
                        </div>
                        <div className="available-rooms">
                            {rooms.length > 0 ? (
                                rooms.map((room, index) => {
                                    return (
                                        <RoomItem
                                            key={index}
                                            idRoom={room.uid}
                                            title={room.title}
                                            timeToStart={room.start}
                                            activeUsers={room.activeUsers}
                                            timerCountDown={room.timerCountDown}
                                        />
                                    );
                                }))
                                :
                                <div className="empty-rooms-list">
                                    <span>List of rooms is empty</span>
                                    <img src="/src/assets/sad.png" alt="refresh" className="empty-rooms-img"/>
                                </div>
                            }
                        </div>
                    </div>
                </div>


                <Footer isDarkTheme={isDarkTheme} toggleTheme={toggleTheme} isSoundOn={isSoundOn}
                    toggleSound={toggleSound} />
            </div>

        </>
    )
}