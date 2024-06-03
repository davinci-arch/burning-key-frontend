
import { Routes, Route } from "react-router-dom"
import SigninPage from "./SigninPage"
import SingleTypingPage from "./SingleTypingPage"
import Rooms from "./multiplayer/Rooms"
import MultiplayerTypingPage from "./multiplayer/MultiplayerTypingPage"
export default function Navigation({ isSoundOn }) {
    return (
        <Routes>
            <Route path="/" element={<SingleTypingPage isSoundOn={isSoundOn} />} />
            <Route path="/login" element={<SigninPage />} />
            <Route path="/multiplayer/rooms" element={<Rooms />} />
            <Route path="/multiplayer/rooms/room/:uuid" element={<MultiplayerTypingPage isSoundOn={isSoundOn} />} />
        </Routes>
    )
}