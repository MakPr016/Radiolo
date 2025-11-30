'use client'

import { useUser } from '@clerk/nextjs'
import { InfoBar } from '@/components/global/infobar'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { RecentReports } from '@/components/dashboard/recent-reports'
import { HealthTrendChart } from '@/components/dashboard/health-trend-chart'

export default function Dashboard() {
    const { user } = useUser()

    return (
        <div className="flex flex-col min-h-screen">
            <InfoBar />
            <div className="flex-1 space-y-8 p-8 pt-6">
                <div className="flex items-center justify-between space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">
                        Welcome back, {user?.firstName || 'User'}
                    </h2>
                </div>

                <StatsCards />

                <RecentReports />

                <div className="grid grid-cols-1 gap-4">
                    <HealthTrendChart />
                </div>
            </div>
        </div>
    )
}