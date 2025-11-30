'use client'

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const data = [
    { name: 'JAN', total: 10, abnormal: 5 },
    { name: 'FEB', total: 25, abnormal: 8 },
    { name: 'MAR', total: 35, abnormal: 12 },
    { name: 'APR', total: 45, abnormal: 15 },
    { name: 'MAY', total: 55, abnormal: 18 },
    { name: 'JUN', total: 58, abnormal: 19 },
    { name: 'JUL', total: 70, abnormal: 22 },
    { name: 'AUG', total: 75, abnormal: 21 },
    { name: 'SEP', total: 80, abnormal: 21 },
    { name: 'OCT', total: 95, abnormal: 25 },
    { name: 'NOV', total: 110, abnormal: 30 },
    { name: 'DEC', total: 127, abnormal: 35 },
]

export function HealthTrendChart() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Health Matrix Trend</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="#E5E7EB" />
                            <XAxis
                                dataKey="name"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${value}`}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'white',
                                    borderRadius: '8px',
                                    border: '1px solid #E5E7EB',
                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="total"
                                stroke="#8884d8"
                                strokeWidth={2}
                                dot={{ r: 3, fill: "#8884d8" }}
                                activeDot={{ r: 5 }}
                                name="Total"
                            />
                            <Line
                                type="monotone"
                                dataKey="abnormal"
                                stroke="#ff8080"
                                strokeWidth={2}
                                dot={{ r: 3, fill: "#ff8080" }}
                                activeDot={{ r: 5 }}
                                name="Abnormal"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-center gap-6 mt-4 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#8884d8]" />
                        <span className="text-gray-600 dark:text-gray-400">Total</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#ff8080]" />
                        <span className="text-gray-600 dark:text-gray-400">Abnormal</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
