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
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

export const deleteUser = async (userId) => {
    try {
        const response = await apiClient.delete(`/${userId}`);
        return response.status === 204;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};


export const updateUser = async (userId, userDto) => {
    try {
        const response = await apiClient.put(`/${userId}`, userDto);
        return response.data;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};

