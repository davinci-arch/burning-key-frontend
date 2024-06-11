import React, { useEffect, useState } from 'react';
import "../styles/leaderboard.scss";
import { fetchLeaderboard } from "../api/StatisticAPI.jsx";

const LeaderboardModal = ({ isDarkTheme }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await fetchLeaderboard();
                if (Array.isArray(userData)) {
                    setData(userData);
                } else {
                    console.error('Fetched data is not an array:', userData);
                }
            } catch (error) {
                console.error('Failed to fetch leaderboard data:', error);
            }
        };
        fetchUserData();
    }, []);

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
                <img src="/src/assets/leaderboard.png" title="leaderboard" className="leaderboard-img" onClick={openModal} />
            </div>
            {isModalVisible && (
                <div className={`modal ${isModalOpen ? 'open' : ''} ${isDarkTheme ? 'dark' : ''}`} onClick={handleBackgroundClick}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2 className="title">Leaderboard</h2>
                        <div className="table-container">
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
                                        <td>{user.nickname}</td>
                                        <td>{user.averageSpeedWpm.toFixed(1) + ' wpm'}</td>
                                        <td>{user.averageAccuracy.toFixed(1) + ' %'}</td>
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
