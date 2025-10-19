'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

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

interface TestMiniChartProps {
    test: TestResult;
}

export default function TestMiniChart({ test }: TestMiniChartProps) {
    if (!test.reference_range) return null;

    const data = [
        { name: 'Current', value: test.value, color: '#3b82f6' },
        { name: 'Lowest', value: test.reference_range.min, color: '#10b981' },
        { name: 'Highest', value: test.reference_range.max, color: '#ef4444' }
    ];

    return (
        <div className="space-y-2">
            <div>
                <p className="text-xs font-medium truncate text-gray-900">{test.test_name}</p>
                <p className="text-xs text-gray-500">{test.value} {test.unit}</p>
            </div>
            <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 10 }}
                        axisLine={false}
                    />
                    <YAxis 
                        tick={{ fontSize: 10 }}
                        axisLine={false}
                    />
                    <Tooltip
                        contentStyle={{ fontSize: 11, padding: '4px 8px' }}
                        formatter={(value) => [`${value} ${test.unit}`, '']}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {data.map((entry, index) => (
                            <Cell key={index} fill={entry.color} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
