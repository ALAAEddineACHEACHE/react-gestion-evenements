// src/components/Events/AllEvents.js
"use client";
import React, { useState, useEffect } from 'react';
import EventCard from './EventCard';
import '../styles/events.css';
import {Link} from "react-router-dom";
import useEvents from "../hooks/useEvent";

const AllEvents = () => {
    const [events, setEvents] = useState([]);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const userRole = localStorage.getItem('role');
    const { deleteEventById, getAllEvents } = useEvents(); // Votre hook

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const data = await getAllEvents();
            setEvents(data);
        } catch (err) {
            setError('Failed to load events');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchEvents();
    }, []);


    const handleDelete = async (eventId) => {
        try {
            await deleteEventById(eventId);
            // Mettre à jour la liste
            setEvents(events.filter(event => event.id !== eventId));
        } catch (err) {
            console.error('Failed to delete event:', err);
        }
    };

    const filteredEvents = events.filter((event) => {
        const matchesFilter = filter === 'all' || event.category === filter;
        const matchesSearch = event.title.toLowerCase().includes(search.toLowerCase()) ||
            event.description.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const categories = ['all', ...new Set(events.map(event => event.category).filter(Boolean))];

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading events...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="events-container">
            <div className="events-header">
                <h1>All Events</h1>
                <p>
                    {userRole === 'ROLE_USER' && 'Discover and book amazing events'}
                    {userRole === 'ROLE_ORGANIZER' && 'Manage and organize your events'}
                    {userRole === 'ROLE_ADMIN' && 'View all events in the system'}
                </p>
            </div>

            {/* Créer un événement - seulement pour ORGANIZER */}
            {userRole === 'ROLE_ORGANIZER' && (
                <div className="create-event-banner">
                    <Link to="/create-event" className="create-event-button">
                        <span className="button-icon">➕</span>
                        Create New Event
                    </Link>
                </div>
            )}

            <div className="events-controls">
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search events..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="search-input"
                    />
                    <span className="search-icon">🔍</span>
                </div>

                <div className="filter-container">
                    {categories.map((category) => (
                        <button
                            key={category}
                            className={`filter-btn ${filter === category ? 'active' : ''}`}
                            onClick={() => setFilter(category)}
                        >
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="events-grid">
                {filteredEvents.length > 0 ? (
                    filteredEvents.map((event) => (
                        <EventCard
                            key={event.id}
                            event={event}
                            onDelete={handleDelete}
                        />
                    ))
                ) : (
                    <div className="no-events">
                        <p>No events found. Try adjusting your search or filters.</p>
                    </div>
                )}
            </div>

            {/* Stats - différentes selon le rôle */}
            <div className="events-stats">
                <div className="stat-card">
                    <h3>{events.length}</h3>
                    <p>Total Events</p>
                </div>

                {userRole === 'ROLE_ORGANIZER' && (
                    <div className="stat-card">
                        <h3>
                            {events.filter(e => e.organizerId === parseInt(localStorage.getItem('userId'))).length}
                        </h3>
                        <p>My Events</p>
                    </div>
                )}

                <div className="stat-card">
                    <h3>{categories.length - 1}</h3>
                    <p>Categories</p>
                </div>
            </div>
        </div>
    );
};

export default AllEvents;