import Search from '@/components/shared/Search'
import { getOrdersByEvent } from '@/lib/actions/order.actions'
import { formatDateTime, formatPrice } from '@/lib/utils'
import { SearchParamProps } from '@/types'
import { IOrderItem } from '@/lib/database/models/order.model'

const Orders = async ({ searchParams }: SearchParamProps) => {
    const eventId = (searchParams?.eventId as string) || ''
    const searchText = (searchParams?.query as string) || ''

    const orders = await getOrdersByEvent({ eventId, searchString: searchText })
    return (
        <>
            <section className=" bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
                <h3 className="wrapper h3-bold text-center sm:text-left ">
                    <span className="ml-3">Order</span>
                </h3>
            </section>

            <section className="wrapper mt-8 loc">
                <Search placeholder="Search buyer name..." />
            </section>

            <section className="wrapper tab overflow-x-auto">
                <table className="w-full border-collapse border-t">
                    <thead>
                        <tr className="p-medium-14 border-b text-grey-500">
                            <th className="min-w-[250px] py-3 px-2 text-center">Order ID</th>
                            <th className="min-w-[200px] flex-1 py-3 px-2 text-center">Event Title</th>
                            <th className="min-w-[150px] py-3 px-2 text-center">Buyer</th>
                            <th className="min-w-[100px] py-3 px-2 text-center">Created</th>
                            <th className="min-w-[100px] py-3 px-2 text-center">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders && orders.length === 0 ? (
                            <tr className="border-b">
                                <td colSpan={5} className="py-4 text-center text-gray-500">
                                    No orders found.
                                </td>
                            </tr>
                        ) : (
                            <>
                                {orders &&
                                    orders.map((row: IOrderItem) => (
                                        <tr
                                            key={row._id}
                                            className="p-regular-14 lg:p-regular-16 border-b"
                                            style={{ boxSizing: 'border-box' }}>
                                            <td className="min-w-[250px] text-center py-4 px-2 text-primary-500">{row._id}</td>
                                            <td className="min-w-[200px] text-center flex-1 py-4 pr-4">{row.eventTitle}</td>
                                            <td className="min-w-[200px] text-center py-4 px-2">{row.buyer} <br /> 
                                                <span className='text-primary-500 font-light'>{row.email}</span> 
                                            </td>
                                            <td className="min-w-[100px] text-center py-4 px-2">
                                                {formatDateTime(row.createdAt).dateTime}
                                            </td>
                                            <td className="min-w-[100px] text-center py-4 px-2">
                                                {formatPrice(row.totalAmount)}
                                            </td>
                                        </tr>
                                    ))}
                            </>
                        )}
                    </tbody>
                </table>
            </section>
        </>
    )
}

export default Orders