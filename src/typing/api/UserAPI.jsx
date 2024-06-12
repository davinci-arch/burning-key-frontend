import axios from 'axios';
import {useState} from "react";
import CryptoJS from "crypto-js";


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

export const fetchImage = async (userId) => {
    try {
        const apiClient = axios.create({
            baseURL: API_BASE_URL,
            headers: {
                "Content-Type": "multipart/form-data",
            },responseType: "arraybuffer"
        });
        const response = await apiClient.get(`/image/${userId}`);
        const base64 = btoa(
            new Uint8Array(response.data).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                ''
            )
        )
        return base64;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

export const uploadImage = async (userId, file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await apiClient.post(`/image/${userId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`,
            },
        });
        return response.status === 200;
    } catch (error) {
        console.error('Error uploading image:', error);
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

