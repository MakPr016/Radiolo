'use client';

import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TestResult {
    test_name: string;
    value: number;
    unit: string;
    reference_range: {
        min: number;
        max: number;
        unit: string;
    } | null;
    status: string;
}

interface TestComparisonChartProps {
    tests: TestResult[];
}

export default function TestComparisonChart({ tests }: TestComparisonChartProps) {
    const chartData = tests
        .filter(test => test.reference_range)
        .slice(0, 8)
        .map(test => ({
            name: test.test_name.split(' ').slice(0, 2).join(' '),
            fullName: test.test_name,
            value: test.value,
            minRange: test.reference_range!.min,
            maxRange: test.reference_range!.max,
            midRange: (test.reference_range!.min + test.reference_range!.max) / 2,
            unit: test.unit,
            status: test.status
        }));

    return (
        <Card>
            <CardHeader>
                <CardTitle>Your Values vs Normal Range</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                    <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="name"
                            angle={-45}
                            textAnchor="end"
                            height={80}
                            interval={0}
                        />
                        <YAxis />
                        <Tooltip
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    const data = payload[0].payload;
                                    return (
                                        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                                            <p className="font-semibold mb-2">{data.fullName}</p>
                                            <p className="text-sm text-blue-600">Your Value: {data.value} {data.unit}</p>
                                            <p className="text-sm text-green-600">Min: {data.minRange} {data.unit}</p>
                                            <p className="text-sm text-green-600">Max: {data.maxRange} {data.unit}</p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Legend />
                        <Bar dataKey="minRange" fill="#10b981" fillOpacity={0.3} name="Min Normal" />
                        <Bar dataKey="maxRange" fill="#10b981" fillOpacity={0.3} name="Max Normal" />
                        <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} name="Your Value" dot={{ r: 6 }} />
                    </ComposedChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}