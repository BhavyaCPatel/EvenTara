import CheckoutBtn from '@/components/shared/CheckoutBtn';
import Collection from '@/components/shared/Collection';
import { Button } from '@/components/ui/button';
import { getAllEvents, getEventById, getRelatedEventsByCategory } from '@/lib/actions/event.actions'
import { formatDateTime } from '@/lib/utils';
import { SearchParamProps } from '@/types'
import Image from 'next/image';
import React from 'react'
import { FaCalendar } from 'react-icons/fa';
import { IoLocation } from 'react-icons/io5';
import { auth } from '@clerk/nextjs';

const EventDetails = async ({ params: { id }, searchParams }: SearchParamProps) => {
    const event = await getEventById(id);
    const relatedEvents = await getRelatedEventsByCategory({
        categoryId: event.category._id,
        eventId: event._id,
        page: searchParams.page as string,
    })
    const { sessionClaims } = auth();
    const userId = sessionClaims?.userId as string;
    const isEventCreator = userId === event.organizer._id.toString();

    return (
        <>
            <section className="flex justify-center bg-primary-50 bg-dotted-pattern bg-contain">
                <div className="grid grid-cols-1 md:grid-cols-2 2xl:max-w-7xl">
                    <div className="relative w-full h-64 md:h-auto">
                        <Image
                            src={event.imageUrl}
                            alt={event.title}
                            layout="fill"
                            objectFit="cover"
                            objectPosition="center"
                            className=""
                        />
                    </div>

                    <div className="flex w-full flex-col gap-8 p-5 md:p-10">
                        <div className="flex flex-col gap-6">
                            <h2 className='h2-bold'>{event.title}</h2>
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                <div className="flex gap-3">
                                    <p className='p-bold-20 rounded-full bg-green-500/10 px-5 py-6 text-green-700'>
                                        {event.isFree ? 'FREE' : `₹${event.price}`}
                                    </p>
                                    <p className='p-medium-16 rounded-full bg-grey-500/10 px-4 py-6 text-grey-500'>
                                        {event.category.name}
                                    </p>
                                    <p className="p-medium-18 ml-2 mt-3 sm:mt-5">
                                        <span className='text-gray-500'>by:{' '}</span>
                                        <span className='text-black'>{event.organizer.firstName} {event.organizer.lastName}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        {!isEventCreator && (<CheckoutBtn event={event} />)}
                        <div className="flex flex-col gap-5">
                            <div className="flex gap-2 md:gap-3">
                                <FaCalendar className='text-zinc-400 w-7 h-7 mt-[8px]' />
                                <div className='p-medium-16 lg:p-regular-20 flex-wrap items-center'>
                                    <p>
                                        {formatDateTime(event.startDateTime).dateOnly} - {' '}
                                        {formatDateTime(event.startDateTime).timeOnly}
                                    </p>
                                    <p>
                                        {formatDateTime(event.endDateTime).dateOnly} - {' '}
                                        {formatDateTime(event.endDateTime).timeOnly}
                                    </p>
                                </div>
                            </div>
                            <div className='p-regular-20 flex items-center gap-1'>
                                <IoLocation className='text-zinc-400 w-7 h-7 mt-[8px]' />
                                <p className='p-medium-16 md:p-regular-20 pt-1.5'>{event.location}</p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <p className="p-bold-20 text-grey-600">What will you learn?</p>
                            <p className="p-medium-16 lg:p-regular-18">{event.description}</p>
                            <p className="p-medium-16 lg:p-regular-18 truncate  text-primary-500 underline">{event.url}</p>
                        </div>
                    </div>
                </div>
            </section>
            <section className="wrapper my-8 flex flex-col gap-8 md:gap-12">
                <h2 className="h2-bold">Related Events</h2>
                <div className="pl-2">
                    <Collection
                        data={relatedEvents?.data}
                        emptyTitle="No Related Events Found"
                        emptyStateSubtext="Come Back Later"
                        collectionType="All_Events"
                        limit={3}
                        page={searchParams.page as string}
                        totalPages={relatedEvents?.totalPages}
                    />
                </div>
            </section>
        </>
    )
}

export default EventDetails