import Collection from '@/components/shared/Collection'
import { Button } from '@/components/ui/button'
import { getEventsByUser } from '@/lib/actions/event.actions'
import { auth } from '@clerk/nextjs'
import Link from 'next/link'
import React from 'react'

const ProfilePage = async () => {

    const { sessionClaims } = auth();
    const userId = sessionClaims?.userId as string;
    const organizedEvents = await getEventsByUser({userId, page: 1})

    return (
        <>
            <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
                <div className="wrapper flex items-center justify-center sm:justify-between">
                    <h3 className="h3-bold text-center sm:text-left">
                        My Tickets
                    </h3>
                    <Button asChild className='button hidden sm:flex'>
                        <Link href='/#events'>Explore More Events</Link>
                    </Button>
                </div>
            </section>
            {/* <section className="wrapper my-8">
                <div className="pl-2">
                    <Collection
                        data={events?.data}
                        emptyTitle="No Event Tickets Purchased Yet"
                        emptyStateSubtext="No worries, you can always explore more events!"
                        collectionType="My_Tickets"
                        limit={3}
                        page={1}
                        totalPage={2}
                        urlParamName='ordersPage'
                    />
                </div>
            </section> */}

            <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
                <div className="wrapper flex items-center justify-center sm:justify-between">
                    <h3 className="h3-bold text-center sm:text-left">
                        Events Organized
                    </h3>
                    <Button asChild className='button hidden sm:flex'>
                        <Link href='/events/create'>Create New Event</Link>
                    </Button>
                </div>
            </section>
            <section className="wrapper my-8">
                <div className="pl-2">
                    <Collection
                        data={organizedEvents?.data}
                        emptyTitle="No Event have been organized yet"
                        emptyStateSubtext="Start organizing your event now."
                        collectionType="Events_Organized"
                        limit={6}
                        page={1}
                        totalPage={2}
                        urlParamName='eventsPage'
                    />
                </div>
            </section>
        </>
    )
}

export default ProfilePage