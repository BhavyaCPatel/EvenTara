"use client"
import React from 'react'
import {headerLinks} from '@/constants'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Separator } from "@/components/ui/separator"
const NavItems = () => {
    const pathname = usePathname();
    return (
        <ul className="md:flex-between flex w-full flex-col items-start gap-5 md:flex-row">
            {headerLinks.map((link) => {
                const isActive = pathname === link.route;

                return (
                    <li 
                        key={link.route}
                        className={`flex-center p-medium-16 whitespace-nowrap ${isActive ? 'text-white bg-black rounded-full py-1 px-3 md:text-inherit md:bg-inherit md:rounded-none' : ''}`}>
                        <Link href={link.route} className='flex flex-col items-center'>
                            {link.label}
                            {isActive && <Separator className='border border-black w-6 '/>}
                        </Link>
                    </li>
                )
            })}
        </ul>
    )
}

export default NavItems