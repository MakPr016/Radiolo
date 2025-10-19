'use client';

import Image from 'next/image';

interface TestResult {
    test_name: string;
    value: number;
    unit: string;
    status: string;
}

interface HumanBodyDiagramProps {
    abnormalResults: TestResult[];
}

export default function HumanBodyDiagram({ abnormalResults }: HumanBodyDiagramProps) {
    const getAffectedParts = () => {
        const parts = {
            head: false,
            neck: false,
            chest: false,
            stomach: false,
            knees: false,
        };

        abnormalResults.forEach(result => {
            const name = result.test_name.toLowerCase();
            
            if (name.includes('brain') || name.includes('neurological')) {
                parts.head = true;
            }
            if (name.includes('thyroid') || name.includes('tsh') || name.includes('t3') || name.includes('t4')) {
                parts.neck = true;
            }
            if (name.includes('blood') || name.includes('rbc') || name.includes('hemoglobin') || 
                name.includes('wbc') || name.includes('platelet') || name.includes('hematocrit') ||
                name.includes('cholesterol') || name.includes('triglycerides') || 
                name.includes('hdl') || name.includes('ldl') || name.includes('heart')) {
                parts.chest = true;
            }
            if (name.includes('glucose') || name.includes('liver') || name.includes('kidney') || 
                name.includes('bilirubin') || name.includes('alt') || name.includes('ast') || 
                name.includes('creatinine') || name.includes('urea') || name.includes('albumin') ||
                name.includes('pancrea')) {
                parts.stomach = true;
            }
            if (name.includes('uric') || name.includes('calcium') || name.includes('vitamin d') ||
                name.includes('joint')) {
                parts.knees = true;
            }
        });

        return parts;
    };

    const affected = getAffectedParts();

    return (
        <div className="relative w-full mx-auto">
            {/* Base Human Body SVG */}
            <div className="relative w-full">
                <Image 
                    src="/human.svg" 
                    alt="Human Body Diagram" 
                    width={300} 
                    height={700}
                    className="w-full h-auto"
                    priority
                />
                
                {/* Overlay SVG for highlights */}
                <svg 
                    className="absolute inset-0 w-full h-auto pointer-events-none"
                    viewBox="0 0 300 700"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* Head highlight */}
                    {affected.head && (
                        <>
                            <ellipse 
                                cx="150" 
                                cy="70" 
                                rx="35" 
                                ry="40"
                                fill="#F87171"
                                opacity="0.5"
                            />
                            <text x="200" y="75" fontSize="13" fill="#374151" fontWeight="600">Head</text>
                        </>
                    )}
                    
                    {/* Neck/Shoulder highlight */}
                    {affected.neck && (
                        <>
                            <ellipse 
                                cx="150" 
                                cy="140" 
                                rx="50" 
                                ry="25"
                                fill="#F87171"
                                opacity="0.5"
                            />
                            <text x="210" y="145" fontSize="13" fill="#374151" fontWeight="600">Neck</text>
                        </>
                    )}
                    
                    {/* Chest highlight */}
                    {affected.chest && (
                        <>
                            <ellipse 
                                cx="150" 
                                cy="230" 
                                rx="55" 
                                ry="60"
                                fill="#F87171"
                                opacity="0.5"
                            />
                            <text x="215" y="235" fontSize="13" fill="#374151" fontWeight="600">Chest</text>
                        </>
                    )}
                    
                    {/* Stomach highlight */}
                    {affected.stomach && (
                        <>
                            <ellipse 
                                cx="150" 
                                cy="340" 
                                rx="50" 
                                ry="55"
                                fill="#F87171"
                                opacity="0.5"
                            />
                            <text x="210" y="345" fontSize="13" fill="#374151" fontWeight="600">Stomach</text>
                        </>
                    )}
                    
                    {/* Knees highlight */}
                    {affected.knees && (
                        <>
                            <circle cx="125" cy="540" r="20" fill="#F87171" opacity="0.5"/>
                            <circle cx="175" cy="540" r="20" fill="#F87171" opacity="0.5"/>
                            <text x="210" y="545" fontSize="13" fill="#374151" fontWeight="600">Knees</text>
                        </>
                    )}
                </svg>
            </div>

            {/* Legend */}
            {abnormalResults.length > 0 && (
                <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-xs font-semibold text-red-900 mb-2">Affected Areas</p>
                    <div className="space-y-1">
                        {affected.head && <p className="text-xs text-red-700">• Head/Brain</p>}
                        {affected.neck && <p className="text-xs text-red-700">• Neck/Thyroid</p>}
                        {affected.chest && <p className="text-xs text-red-700">• Chest/Heart/Blood</p>}
                        {affected.stomach && <p className="text-xs text-red-700">• Abdomen/Liver/Kidney</p>}
                        {affected.knees && <p className="text-xs text-red-700">• Knees/Joints</p>}
                    </div>
                </div>
            )}
        </div>
    );
}
