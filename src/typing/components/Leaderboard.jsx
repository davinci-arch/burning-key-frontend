// Leaderboard.js
import React, {useState} from 'react';
import "../styles/leaderboard.scss";

const LeaderboardModal = ({ isDarkTheme }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const data = Array.from({ length: 50 }, (_, index) => ({
        username: `User${index + 1}`,
        speed: Math.floor(Math.random() * (100 - 60 + 1)) + 60,
        accuracy: Math.floor(Math.random() * (100 - 90 + 1)) + 90
    }));

    const openModal = () => {
        setIsModalVisible(true);
        setTimeout(() => setIsModalOpen(true), 0);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setIsModalVisible(false), 300);
    };

    const handleBackgroundClick = (e) => {
        if (e.target.className.includes('modal')) {
            closeModal();
        }
    };

    return (
        <div>
            <div className={`leaderboard-container ${isDarkTheme ? 'dark' : ''}`} onClick={openModal}>
                <img src="/src/assets/leaderboard.png" title="leaderboard" className="leaderboard-img" onClick={openModal}/>
            </div>
            {isModalVisible && (
                <div className={`modal ${isModalOpen ? 'open' : ''} ${isDarkTheme ? 'dark' : ''}`}
                     onClick={handleBackgroundClick}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2 className="title">Leaderboard</h2>
                        <div className="table-container ">
                            <table className="custom-table">
                                <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Speed</th>
                                    <th>Accuracy</th>
                                </tr>
                                </thead>
                                <tbody>
                                {data.map((user, index) => (
                                    <tr key={index}>
                                        <td>{user.username}</td>
                                        <td>{user.speed + ' wpm'}</td>
                                        <td>{user.accuracy + ' %'}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeaderboardModal;
