// src/components/Events/AllEvents.js
"use client";
import React, { useState, useEffect } from 'react';
import EventCard from './EventCard';
import '../styles/events.css';
import { Link } from "react-router-dom";
import useEvents from "../hooks/useEvent";

const AllEvents = () => {
    const [events, setEvents] = useState([]);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const userRole = localStorage.getItem('role');
    const { deleteEventById, getAllEvents } = useEvents();
    const [showConfirm, setShowConfirm] = useState(false);
    const [eventToDelete, setEventToDelete] = useState(null);

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
            {/* En-tête avec le bouton Create Event aligné à droite comme dans la photo */}
            <div className="events-page-header">
                <div className="header-content">
                    <div className="header-text">
                        <h1>All Events</h1>
                        <p className="subtitle">
                            {userRole === 'ROLE_USER' && 'Discover and book amazing events'}
                            {userRole === 'ROLE_ORGANIZER' && 'Manage and organize your events'}
                            {userRole === 'ROLE_ADMIN' && 'View all events in the system'}
                        </p>
                    </div>

                    {/* Bouton Create Event aligné à droite */}
                    {userRole === 'ROLE_ORGANIZER' && (
                        <Link to="/create-event" className="create-event-btn-main">
                            <span className="btn-icon">+</span>
                            Create New Event
                        </Link>
                    )}
                </div>
            </div>

            {/* Contrôles de recherche et filtres */}
            <div className="events-toolbar">
                <div className="search-section">
                    <div className="search-wrapper">
                        <span className="search-icon"></span>
                        {/*🔍*/}
                        <input
                            type="text"
                            placeholder="Search events..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="search-input-large"
                        />
                    </div>

                    <div className="category-filters">
                        {categories.map((category) => (
                            <button
                                key={category}
                                className={`category-filter-btn ${filter === category ? 'active' : ''}`}
                                onClick={() => setFilter(category)}
                            >
                                {category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Grille d'événements */}
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
                    <div className="no-events-message">
                        <div className="no-events-icon">📅</div>
                        <h3>No events found</h3>
                        <p>Try adjusting your search or filters</p>
                        {userRole === 'ROLE_ORGANIZER' && (
                            <Link to="/create-event" className="create-first-event-btn">
                                Create your first event
                            </Link>
                        )}
                    </div>
                )}
            </div>

            {/* Statistiques */}
            <div className="events-stats">
                <div className="stat-card">
                    <div className="stat-icon">📊</div>
                    <div className="stat-content">
                        <h3>{events.length}</h3>
                        <p>Total Events</p>
                    </div>
                </div>

                {userRole === 'ROLE_ORGANIZER' && (
                    <div className="stat-card">
                        <div className="stat-icon">
                            <img src="Gevenemnts.jpg" alt="MR-Events Logo"
                                 className="logo"/>
                        </div>
                        <div className="stat-content">
                            <h3>
                            {events.filter(e => e.organizerId === parseInt(localStorage.getItem('organizerId'))).length}
                            </h3>
                            <p>My Events</p>
                        </div>
                    </div>
                )}

                <div className="stat-card">
                    <div className="stat-icon">🏷️</div>
                    <div className="stat-content">
                        <h3>{categories.length - 1}</h3>
                        <p>Categories</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllEvents;