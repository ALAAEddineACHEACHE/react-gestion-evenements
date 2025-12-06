import { createEvent } from "../services/eventService";
import useAuth from "./useAuth";

export default function useEvents() {
    const { token } = useAuth();

    const create = async (form) => {
        return await createEvent(form, token);
    };

    return { create };
}
