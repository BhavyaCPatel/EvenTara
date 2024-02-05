import { IEvent } from '@/lib/database/models/event.model'
import { FaArrowRight } from "react-icons/fa";
import { formatDateTime } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'

type CardProps = {
    event: IEvent,
    hasOrderLink?: boolean,
    hidePrice?: boolean
}

const Card = ({event, hasOrderLink, hidePrice}: CardProps) => {
    return (
        <div className='group relative flex min-h-[380px] w-full max-w-[400px] flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg md:min-h-[438px]'>
            <Link 
                href={`/events/${event._id}`}
                style={{backgroundImage:`url(${event.imageUrl})`}}
                className='flex-center flex-grow bg-gray-50 bg-cover bg-center text-gray-500'
            />
            {/* IsEventCreator */}
            <Link 
                href={`/events/${event._id}`}
                className='flex min-h-[238px] flex-col gap-3 p-5 md:gap-4'
            >
                {!hidePrice && <div className='flex gap-2'>
                    <span className='p-semibold-14 w-min rounded-full bg-green-100 px-4 py-1 text-green-600'>
                        {event.isFree ? "FREE" : `₹${event.price}`}
                    </span>
                    <p className='p-semibold-14 w-min rounded-full bg-grey-500/10 px-4 py-1 text-grey-500'>
                        {event.category.name}
                    </p>
                </div>}

                <p className='p-medium-16 p-medium-18 text-gray-500'>
                    {formatDateTime(event.startDateTime).dateTime}
                </p>
                <p className='p-medium-16 md:p-medium-20 line-clamp-2 flex-1 text-black'>
                    {event.title}
                </p>
                <div className="flex-between w-full">
                    <p className="p-medium-14 md:p-medium-16 text-gray-600">
                        {event.organizer.firstName} {event.organizer.lastName}
                    </p>
                    {!hasOrderLink && (
                        <Link href={`/orders?eventId=${event._id}`} className='flex gap-2'>
                            <p className="text-primary-500 w-full">Order Details <FaArrowRight className='w-3 h-3' /></p>
                        </Link>
                    )}
                </div>
            </Link>
        </div>
    )
}

export default Card