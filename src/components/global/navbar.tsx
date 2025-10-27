'use client'

import Image from 'next/image'
import Link from 'next/link'
import ClerkButton from './clerk-button'

const Navbar = () => {
    return (
        <header className='fixed font-sans right-0 left-0 top-0 py-4 px-10 bg-gradient-to-r from-purple-50 to-white/80 backdrop-blur-lg z-[100] flex items-center border-b-[1px] border-purple-100 justify-between'>
            <aside className='flex gap-2 items-center'>
                <Image
                    src='/logo.png'
                    alt="Logo"
                    width={0}
                    height={32}
                    sizes="100vw"
                    style={{ width: 'auto', height: '36px' }}
                />
                <h1 className='text-2xl font-medium text-[#e13957]'>Radiolo AI</h1>
            </aside>
            <aside className='flex items-center gap-3'>
                <nav className='hidden md:block mx-4'>
                    <ul className='flex items-center gap-8 list-none'>
                        <li>
                            <Link href='#' className='text-gray-700 hover:text-rr-600 transition-colors'>
                                Products
                            </Link>
                        </li>
                        <li>
                            <Link href='#' className='text-gray-700 hover:text-rr-600 transition-colors'>
                                Pricing
                            </Link>
                        </li>
                        <li>
                            <Link href='#' className='text-gray-700 hover:text-rr-600 transition-colors'>
                                Clients
                            </Link>
                        </li>
                        <li>
                            <Link href='#' className='text-gray-700 hover:text-rr-600 transition-colors'>
                                Resources
                            </Link>
                        </li>
                    </ul>
                </nav>
                <ClerkButton />
            </aside>
        </header>
    )
}

export default Navbar
