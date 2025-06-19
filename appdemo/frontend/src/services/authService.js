import axios from "axios";

const API_URL = "http://localhost:5000/api/usuarios";

export const register = (userData) => {
    return axios.post(API_URL, userData);
};

export const login = (userData) => {
    return axios.post(`${API_URL}/login`, userData);
};

export const logout = () => {
    localStorage.removeItem("token");
};

export const getToken = () => {
    return localStorage.getItem("token");
};
