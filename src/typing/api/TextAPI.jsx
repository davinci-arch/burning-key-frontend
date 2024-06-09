import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/v1/texts"

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getText = async () => {
    try {
      const response = await apiClient.get("/2");
      return response.data.content;
    } catch (error) {
      console.error('Error fetching placeholder data:', error);
      throw error;
    }
  };

export const getRandomText = async (difficulty, language) => {
    try {
        const response = await apiClient.get("/text", {
            params: { difficulty: difficulty, language: language }
        });
        return response.data.content;
    } catch (error) {
        console.error('Error fetching placeholder data:', error);
        throw error;
    }
};