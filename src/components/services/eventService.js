import axios from "axios";
import {mapEventRequest} from "../../mappers/eventMapper";

const BASE_URL = "http://localhost:8080/api/events";
export const IMAGE_BASE_URL = "http://localhost:8080/api/events/uploads";

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
export const uploadEventImage = async (id, formData, token) => {
    // Note: formData est déjà un FormData, on ne le crée pas ici
    const response = await axios.post(`${BASE_URL}/${id}/image`, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            // NE PAS mettre "Content-Type": "multipart/form-data" explicitement
            // Laisser axios le faire automatiquement
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
// export const getEvents = async (token, page = 0, size = 6) => {
//     try {
//         const response = await axios.get(`${BASE_URL}/events`, {
//             headers: {
//                 'Authorization': `Bearer ${token}`
//             },
//             params: {
//                 page: page,
//                 size: size,
//                 sort: 'startAt,desc' // Tri par date décroissante
//             }
//         });
//         return response;
//     } catch (error) {
//         throw error;
//     }
// };



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
