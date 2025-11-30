'use client'

import { Search, PanelLeft } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function InfoBar() {
    return (
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white dark:bg-gray-900 px-6 shadow-sm">
            <Button variant="ghost" size="icon" className="md:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Sidebar</span>
            </Button>
            <div className="flex-1" />
            <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Input
                    type="search"
                    placeholder="Search"
                    className="w-full bg-white dark:bg-gray-950 pl-9 md:w-[300px] lg:w-[300px]"
                />
            </div>
        </header>
    )
}
