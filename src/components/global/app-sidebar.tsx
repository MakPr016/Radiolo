'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    Upload,
    FileText,
    Activity,
    Files,
    Settings,
    User,
    Shield,
    Lock,
    Database,
    LogOut
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { UserButton, useUser } from '@clerk/nextjs'

const sidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: Upload, label: 'Upload', href: '/upload' },
    { icon: FileText, label: 'Report', href: '/radiology' },
    { icon: Activity, label: 'Insights', href: '/insights' },
    { icon: Files, label: 'Content', href: '/content' },
]

const settingsItems = [
    { icon: User, label: 'Profile', href: '/settings/profile' },
    { icon: Shield, label: 'Security', href: '/settings/security' },
    { icon: Lock, label: 'Privacy', href: '/settings/privacy' },
    { icon: Database, label: 'Storage', href: '/settings/storage' },
]

export default function AppSidebar() {
    const pathname = usePathname()
    const { user } = useUser()

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-white dark:bg-gray-900 dark:border-gray-800 flex flex-col">
            <div className="p-6 flex items-center gap-2 border-b dark:border-gray-800">
                <div className="h-8 w-8 bg-black rounded-lg flex items-center justify-center">
                    <Activity className="h-5 w-5 text-white" />
                </div>
                <div>
                    <h1 className="font-bold text-lg leading-none">Radiolo AI</h1>
                    <p className="text-[10px] text-gray-500">AI Medical Report Analyser</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
                <div>
                    <div className="space-y-1">
                        {sidebarItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                    pathname === item.href
                                        ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white"
                                        : "text-gray-500 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800"
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Settings
                    </h3>
                    <div className="space-y-1">
                        {settingsItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                    pathname === item.href
                                        ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white"
                                        : "text-gray-500 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800"
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <div className="p-4 border-t dark:border-gray-800">
                <div className="flex items-center gap-3 px-2">
                    <UserButton afterSignOutUrl="/" />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {user?.fullName || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                            {user?.primaryEmailAddress?.emailAddress}
                        </p>
                    </div>
                </div>
            </div>
        </aside>
    )
}
