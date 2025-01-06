"use client"

import { useEffect, useState } from 'react';
import { getAllEvents, updateEventStatusByAdmin } from '@/lib/actions/event.actions';
import { useRouter } from 'next/navigation';

const AdminPage = () => {
    const [events, setEvents] = useState<{ data: any[]; totalPages: number } | undefined>(undefined);
    const router = useRouter();

    useEffect(() => {
        const fetchEvents = async () => {
            const events = await getAllEvents({ query: '', limit: 6, page: 1, category: '' });
            if (events) {
                setEvents(events);
            }
        };

        fetchEvents();
    }, []);

    const handleApprove = async (eventId: string) => {
        await updateEventStatusByAdmin(eventId, 'approved');
        if (events) {
            setEvents({
                ...events,
                data: events.data.map(event => event._id === eventId ? { ...event, status: 'approved' } : event)
            });
        }
    };

    const user = { email: 'bhavyaaes@gmail.com' }; // Replace with actual user authentication logic

    if (user.email !== 'bhavyaaes@gmail.com') {
        return <p>Access Denied</p>;
    }

    return (
        <div>
            <h1>Admin Page</h1>
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Approve</th>
                    </tr>
                </thead>
                <tbody>
                    {events?.data.filter(event => event.status === 'pending').map(event => (
                        <tr key={event._id}>
                            <td>{event.title}</td>
                            <td>{event.description}</td>
                            <td>{event.status}</td>
                            <td>
                                {event.status === 'pending' && (
                                    <input
                                        type="checkbox"
                                        onChange={() => handleApprove(event._id)}
                                    />
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminPage;