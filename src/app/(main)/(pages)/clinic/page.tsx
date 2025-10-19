'use client';

import { useState } from 'react';
import { encrypt, decrypt, compress, fileToBase64, arrayBufferToBase64 } from '@/lib/cryptoPipeline2';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Upload,
    AlertCircle,
    CheckCircle,
    Loader2,
    Download,
} from 'lucide-react';
import TestMiniChart from '@/components/TestMiniChart';
import HumanBodyDiagram from '@/components/HumanBodyDiagram';
import HealthScoreCircle from '@/components/HealthScoreCircle';

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
    deviation_percentage: number;
    clinical_significance: string;
    trend: string | null;
    source: string;
}

interface AnalysisResult {
    status: string;
    processing_time: number;
    filename: string;
    input_type: string;
    ocr_used: boolean;
    ocr_engine: string;
    raw_text: string;
    text_length: number;
    report_id: string;
    report_type: string;
    processing_time_ms: number;
    classification: {
        test_category: string;
        sub_category: string;
        urgency_level: string;
        confidence: number;
    };
    extraction_stats: {
        tests_with_values: number;
        additional_tests_found: number;
        diseases_detected: number;
        interpretations_found: number;
        ner_model_stats: Record<string, number>;
    };
    test_results: TestResult[];
    abnormal_results: Array<{
        test_name: string;
        severity: string;
        requires_attention: boolean;
    }>;
    ai_summary: {
        overall_assessment: string;
        key_abnormalities: string[];
        normal_parameters: string[];
        recommendations: string[];
    };
    clinical_insights: {
        embedding_dimension: number;
        clinical_context_captured: boolean;
        embeddings_generated: boolean;
        diseases_detected: string[];
        status_flags: string[];
        abnormality_patterns: string[];
        clinical_relevance_score: number;
    };
    patient_friendly_summary: {
        overall_status: string;
        explanation: string;
        key_findings: Array<{
            finding: string;
            explanation: string;
        }>;
        areas_of_concern: Array<{
            finding: string;
            explanation: string;
            severity: string;
        }>;
        next_steps: string[];
        summary_stats: {
            total_tests: number;
            normal_tests: number;
            abnormal_tests: number;
            critical_findings: number;
        };
    };
    test_panels: Array<{
        panel_name: string;
        tests_included: string[];
        panel_status: string;
        abnormal_count: number;
        total_tests: number;
    }>;
    visualization_data: {
        charts: Array<{
            chart_type: string;
            title: string;
            data: Array<{
                test: string;
                value: number;
                ref_min: number;
                ref_max: number;
            }>;
        }>;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        trend_data: any[];
    };
    metadata: {
        model_version: string;
        processing_date: string;
        tests_extracted: number;
        confidence_score: number;
        nlp_models: Record<string, string>;
    };
}

export default function Home() {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setResult(null);
            setError(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setLoading(true);
        setError(null);

        try {
            const secretKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || '';
            const base64Data = await fileToBase64(file);

            const payload = {
                filename: file.name,
                file_data: base64Data,
                file_type: file.name.toLowerCase().endsWith('.pdf') ? 'pdf' : 'image',
                patient_id: 'WEB_001'
            };

            const payloadString = JSON.stringify(payload);
            const compressed = compress(new TextEncoder().encode(payloadString));
            const compressedB64 = arrayBufferToBase64(compressed);
            const encrypted = encrypt(compressedB64, secretKey);

            const response = await fetch('/api/analyze-clinical', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(encrypted)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Upload failed');
            }

            const encryptedResponse = await response.json();
            const decrypted = decrypt(
                encryptedResponse.ciphertext,
                encryptedResponse.nonce,
                secretKey
            );

            const analysisResult = JSON.parse(decrypted);
            setResult(analysisResult);

        } catch (err) {
            console.error('Upload failed:', err);
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    const calculateHealthScore = (result: AnalysisResult) => {
        if (!result.test_results.length) return 0;
        const normalTests = result.test_results.filter(t => t.status === 'normal').length;
        return Math.round((normalTests / result.test_results.length) * 100);
    };

    return (
        <main className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {!result && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">
                                        Health Dashboard
                                    </h1>
                                    <p className="text-gray-600 mt-2">
                                        Upload your lab report for AI-powered analysis
                                    </p>
                                </div>
                            </div>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Upload className="w-5 h-5" />
                                    Upload Lab Report
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-500 transition-colors bg-gray-50">
                                    <input
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        id="file-upload"
                                    />
                                    <label htmlFor="file-upload" className="cursor-pointer">
                                        <Upload className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                                        <p className="text-lg font-medium text-gray-700">
                                            {file ? file.name : 'Click to upload or drag and drop'}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-2">
                                            PDF, JPG, PNG up to 10MB
                                        </p>
                                    </label>
                                </div>

                                <Button
                                    onClick={handleUpload}
                                    disabled={!file || loading}
                                    className="w-full"
                                    size="lg"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                            Analyzing Report...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-5 h-5 mr-2" />
                                            Analyze Lab Report
                                        </>
                                    )}
                                </Button>

                                {error && (
                                    <Alert variant="destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}

                {result && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                            <div className="flex items-center justify-between">
                                <h1 className="text-3xl font-bold text-gray-900">Health Dashboard</h1>
                                <Button className="gap-2">
                                    <Download className="h-4 w-4" />
                                    <span className='hidden md:block'>Download Report</span>
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            <div className="lg:col-span-3 space-y-6 order-last lg:order-first">
                                <Card className='sticky top-2.5'>
                                    <CardHeader>
                                        <CardTitle className="text-base font-semibold">Charts</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        {result.test_results.slice(0, 6).map((test, idx) => (
                                            <TestMiniChart key={idx} test={test} />
                                        ))}
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="lg:col-span-6 space-y-6">
                                <Card>
                                    <CardContent className="pt-6">
                                        <HealthScoreCircle score={calculateHealthScore(result)} />
                                    </CardContent>
                                </Card>


                                <Card>
                                    <CardHeader>
                                        <CardTitle>AI Summary</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {result.patient_friendly_summary && (
                                            <div className="space-y-4">
                                                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                                    <p className="text-sm text-gray-700">
                                                        {result.patient_friendly_summary.explanation}
                                                    </p>
                                                </div>

                                                {result.patient_friendly_summary.areas_of_concern?.length > 0 && (
                                                    <div className="space-y-3">
                                                        <h4 className="font-semibold text-base flex items-center gap-2">
                                                            <AlertCircle className="h-5 w-5 text-red-600" />
                                                            Areas That Need Attention
                                                        </h4>
                                                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                                        {result.patient_friendly_summary.areas_of_concern.map((area: any, idx: number) => (
                                                            <div key={idx} className="p-4 bg-red-50 rounded-lg border border-red-200 space-y-2">
                                                                <p className="text-sm font-semibold text-red-900">{area.finding}</p>
                                                                <p className="text-xs text-red-700">{area.explanation}</p>
                                                                {area.severity && (
                                                                    <Badge variant="destructive" className="text-xs">
                                                                        {area.severity}
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        ))}

                                                        <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                                                            <h5 className="font-semibold text-sm text-amber-900 mb-2 flex items-center gap-2">
                                                                <CheckCircle className="h-4 w-4" />
                                                                What You Should Do Next
                                                            </h5>
                                                            <ul className="space-y-2">
                                                                {result.patient_friendly_summary.next_steps?.map((step: string, idx: number) => (
                                                                    <li key={idx} className="text-xs text-amber-800 flex gap-2">
                                                                        <span className="text-amber-600">•</span>
                                                                        <span>{step}</span>
                                                                    </li>
                                                                ))}
                                                                {(!result.patient_friendly_summary.next_steps ||
                                                                    result.patient_friendly_summary.next_steps.length === 0) && (
                                                                        <>
                                                                            <li className="text-xs text-amber-800 flex gap-2">
                                                                                <span className="text-amber-600">•</span>
                                                                                <span>Consult with your healthcare provider to discuss these results</span>
                                                                            </li>
                                                                            <li className="text-xs text-amber-800 flex gap-2">
                                                                                <span className="text-amber-600">•</span>
                                                                                <span>Schedule a follow-up appointment within 1-2 weeks</span>
                                                                            </li>
                                                                            <li className="text-xs text-amber-800 flex gap-2">
                                                                                <span className="text-amber-600">•</span>
                                                                                <span>Monitor your symptoms and keep a health diary</span>
                                                                            </li>
                                                                            <li className="text-xs text-amber-800 flex gap-2">
                                                                                <span className="text-amber-600">•</span>
                                                                                <span>Consider lifestyle modifications as recommended by your doctor</span>
                                                                            </li>
                                                                        </>
                                                                    )}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                )}

                                                {result.patient_friendly_summary.key_findings?.length > 0 && (
                                                    <div className="space-y-2">
                                                        <h4 className="font-semibold text-sm flex items-center gap-2">
                                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                                            Key Findings
                                                        </h4>
                                                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                                        {result.patient_friendly_summary.key_findings.map((finding: any, idx: number) => (
                                                            <div key={idx} className="p-3 bg-green-50 rounded-lg border border-green-200">
                                                                <p className="text-sm font-medium text-green-900">{finding.finding}</p>
                                                                <p className="text-xs text-green-700 mt-1">{finding.explanation}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Test Results</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="border-b bg-gray-50">
                                                        <th className="text-left p-3 font-semibold">Test Name</th>
                                                        <th className="text-left p-3 font-semibold">Your Value</th>
                                                        <th className="text-left p-3 font-semibold">Unit</th>
                                                        <th className="text-left p-3 font-semibold">Normal Range</th>
                                                        <th className="text-left p-3 font-semibold">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {result.test_results.map((test, idx) => (
                                                        <tr key={idx} className="border-b hover:bg-gray-50">
                                                            <td className="p-3 font-medium">{test.test_name}</td>
                                                            <td className="p-3">{test.value}</td>
                                                            <td className="p-3 text-gray-600">{test.unit}</td>
                                                            <td className="p-3 text-gray-600">
                                                                {test.reference_range
                                                                    ? `${test.reference_range.min}-${test.reference_range.max}`
                                                                    : 'N/A'
                                                                }
                                                            </td>
                                                            <td className="p-3">
                                                                <Badge
                                                                    variant={test.status === 'normal' ? 'default' : 'destructive'}
                                                                    className={test.status === 'normal' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}
                                                                >
                                                                    {test.status === 'normal' ? 'Normal' : 'Abnormal'}
                                                                </Badge>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Model Information</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-xs text-gray-500">Model Version</p>
                                                <p className="text-sm font-semibold">{result.metadata.model_version}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Confidence Score</p>
                                                <p className="text-sm font-semibold">
                                                    {(result.metadata.confidence_score * 100).toFixed(1)}%
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Processing Date</p>
                                                <p className="text-sm font-semibold">{result.metadata.processing_date}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Tests Extracted</p>
                                                <p className="text-sm font-semibold">{result.metadata.tests_extracted}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                            <div className="lg:col-span-3 space-y-6">
                                <div className="sticky top-2.5 space-y-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-base font-semibold">Body Map</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <HumanBodyDiagram abnormalResults={result.test_results.filter(t => t.status !== 'normal')} />
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-base font-semibold">Test Panel</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-3">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-500">Status:</span>
                                                    <Badge variant={result.test_results.some(t => t.status !== 'normal') ? 'destructive' : 'default'}>
                                                        {result.test_results.some(t => t.status !== 'normal') ? 'Critical' : 'Normal'}
                                                    </Badge>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-500">Tests Analysed:</span>
                                                    <span className="font-medium">{result.test_results.length}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-500">Process Time:</span>
                                                    <span className="font-medium">{result.processing_time.toFixed(3)} sec</span>
                                                </div>
                                                <div className="mt-4 pt-4 border-t">
                                                    <h4 className="text-xs font-semibold mb-2">Blood Count</h4>
                                                    <div className="space-y-2">
                                                        <div className="flex justify-between text-xs">
                                                            <span className="text-gray-500">Total:</span>
                                                            <span className="font-medium">{result.test_results.length}</span>
                                                        </div>
                                                        <div className="flex justify-between text-xs">
                                                            <span className="text-gray-500">Abnormal:</span>
                                                            <span className="text-red-600 font-medium">
                                                                {result.test_results.filter(t => t.status !== 'normal').length}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
