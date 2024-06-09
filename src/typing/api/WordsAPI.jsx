import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/v1/texts";

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getWordSets = async () => {
    try {
        const response = await apiClient.get("/word-sets");
        return response.data;
    } catch (error) {
        console.error('Error fetching word sets:', error);
        throw error;
    }
};

export const generateRandomWords = async ({
    wordSetName,
    numWords,
    numSignsPercent,
    numUpperCasePercent,
    doubleEveryWord
}) => {
    try {
        const params = {
            wordSetName,
            ...(numWords && { numWords }),
            ...(numSignsPercent && { numSignsPercent }),
            ...(numUpperCasePercent && { numUpperCasePercent }),
            ...(doubleEveryWord && { doubleEveryWord })
        };

        const response = await apiClient.get("/generate-words", { params });
        return response.data;
    } catch (error) {
        console.error('Error generating random words:', error);
        throw error;
    }
};
