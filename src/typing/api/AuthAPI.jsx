import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1/auth';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getLoginLink = async (email) => {
    try {
        const response = await apiClient.post(`/signin/${email}`);
        return response.data.token;
    } catch (error) {
        console.error('Error fetching authentication token:', error);
        throw error;
    }
};

export const logoutUser = async () => {
    try {
        const token = localStorage.getItem('token');
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': "text/plain",
            crossDomain:true,
        };
        const response = await apiClient.get("/logout",{headers});
    } catch (error) {
        console.error('Error logout user:', error.response ? error.response.data : error.message);
        throw error;
    }
};

