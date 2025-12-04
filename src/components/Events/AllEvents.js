// src/components/Events/AllEvents.js
import React, { useState, useEffect } from 'react';
import EventCard from './EventCard';
import '../styles/events.css';

const AllEvents = () => {
    const [events, setEvents] = useState([]);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');

    // Sample events data
    const sampleEvents = [
        {
            id: 1,
            title: 'Tech Conference 2024',
            description: 'Annual technology conference featuring the latest innovations',
            date: '2024-06-15',
            time: '09:00',
            location: 'Convention Center',
            category: 'Conference',
            attendees: 250,
            image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
        },
        {
            id: 2,
            title: 'Music Festival',
            description: 'Three-day outdoor music festival',
            date: '2024-07-20',
            time: '14:00',
            location: 'Central Park',
            category: 'Music',
            attendees: 5000,
            image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w-400',
        },
        {
            id: 3,
            title: 'Business Workshop',
            description: 'Learn effective business strategies',
            date: '2024-05-10',
            time: '10:00',
            location: 'Business Center',
            category: 'Workshop',
            attendees: 50,
            image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400',
        },
        {
            id: 4,
            title: 'Art Exhibition',
            description: 'Contemporary art exhibition',
            date: '2024-08-05',
            time: '11:00',
            location: 'Art Gallery',
            category: 'Art',
            attendees: 200,
            image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400',
        },
    ];

    useEffect(() => {
        // Simulate API call
        setEvents(sampleEvents);
    }, []);

    const filteredEvents = events.filter((event) => {
        const matchesFilter = filter === 'all' || event.category === filter;
        const matchesSearch = event.title.toLowerCase().includes(search.toLowerCase()) ||
            event.description.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const categories = ['all', 'Conference', 'Music', 'Workshop', 'Art', 'Sports', 'Other'];

    return (
        <div className="events-container">
            <div className="events-header">
                <h1>All Events</h1>
                <p>Discover and manage your events</p>
            </div>

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
                        <EventCard key={event.id} event={event} />
                    ))
                ) : (
                    <div className="no-events">
                        <p>No events found. Try adjusting your search or filters.</p>
                    </div>
                )}
            </div>

            <div className="events-stats">
                <div className="stat-card">
                    <h3>{events.length}</h3>
                    <p>Total Events</p>
                </div>
                <div className="stat-card">
                    <h3>{events.reduce((sum, event) => sum + event.attendees, 0)}</h3>
                    <p>Total Attendees</p>
                </div>
                <div className="stat-card">
                    <h3>{new Set(events.map(event => event.category)).size}</h3>
                    <p>Categories</p>
                </div>
            </div>
        </div>
    );
};

export default AllEvents;