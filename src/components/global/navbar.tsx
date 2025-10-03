'use client'

import React, { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import Link from 'next/link'
import { ThemeToggleButton, useThemeTransition } from "./theme-toggle-button"
import ClerkButton from './clerk-button'

const Navbar = () => {
    const { theme, setTheme } = useTheme()
    const { startTransition } = useThemeTransition()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const handleThemeToggle = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark'

        startTransition(() => {
            setTheme(newTheme)
        })
    }

    const currentTheme = (theme === 'system' ? 'light' : theme) as 'light' | 'dark'

    if (!mounted) {
        return null
    }


    return (
        <header className='fixed font-sans right-0 left-0 top-0 py-4 px-10 bg-background/60  dark:bg-black/40 backdrop-blur-lg z-[100] flex items-center border-b-[1px] border-neutral-200 dark:border-neutral-800 justify-between'>
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
                        <li><Link href='#'>Products</Link></li>
                        <li><Link href='#'>Pricing</Link></li>
                        <li><Link href='#'>Clients</Link></li>
                        <li><Link href='#'>Clients</Link></li>
                    </ul>
                </nav>
                <ClerkButton />
                <ThemeToggleButton
                    theme={currentTheme}
                    onClick={handleThemeToggle}
                    variant="circle"
                    start="top-right"
                />
            </aside>
        </header>
    )
}

export default Navbar