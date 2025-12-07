    import {
    createEvent,
    deleteEvent,
    getEventById,
    getEvents, IMAGE_BASE_URL,
    updateEvent,
    uploadEventImage
} from "../services/eventService";
    import useAuth from "./useAuth";
    import axios from "axios";

    export default function useEvents() {
        const { token } = useAuth();

        const create = async (form) => {
            return await createEvent(form, token);
        };


        const uploadImage = async (id, imageFile) => {
            // Créer FormData correctement
            const formData = new FormData();
            formData.append("image", imageFile);

            // Utiliser la fonction existante du service
            return await uploadEventImage(id, formData, token);
        };

        const getAllEvents = async () => {
            const res = await getEvents(token);
            return res.data; // IMPORTANT
        };


        const getEvent = async (id) => {
            return await getEventById(id, token);
        };

        const update = async (id, form) => {
            return await updateEvent(id, form, token);
        };

        const deleteEventById = async (id) => {
            return await deleteEvent(id, token);
        };

        return {
            create,
            uploadImage,
            getAllEvents,
            getEvent,
            update,
            deleteEventById
        };

    }
