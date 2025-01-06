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
        return <p className="text-red-500 text-center mt-4">Access Denied</p>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4 text-center">Admin Page</h1>
            <table className="min-w-full bg-white border border-gray-200 mt-5">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">Title</th>
                        <th className="py-2 px-4 border-b">Description</th>
                        <th className="py-2 px-4 border-b">Location</th>
                        <th className="py-2 px-4 border-b">Organizer</th>
                        <th className="py-2 px-4 border-b">Status</th>
                        <th className="py-2 px-4 border-b">Approve</th>
                    </tr>
                </thead>
                <tbody>
                    {events?.data.filter(event => event.status === 'pending').map(event => (
                        <tr key={event._id} className="hover:bg-gray-100">
                            <td className="py-2 px-4 border-b text-center">{event.title}</td>
                            <td className="py-2 px-4 border-b text-center">{event.description}</td>
                            <td className="py-2 px-4 border-b text-center">{event.location}</td>
                            <td className="py-2 px-4 border-b text-center">{event.organizer.firstName}</td>
                            <td className="py-2 px-4 border-b text-center">{event.status}</td>
                            <td className="py-2 px-4 border-b text-center">
                                {event.status === 'pending' && (
                                    <input
                                        type="checkbox"
                                        className="form-checkbox h-5 w-5 text-green-600"
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