import { createEvent, uploadEventImage } from "../services/eventService";
import useAuth from "./useAuth";

export default function useEvents() {
    const { token } = useAuth();

    const create = async (form) => {
        return await createEvent(form, token);
    };

    const uploadImage = async (id, image) => {
        return await uploadEventImage(id, image, token);
    };

    return { create, uploadImage };
}
