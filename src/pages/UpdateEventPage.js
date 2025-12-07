// src/pages/UpdateEventPage.js
import React from 'react';
import { useParams } from 'react-router-dom';
import UpdateEvent from '../components/Events/UpdateEvent';

const UpdateEventPage = () => {
    const { id } = useParams(); // Récupère l'ID de l'événement depuis l'URL

    return (
        <div className="page-container">
            <UpdateEvent eventId={id} />
        </div>
    );
};

export default UpdateEventPage;