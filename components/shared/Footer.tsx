import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Footer = () => {
    return (
        <footer className="border-t">
            <div className='flex flex-center flex-between flex-col gap-4 p-5 text-center wrapper sm:flex-row'>
                <Link href='/'>
                    <Image
                        src={'/assets/images/logo.png'}
                        alt='logo'
                        width={140}
                        height={38}
                    ></Image>
                </Link>
                <p className='text-slate-600'>2023 EvenTara. All Rights Reserved.</p>
            </div>
        </footer>
    )
}

export default Footer