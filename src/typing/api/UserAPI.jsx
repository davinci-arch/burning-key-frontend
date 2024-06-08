import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1/users';
const token = localStorage.getItem('token');

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    },
});

export const fetchData = async () => {
    try {
        const response = await apiClient.get(`/by-token/${token}`);
        console.log('Error fetching data:', response);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};
