import { useMemo } from 'react';
import {
    createEvent,
    deleteEvent,
    getEventById,
    getEvents,
    updateEvent,
    uploadEventImage
} from "../services/eventService";
import useAuth from "./useAuth";

export default function useEvents() {
    const { token } = useAuth();

    // Utiliser useMemo pour mémoriser toutes les fonctions
    const eventsApi = useMemo(() => ({
        create: async (form) => {
            return await createEvent(form, token);
        },

        uploadImage: async (id, imageFile) => {
            const formData = new FormData();
            formData.append("image", imageFile);

            try {
                const result = await uploadEventImage(id, formData, token);
                console.log("Upload successful:", result);
                return result;
            } catch (error) {
                console.error("Upload failed:", error);
                throw error;
            }
        },

        getAllEvents: async () => {
            const res = await getEvents(token);
            console.log("Events response:", res.data);
            return res.data;
        },

        getEvent: async (id) => {
            return await getEventById(id, token);
        },

        update: async (id, form) => {
            return await updateEvent(id, form, token);
        },

        deleteEventById: async (id) => {
            return await deleteEvent(id, token);
        }
    }), [token]); // Dépendance seulement sur token

    return eventsApi;
}