'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
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

interface TestResultChartProps {
    tests: TestResult[];
}

export default function TestResultChart({ tests }: TestResultChartProps) {
    const chartData = tests
        .filter(test => test.reference_range)
        .map(test => ({
            name: test.test_name.length > 20
                ? test.test_name.substring(0, 20) + '...'
                : test.test_name,
            fullName: test.test_name,
            value: test.value,
            min: test.reference_range!.min,
            max: test.reference_range!.max,
            unit: test.unit,
            status: test.status,
            normal: test.reference_range!.max - test.reference_range!.min
        }));

    const getBarColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'normal':
                return '#10b981';
            case 'low':
            case 'high':
                return '#f59e0b';
            case 'critical_low':
            case 'critical_high':
                return '#ef4444';
            default:
                return '#6b7280';
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Lab Results Visualization</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="name"
                            angle={-45}
                            textAnchor="end"
                            height={100}
                            interval={0}
                        />
                        <YAxis />
                        <Tooltip
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    const data = payload[0].payload;
                                    return (
                                        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                                            <p className="font-semibold">{data.fullName}</p>
                                            <p className="text-sm text-blue-600">Your Value: {data.value} {data.unit}</p>
                                            <p className="text-sm text-gray-600">Normal Range: {data.min} - {data.max} {data.unit}</p>
                                            <p className={`text-sm font-semibold ${data.status === 'normal' ? 'text-green-600' :
                                                    data.status.includes('critical') ? 'text-red-600' : 'text-orange-600'
                                                }`}>
                                                Status: {data.status.replace('_', ' ').toUpperCase()}
                                            </p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Legend />
                        <Bar dataKey="value" name="Your Value" radius={[8, 8, 0, 0]}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={getBarColor(entry.status)} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
