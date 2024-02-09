'use client'

import { useTransition } from 'react'
import { usePathname } from 'next/navigation'
import { AiOutlineDelete } from "react-icons/ai";


import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

import { deleteEvent } from '@/lib/actions/event.actions'

export const DeleteConfirmation = ({ eventId }: { eventId: string }) => {
    const pathname = usePathname()
    let [isPending, startTransition] = useTransition()

    return (
        <AlertDialog>
            <AlertDialogTrigger>
                <AiOutlineDelete className='text-red-500 h-5 w-5'/>
            </AlertDialogTrigger>

            <AlertDialogContent className="bg-white">
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to delete?</AlertDialogTitle>
                    <AlertDialogDescription className="p-regular-16 text-grey-600">
                        This will permanently delete this event
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>

                    <AlertDialogAction
                        onClick={() =>
                            startTransition(async () => {
                                await deleteEvent({ eventId, path: pathname })
                            })
                        }>
                        {isPending ? 'Deleting...' : 'Delete'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}