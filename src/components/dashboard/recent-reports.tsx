import { Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

const reports = [
    {
        id: 1,
        type: 'X-Ray Chest',
        patient: 'John Doe',
        date: 'Oct 14, 2025',
        color: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
        id: 2,
        type: 'X-Ray Chest',
        patient: 'John Doe',
        date: 'Oct 14, 2025',
        color: 'bg-green-100 dark:bg-green-900/20',
    },
    {
        id: 3,
        type: 'X-Ray Chest',
        patient: 'John Doe',
        date: 'Oct 14, 2025',
        color: 'bg-purple-100 dark:bg-purple-900/20',
    },
    {
        id: 4,
        type: 'X-Ray Chest',
        patient: 'John Doe',
        date: 'Oct 14, 2025',
        color: 'bg-red-100 dark:bg-red-900/20',
    },
    {
        id: 5,
        type: 'X-Ray Chest',
        patient: 'John Doe',
        date: 'Oct 14, 2025',
        color: 'bg-orange-100 dark:bg-orange-900/20',
    },
]

export function RecentReports() {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Recent Reports</h2>
                <Button variant="ghost" className="text-sm text-gray-500 hover:text-gray-900">
                    View All
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {reports.map((report) => (
                    <Card key={report.id} className="overflow-hidden">
                        <CardContent className="p-4 space-y-4">
                            <div className={`aspect-video rounded-lg ${report.color} flex items-center justify-center`}>
                                <span className="font-medium text-gray-900 dark:text-white">{report.type}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <Badge variant="secondary" className="text-xs">X-Ray</Badge>
                                <span className="text-xs text-gray-500">{report.date}</span>
                            </div>
                            <div>
                                <p className="font-medium">{report.patient}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" className="flex-1 h-9">
                                    View
                                </Button>
                                <Button variant="outline" size="icon" className="h-9 w-9">
                                    <Share2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
