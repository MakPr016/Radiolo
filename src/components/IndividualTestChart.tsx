'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle } from 'lucide-react';

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

interface IndividualTestChartProps {
    test: TestResult;
}

export default function IndividualTestChart({ test }: IndividualTestChartProps) {
    if (!test.reference_range) return null;

    const { min, max } = test.reference_range;
    const range = max - min;
    const valuePosition = ((test.value - min) / range) * 100;
    const clampedPosition = Math.max(0, Math.min(100, valuePosition));

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'normal':
                return 'bg-green-500';
            case 'low':
            case 'high':
                return 'bg-orange-500';
            case 'critical_low':
            case 'critical_high':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };

    const getStatusBadgeColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'normal':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'low':
            case 'high':
                return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
            case 'critical_low':
            case 'critical_high':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    return (
        <Card className="overflow-hidden">
            <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <h3 className="font-semibold text-sm">{test.test_name}</h3>
                        <p className="text-xs text-gray-500 mt-1">{test.unit}</p>
                    </div>
                    {test.status === 'normal' ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                        <AlertCircle className={`w-5 h-5 ${test.status.includes('critical') ? 'text-red-600' : 'text-orange-600'
                            }`} />
                    )}
                </div>

                <div className="flex items-end gap-2 mb-4">
                    <span className="text-3xl font-bold">{test.value}</span>
                    <span className="text-sm text-gray-500 pb-1">{test.unit}</span>
                </div>

                <div className="space-y-2">
                    <div className="relative h-12 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                        <div
                            className="absolute inset-y-0 left-0 bg-green-100 dark:bg-green-900/30"
                            style={{ width: '100%' }}
                        />

                        <div
                            className="absolute inset-y-0 bg-gradient-to-r from-green-200 to-green-300 dark:from-green-800 dark:to-green-700"
                            style={{
                                left: '0%',
                                width: '100%',
                                opacity: 0.3
                            }}
                        />

                        <div
                            className={`absolute top-1/2 -translate-y-1/2 w-1 h-full ${getStatusColor(test.status)}`}
                            style={{ left: `${clampedPosition}%` }}
                        />

                        <div
                            className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full ${getStatusColor(test.status)} ring-4 ring-white dark:ring-gray-900`}
                            style={{ left: `${clampedPosition}%` }}
                        />

                        <div className="absolute inset-0 flex items-center justify-between px-3 text-xs font-medium text-gray-600 dark:text-gray-400">
                            <span>Low</span>
                            <span>Normal Range</span>
                            <span>High</span>
                        </div>
                    </div>

                    <div className="flex justify-between text-xs text-gray-500">
                        <span>{min}</span>
                        <span>Your Value: <strong>{test.value}</strong></span>
                        <span>{max}</span>
                    </div>
                </div>

                <Badge className={`mt-4 ${getStatusBadgeColor(test.status)}`}>
                    {test.status.replace('_', ' ').toUpperCase()}
                </Badge>
            </CardContent>
        </Card>
    );
}