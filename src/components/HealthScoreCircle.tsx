'use client';

interface HealthScoreCircleProps {
    score: number;
}

export default function HealthScoreCircle({ score }: HealthScoreCircleProps) {
    const circumference = 2 * Math.PI * 56;
    const strokeDashoffset = circumference * (1 - score / 100);

    return (
        <div className="flex flex-col items-center justify-center">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Health Score</h3>
            <div className="relative w-40 h-40">
                <svg className="transform -rotate-90 w-40 h-40">
                    <circle
                        cx="80"
                        cy="80"
                        r="56"
                        stroke="#e5e7eb"
                        strokeWidth="12"
                        fill="none"
                    />
                    <circle
                        cx="80"
                        cy="80"
                        r="56"
                        stroke="#3b82f6"
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                        <span className="text-4xl font-bold text-gray-900">{score}</span>
                        <span className="text-lg text-gray-500">%</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
