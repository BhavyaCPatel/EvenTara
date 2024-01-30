import React from 'react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { CgMenuRightAlt } from "react-icons/cg";
import Image from 'next/image';
import { Separator } from "@/components/ui/separator"
import NavItems from './NavItems';

const MobileNav = () => {
    return (
        <nav className="md:hidden">
            <Sheet>
                <SheetTrigger className='align-middle'>
                    <CgMenuRightAlt 
                        width={40}
                        height={40}
                        className='cursor-pointer text-2xl'
                    />
                </SheetTrigger>
                <SheetContent className='flex flex-col gap-6 bg-white/90 md:hidden'>
                    <Image
                        src={"/assets/images/logo.png"}
                        alt='logo'
                        width={128}
                        height={38}
                    />
                    <Separator className='border border-slate-800'/>
                    <NavItems/>
                </SheetContent>
            </Sheet>

        </nav>
    )
}

export default MobileNav