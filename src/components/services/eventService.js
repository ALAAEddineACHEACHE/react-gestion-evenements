import axios from "axios";
import {mapEventRequest} from "../../mappers/eventMapper";

const BASE_URL = "http://localhost:8080/api/events";

export const createEvent = async (form, token) => {
    const request = mapEventRequest(form);

    const response = await axios.post(BASE_URL, request, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });

    return response.data;
};
export const uploadEventImage = async (id, image, token) => {
    const formData = new FormData();
    formData.append("image", image);

    const response = await axios.post(`${BASE_URL}/${id}/image`, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
        }
    });

    return response.data;
};

// services/eventService.js
export const getEvents = async (token = null) => {
    const headers = {};
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }
    return axios.get(BASE_URL, { headers });
};

export const getEventById = async (id, token = null) => {
    const headers = {};
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }
    return axios.get(`${BASE_URL}/${id}`, { headers });
};
export const updateEvent = async (id, form, token) => {
    const request = mapEventRequest(form);

    const response = await axios.put(`${BASE_URL}/${id}`, request, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return response.data;
};

export const deleteEvent = async (id, token) => {
    return axios.delete(`${BASE_URL}/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};
