"use client"

import { useEffect, useState } from 'react'
import { FileText, Upload, AlertTriangle, Database } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

type StatsResponse = {
    totalReports?: number
    recentUploads?: number
    abnormalFindings?: number
    storageUsed?: string
    error?: string
}

export function StatsCards() {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<StatsResponse | null>(null)

    useEffect(() => {
        let mounted = true
        async function getStats() {
            try {
                const res = await fetch('/api/dashboard/stats')
                const json: StatsResponse = await res.json()
                if (mounted) setData(json)
            } catch (e) {
                if (mounted) setData({ error: (e as Error).message })
            } finally {
                if (mounted) setLoading(false)
            }
        }
        getStats()
        return () => {
            mounted = false
        }
    }, [])

    const stats = [
        {
            label: 'Total Reports',
            value: loading ? '—' : String(data?.totalReports ?? '0'),
            icon: FileText,
            color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
        },
        {
            label: 'Recent Uploads',
            value: loading ? '—' : String(data?.recentUploads ?? '0'),
            icon: Upload,
            color: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
        },
        {
            label: 'Abnormal Findings',
            value: loading ? '—' : String(data?.abnormalFindings ?? '0'),
            icon: AlertTriangle,
            color: 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400',
        },
        {
            label: 'Storage Used',
            value: loading ? '—' : String(data?.storageUsed ?? '0 MB'),
            icon: Database,
            color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
        },
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
                <Card key={stat.label}>
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${stat.color}`}>
                            <stat.icon className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{stat.value}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
