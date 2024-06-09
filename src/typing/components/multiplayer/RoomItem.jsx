import { useState, useEffect, act } from "react"
import { Link } from "react-router-dom"
export default function RoomItem({ idRoom, title, timeToStart, activeUsers, timerCountDown }) {

    function convertToMinutesSeconds(seconds) {
        if (seconds > 0) {
            var minutes = Math.floor(seconds / 60);
            var seconds = seconds % 60;
            return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
        } else {
            return "0:00";

        }

    }

    // console.log(idRoom + " " + title + " " + timeToStart + " " + timerCountDown)

    const [time, setTime] = useState(convertToMinutesSeconds(timeToStart));
    useEffect(() => {

        if (timerCountDown == true && timeToStart > 0) {
            const initialSeconds = timeToStart;
            let durationInSeconds = initialSeconds;

            const timerInterval = setInterval(() => {
                const minutes = Math.floor(durationInSeconds / 60);
                const seconds = durationInSeconds % 60;

                setTime(`${minutes}:${seconds < 10 ? "0" : ""}${seconds}`);

                if (--durationInSeconds < 0) {
                    clearInterval(timerInterval);
                }
            }, 1000);

        }
    }, [timerCountDown]);

    return (
        <div className={time != "0:00" ? "room active-room" : "room done-room"}>
            <Link to={`/multiplayer/rooms/room/${idRoom}`}>
                <div className="join-btn">
                    join
                </div>
            </Link>
            <div className="description-block">
                <div className="clock-container">
                    <div>
                        <img src="/src/assets/clock.svg" alt="clock" className="clock" />
                    </div>
                    <div>
                        <span>{time}</span>
                    </div>
                </div>
                <div className="title">
                    <span>{title}</span>
                </div>
            </div>
            <div className="separator"></div>
            <div className={activeUsers && activeUsers > 9 ? "profiles-overflow" : "profiles"}>
                {activeUsers ? (
                    activeUsers.map((user, index) => (
                        <div className={activeUsers.length > 9 ? "profile-overflow" : "profile"} key={index}>
                            <div>
                                <img src="/src/assets/user.png" alt="avatar" />
                            </div>
                            <div>
                                <span>{user.username}</span>
                            </div>
                        </div>
                    ))
                ) : null}
            </div>

        </div>
    )
}