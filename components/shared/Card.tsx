import { IEvent } from '@/lib/database/models/event.model';
import { MdOutlineArrowOutward } from 'react-icons/md';
import { FiEdit } from 'react-icons/fi';
import { formatDateTime } from '@/lib/utils';
import Link from 'next/link';
import React from 'react';
import { auth } from '@clerk/nextjs';
import { DeleteConfirmation } from './DeleteConfirmation';

type CardProps = {
    event: IEvent;
    hasOrderLink?: boolean;
    hidePrice?: boolean;
};

const Card = ({ event, hasOrderLink, hidePrice }: CardProps) => {
    const { sessionClaims } = auth();
    const userId = sessionClaims?.userId as string;

    // Handle cases where `event.organizer` is null or undefined
    const isEventCreator = userId === event.organizer?._id?.toString();

    return (
        <div className='group relative flex min-h-[380px] w-full max-w-[400px] flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg md:min-h-[438px]'>
            <Link
                href={`/events/${event._id}`}
                style={{ backgroundImage: `url(${event.imageUrl})` }}
                className='flex-center flex-grow bg-gray-50 bg-cover bg-center text-gray-500'
            />
            {/* Conditional rendering for event creator actions */}
            {isEventCreator && !hidePrice && (
                <div className='absolute text-center right-2 top-2 flex flex-col gap-4 rounded-xl bg-white/80 p-3 shadow-sm transition-all'>
                    <Link href={`/events/${event._id}/update`}>
                        <FiEdit className='filter-grey w-4 h-4 ml-0.5' />
                    </Link>
                    <DeleteConfirmation eventId={event._id} />
                </div>
            )}
            <div className='flex min-h-[238px] flex-col gap-3 p-5 md:gap-4'>
                {!hidePrice && (
                    <div className='flex gap-2'>
                        <span className='p-semibold-14 w-min rounded-full bg-green-100 px-4 py-1 text-green-600'>
                            {event.isFree ? 'FREE' : `₹${event.price}`}
                        </span>
                        <p className='p-semibold-14 w-fit rounded-full bg-grey-500/10 px-4 py-1 text-grey-500'>
                            {event.category.name}
                        </p>
                    </div>
                )}
                <p className='p-medium-16 p-medium-18 text-gray-500'>
                    {formatDateTime(event.startDateTime).dateTime}
                </p>
                <Link href={`/events/${event._id}`}>
                    <p className='p-medium-16 md:p-medium-20 line-clamp-2 flex-1 text-black'>
                        {event.title}
                    </p>
                </Link>
                <div className='flex-between align-bottom w-full'>
                    {event.organizer ? (
                        <p className='p-medium-14 md:p-medium-16 text-gray-600'>
                            {event.organizer.firstName} {event.organizer.lastName}
                        </p>
                    ) : (
                        <p className='p-medium-14 md:p-medium-16 text-gray-600'>Unknown Organizer</p>
                    )}
                    {hasOrderLink && (
                        <Link href={`/orders?eventId=${event._id}`} className='flex gap-1'>
                            <p className='text-primary-500'>Order Details</p>
                            <MdOutlineArrowOutward className='text-gray-500 mt-[5px]' />
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Card;
