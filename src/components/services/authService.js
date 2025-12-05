import axios from "axios";
import {mapLoginRequest, mapRegisterRequest, mapVerifyRequest} from "../../mappers/authMapper";

const BASE_URL = "http://localhost:8080/api/auth";

export const registerUser = async (form) => {
    const request = mapRegisterRequest(form);
    const response = await axios.post(`${BASE_URL}/register`, request);
    return response.data;
};

export const verifyUser = async (email, code) => {
    const request = mapVerifyRequest(email, code);
    const response = await axios.post(`${BASE_URL}/verify`, request);
    return response.data;
};

export const loginUser = async (form) => {
    const request = mapLoginRequest(form);
    const response = await axios.post(`${BASE_URL}/login`, request);
    return response.data;
};
