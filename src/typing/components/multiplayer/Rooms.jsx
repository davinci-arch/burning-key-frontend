import { useRef } from "react";
import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import "../../styles/rooms.scss"
export default function Rooms({ isSoundOn }) {

    const [connected, setConnected] = useState(false);
    const [isLoaded, setLoaded] = useState(false);
    const [rooms, setRooms] = useState([]);

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
            setConnected(true);
            // console.log("conneceted")
        }

        socket.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type == "CONNECT") {
                addListData(data.data);
            } else if (data.type == "DATA") {
                addRoom(data.data)
            }
        }

        socket.current.onclose = () => {
            // console.log("socket was closed")
        }

        socket.current.onerror = () => {
            // console.log("something went wrong")
        }
    }

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
        const message = {
            type: "CREATE",
            username: "Room",
        };

        sendMessage(message);
    }

    return (
        <div className="container">
            <div className="createRoom_btn" onClick={handleNewRoom}>
                <p>Add new room</p>
            </div>
            <div className="room_container">
                {rooms.map((room, index) => (
                    <Link to={`/multiplayer/rooms/room/${room.uid}`} className="room" key={index}>
                        {room.title}
                    </Link>
                ))}
            </div>
        </div>
    )
}