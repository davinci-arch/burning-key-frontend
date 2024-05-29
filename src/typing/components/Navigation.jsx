
import { Routes, Route } from "react-router-dom"
import HomePage from "./HomePage"
import SigninPage from "./SigninPage"
import SingleTyping from "./SingleTyping"
export default function Navigation({ isSoundOn }) {
    return (
        <Routes>
            <Route path="/" element={<SingleTyping isSoundOn={isSoundOn} />} />
            <Route path="/login" element={<SigninPage />} />
        </Routes>
    )
}