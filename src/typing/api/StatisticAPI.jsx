import axios from 'axios';
import {fetchData} from "./UserAPI.jsx";

const API_BASE_URL = 'http://localhost:8080/api/v1/user-statistics';
const token = localStorage.getItem('token');

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    },
});

export const saveStatistics = async (userId, averageSpeedWpm, averageAccuracy, timeSpent) => {
    try {
        const apiClient = axios.create({
            baseURL: 'http://localhost:8080/api/v1/user-lessons/',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        const requestBody = {
            averageAccuracy: averageAccuracy,
            averageSpeedWpm: averageSpeedWpm,
            timeSpent: timeSpent,
        }
        const response = await apiClient.post(`/add-lesson/${userId}`, requestBody)
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

export const fetchStatisticData = async () => {
    try {
        const userId= await fetchData(token);
        const response = await apiClient.get(`/${userId.userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }

    /*
    "totalSessions": 1,
    "totalLessons": 4,
    "totalTimeSpent": 80,
    "bestSpeedWpm": 100.0,
    "bestAccuracy": 100.0,
    "averageSpeedWpm": 100.0,
    "averageAccuracy": 100.0
    */

};
export const fetchLeaderboard = async () => {
    try {
        const apiClient = axios.create({
            baseURL: API_BASE_URL,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const response = await apiClient.get(`/leaderboard`);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}