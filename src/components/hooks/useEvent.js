import {
    createEvent,
    deleteEvent,
    getEventById,
    getEvents, IMAGE_BASE_URL,
    updateEvent,
    uploadEventImage} from "../services/eventService";
import useAuth from "./useAuth";
export default function useEvents() {
    const { token } = useAuth();

    const create = async (form) => {
        return await createEvent(form, token);
    };


    const uploadImage = async (id, imageFile) => {
        // Créer FormData correctement
        console.log("=== UPLOAD IMAGE DEBUG ===");
        console.log("Event ID:", id);
        console.log("Image file:", imageFile);
        console.log("Is File?", imageFile instanceof File);
        console.log("File name:", imageFile?.name);
        console.log("File size:", imageFile?.size);
        console.log("File type:", imageFile?.type);
        const formData = new FormData();
        formData.append("image", imageFile);

        // Vérifiez le FormData
        console.log("FormData entries:");
        for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }

        try {
            // Utiliser la fonction existante du service
            const result = await uploadEventImage(id, formData, token);
            console.log("Upload successful:", result);
            return result;
        } catch (error) {
            console.error("Upload failed with details:");
            console.error("Error message:", error.message);
            console.error("Error response:", error.response?.data);
            console.error("Error status:", error.response?.status);
            throw error;
        }
    };
    const getAllEvents = async () => {
        const res = await getEvents(token);
        console.log("Events response:", res.data); // Voir la structure
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

