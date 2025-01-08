"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { eventFormSchema } from "@/lib/validator"
import * as z from 'zod'
import { eventDefaultValues } from "@/constants"
import Dropdown from "./Dropdown"
import { Textarea } from "@/components/ui/textarea"
import { FileUploader } from "./FileUploader"
import { useState } from "react"
import DatePicker from "react-datepicker";
import { useUploadThing } from '@/lib/uploadthing'
import { IoLocation } from "react-icons/io5";
import { FaCalendar } from "react-icons/fa";
import { AiOutlineLink } from "react-icons/ai";
import { FaIndianRupeeSign } from "react-icons/fa6";
import "react-datepicker/dist/react-datepicker.css";
import { Checkbox } from "../ui/checkbox"
import { useRouter } from "next/navigation"
import { createEvent, updateEvent } from "@/lib/actions/event.actions"
import { IEvent } from "@/lib/database/models/event.model"
import { sendEmail } from '@/lib/actions/sendEmail.actions';

type EventFormProps = {
    userId: string
    type: "Create" | "Update"
    event?: IEvent,
    eventId?: string
}

const EventForm = ({ userId, type, event, eventId }: EventFormProps) => {

    const [showAlert, setShowAlert] = useState(false);
    const [files, setFiles] = useState<File[]>([])
    const initialValues = event && type === 'Update'
        ? {
            ...event,
            startDateTime: new Date(event.startDateTime),
            endDateTime: new Date(event.endDateTime)
        }
        : eventDefaultValues;
    const router = useRouter();

    const { startUpload } = useUploadThing('imageUploader')

    const form = useForm<z.infer<typeof eventFormSchema>>({
        resolver: zodResolver(eventFormSchema),
        defaultValues: initialValues
    })

    async function onSubmit(values: z.infer<typeof eventFormSchema>) {
        let uploadedImageUrl = values.imageUrl;

        if (files.length > 0) {
            const uploadedImages = await startUpload(files);

            if (!uploadedImages) {
                return;
            }

            uploadedImageUrl = uploadedImages[0].url;
        }

        if (type === 'Create') {
            try {
                const newEvent = await createEvent({
                    event: { ...values, imageUrl: uploadedImageUrl, status: 'pending' },
                    userId,
                    path: '/profile',
                });

                if (newEvent) {
                    setShowAlert(true);
                    form.reset();
                    sendEmail({
                        to: 'official.eventara@gmail.com',
                        subject: `New Event: ${newEvent.title}`,
                        text: `A new event has been submitted for review. Please check the portal for more details.`,
                        html: `<p>A new event has been submitted for review. Please check the portal for more details.</p>`,
                    })
                        .then(response => {
                            if (response.success) {
                                console.log('Email sent successfully');
                            } else {
                                console.error('Error sending email:', response.error);
                            }
                        })
                        .catch(error => console.error('Error in sendEmail:', error));
                    setTimeout(() => {
                        setShowAlert(false);
                        router.push(`/profile`);
                    }, 2500);
                }
            } catch (error) {
                console.error(error);
            }
        }

        if (type === 'Update') {
            if (!eventId) {
                router.back();
                return;
            }

            try {
                const updatedEvent = await updateEvent({
                    userId,
                    event: { ...values, imageUrl: uploadedImageUrl, _id: eventId },
                    path: '/profile',
                });

                if (updatedEvent) {
                    form.reset();
                    router.push(`/events/${updatedEvent._id}`);
                }
            } catch (error) {
                console.error(error);
            }
        }
    }

    return (
        <div className="relative">
            {showAlert && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <Alert variant="default">
                            <AlertTitle className="text-center text-2xl">Event Submitted!</AlertTitle>
                            <AlertDescription className="text-center text-md">
                                Your event has been submitted for review. It will be on the portal within the next 24 hours.
                            </AlertDescription>
                        </Alert>
                    </div>
                </div>
            )}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="mx-3 flex flex-col gap-5">
                    <div className="flex flex-col gap-5 md:flex-row">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem className='w-full'>
                                    <FormControl>
                                        <Input placeholder="Event Title" {...field} className='input-field' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem className='w-full'>
                                    <FormControl>
                                        <Dropdown onChangeHandler={field.onChange} value={field.value} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex flex-col gap-5 md:flex-row">
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem className='w-full'>
                                    <FormControl className='h-72'>
                                        <Textarea className='textarea rounded-2xl' placeholder='Description' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="imageUrl"
                            render={({ field }) => (
                                <FormItem className='w-full'>
                                    <FormControl className='h-72'>
                                        <FileUploader onFieldChange={field.onChange} imageUrl={field.value} setFiles={setFiles} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex flex-col gap-5 md:flex-row">
                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem className='w-full'>
                                    <FormControl>
                                        <div className='flex-center h-55 w-full overflow-hidden rounded-full bg-grey-50 px-4 py-1'>
                                            <IoLocation className='filter-grey w-6 h-6' />
                                            <Input placeholder="Event Location / Online" {...field} className='input-field' />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex flex-col gap-5 md:flex-row">
                        <FormField
                            control={form.control}
                            name="startDateTime"
                            render={({ field }) => (
                                <FormItem className='w-full'>
                                    <FormControl>
                                        <div className='flex-center h-55 w-full overflow-hidden rounded-full bg-grey-50 px-4 py-1'>
                                            <FaCalendar className='filter-grey w-5 h-5' />
                                            <p className='ml-3 whitespace-nowrap text-grey-500'>Start Date:</p>
                                            <DatePicker
                                                selected={field.value}
                                                onChange={(date: Date) => field.onChange(date)}
                                                showTimeSelect
                                                timeInputLabel='Time:'
                                                dateFormat='dd/MM/YYYY h:mm aa'
                                                wrapperClassName='datePicker'
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="endDateTime"
                            render={({ field }) => (
                                <FormItem className='w-full'>
                                    <FormControl>
                                        <div className='flex-center h-55 w-full overflow-hidden rounded-full bg-grey-50 px-4 py-1'>
                                            <FaCalendar className='filter-grey w-5 h-5' />
                                            <p className='ml-3 whitespace-nowrap text-grey-500'>End Date:</p>
                                            <DatePicker
                                                selected={field.value}
                                                onChange={(date: Date) => field.onChange(date)}
                                                showTimeSelect
                                                timeInputLabel='Time:'
                                                dateFormat='dd/MM/YYYY h:mm aa'
                                                wrapperClassName='datePicker'
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex flex-col gap-5 md:flex-row">
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem className='w-full'>
                                    <FormControl>
                                        <div className='flex-center h-55 w-full overflow-hidden rounded-full bg-grey-50 px-4 py-1'>
                                            <FaIndianRupeeSign className='filter-grey w-5 h-5' />
                                            <Input type='number' placeholder='Price' {...field} className='p-regular-16 bg-grey-50 h-[54px] border-0 outline-offset-0 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0' />
                                            <FormField
                                                control={form.control}
                                                name="isFree"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <div className='flex items-center'>
                                                                <label htmlFor='isFree' className='whitespace-nowrap pr-3 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>Free Ticket</label>
                                                                <Checkbox
                                                                    onCheckedChange={field.onChange}
                                                                    checked={field.value}
                                                                    id='isFree'
                                                                    className='mr-2 h-5 w-5 border-2 border-black' />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="url"
                            render={({ field }) => (
                                <FormItem className='w-full'>
                                    <FormControl>
                                        <div className='flex-center h-55 w-full overflow-hidden rounded-full bg-grey-50 px-4 py-1'>
                                            <AiOutlineLink className='filter-grey w-6 h-6' />
                                            <Input placeholder="URL" {...field} className='input-field' />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button
                        type="submit"
                        size="lg"
                        disabled={form.formState.isSubmitting}
                        className="button col-span-2 w-full"
                    >
                        {form.formState.isSubmitting ? (
                            'Submitting...'
                        ) : `${type} Event `}</Button>
                </form>
            </Form>
        </div>
    )
}

export default EventForm