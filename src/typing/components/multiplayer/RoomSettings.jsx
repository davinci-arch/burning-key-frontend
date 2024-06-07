import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


export default function RoomSettings() {


    const socket = useRef();
    const [username, setUsers] = useState("");
    const [title, setTitle] = useState("");

    const navigate = useNavigate();
    

    const createRoom = () => {
        socket.current = new WebSocket("ws://localhost:8080/multiplayer/rooms");
        socket.current.onopen = () => {
            const message = {
                type: "CREATE",
                username: "Room",
                title: title
            };

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

    const sendMessage = (message) => {
        socket.current.send(JSON.stringify(message));
    }

    return (

        <div>
            <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <button onClick={createRoom}>Save room</button>
        </div>
    )
}