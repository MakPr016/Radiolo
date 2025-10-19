'use client';

import { useState } from 'react';
import { encrypt, decrypt, compress, fileToBase64, arrayBufferToBase64 } from '@/lib/cryptoPipeline2';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Upload,
    FileText,
    Clock,
    Activity,
    AlertCircle,
    CheckCircle,
    Loader2,
    Download,
    TrendingUp,
    TrendingDown,
    Minus,
    Beaker,
    Heart,
    Droplets,
    Brain,
    Info
} from 'lucide-react';

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

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'normal':
                return <CheckCircle className="w-4 h-4 text-green-600" />;
            case 'low':
            case 'high':
                return <AlertCircle className="w-4 h-4 text-orange-600" />;
            case 'critical_low':
            case 'critical_high':
                return <AlertCircle className="w-4 h-4 text-red-600" />;
            default:
                return <Minus className="w-4 h-4 text-gray-600" />;
        }
    };

    const getStatusColor = (status: string) => {
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

    const calculateHealthScore = (result: AnalysisResult) => {
        if (!result.test_results.length) return 0;
        const normalTests = result.test_results.filter(t => t.status === 'normal').length;
        return Math.round((normalTests / result.test_results.length) * 100);
    };

    const getTestProgress = (test: TestResult) => {
        if (!test.reference_range) return 50;
        const { min, max } = test.reference_range;
        const range = max - min;
        const position = ((test.value - min) / range) * 100;
        return Math.max(0, Math.min(100, position));
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Lab Report Analysis
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">
                                AI-powered medical lab report processing with NER + ClinicalDistilBERT
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="flex items-center gap-1">
                                <Activity className="w-3 h-3" />
                                16+ Tests
                            </Badge>
                            <Badge variant="secondary" className="flex items-center gap-1">
                                <Brain className="w-3 h-3" />
                                AI Powered
                            </Badge>
                        </div>
                    </div>
                </div>

                <Card className="border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-blue-500 transition-all">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Upload className="w-5 h-5" />
                            Upload Lab Report
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-12 text-center hover:border-blue-500 transition-colors bg-gray-50 dark:bg-gray-900">
                            <input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={handleFileChange}
                                className="hidden"
                                id="file-upload"
                            />
                            <label htmlFor="file-upload" className="cursor-pointer">
                                <Upload className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                                <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
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
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            size="lg"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Analyzing Report...
                                </>
                            ) : (
                                <>
                                    <Activity className="w-5 h-5 mr-2" />
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

                {result && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm opacity-90">Health Score</p>
                                            <p className="text-3xl font-bold mt-1">{calculateHealthScore(result)}</p>
                                        </div>
                                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                                            <Heart className="w-8 h-8" />
                                        </div>
                                    </div>
                                    <Progress value={calculateHealthScore(result)} className="mt-4 bg-white/20" />
                                </CardContent>
                            </Card>

                            <Card className={result.abnormal_results.length > 0 ? 'bg-gradient-to-br from-red-500 to-red-600 text-white' : 'bg-gradient-to-br from-green-500 to-green-600 text-white'}>
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm opacity-90">Status</p>
                                            <p className="text-2xl font-bold mt-1">
                                                {result.abnormal_results.length > 0 ? 'Abnormal' : 'Normal'}
                                            </p>
                                        </div>
                                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                                            {result.abnormal_results.length > 0 ?
                                                <AlertCircle className="w-8 h-8" /> :
                                                <CheckCircle className="w-8 h-8" />
                                            }
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm opacity-90">Tests Analyzed</p>
                                            <p className="text-3xl font-bold mt-1">{result.test_results.length}</p>
                                        </div>
                                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                                            <Beaker className="w-8 h-8" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm opacity-90">Processing Time</p>
                                            <p className="text-3xl font-bold mt-1">{result.processing_time}s</p>
                                        </div>
                                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                                            <Clock className="w-8 h-8" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <Tabs defaultValue="overview" className="w-full">
                            <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="overview">Overview</TabsTrigger>
                                <TabsTrigger value="detailed">Detailed Results</TabsTrigger>
                                <TabsTrigger value="insights">AI Insights</TabsTrigger>
                                <TabsTrigger value="panels">Test Panels</TabsTrigger>
                            </TabsList>

                            <TabsContent value="overview" className="space-y-6">
                                {result.patient_friendly_summary && (
                                    <Card className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-white dark:from-blue-950 dark:to-gray-900">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
                                                <Info className="w-5 h-5" />
                                                What Does This Mean? (Patient-Friendly Explanation)
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-blue-200">
                                                <Badge className={
                                                    result.patient_friendly_summary.overall_status.includes('URGENT') ? 'bg-red-600' :
                                                        result.patient_friendly_summary.overall_status.includes('ABNORMALITIES') ? 'bg-orange-500' :
                                                            'bg-green-600'
                                                }>
                                                    {result.patient_friendly_summary.overall_status}
                                                </Badge>
                                                <p className="mt-3 text-gray-700 dark:text-gray-300">
                                                    {result.patient_friendly_summary.explanation}
                                                </p>
                                            </div>

                                            {result.patient_friendly_summary.key_findings.length > 0 && (
                                                <div>
                                                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                                        Your Normal Results Explained
                                                    </h4>
                                                    <div className="space-y-2">
                                                        {result.patient_friendly_summary.key_findings.map((item, idx) => (
                                                            <div key={idx} className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                                                                <p className="font-medium text-sm text-green-900 dark:text-green-100">
                                                                    {item.finding}
                                                                </p>
                                                                <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                                                                    💡 {item.explanation}
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {result.patient_friendly_summary.areas_of_concern.length > 0 && (
                                                <div>
                                                    <h4 className="font-semibold mb-3 flex items-center gap-2 text-red-900 dark:text-red-100">
                                                        <AlertCircle className="w-4 h-4 text-red-600" />
                                                        Areas That Need Attention
                                                    </h4>
                                                    <div className="space-y-2">
                                                        {result.patient_friendly_summary.areas_of_concern.map((item, idx) => (
                                                            <div key={idx} className={`p-3 rounded-lg border ${item.severity === 'critical'
                                                                    ? 'bg-red-100 dark:bg-red-950 border-red-300'
                                                                    : 'bg-orange-100 dark:bg-orange-950 border-orange-300'
                                                                }`}>
                                                                <p className="font-medium text-sm">
                                                                    {item.finding}
                                                                </p>
                                                                <p className="text-xs mt-1">
                                                                    ⚠️ {item.explanation}
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4">
                                                <h4 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">
                                                    What Should You Do Next?
                                                </h4>
                                                <ul className="space-y-2">
                                                    {result.patient_friendly_summary.next_steps.map((step, idx) => (
                                                        <li key={idx} className="flex items-start gap-2 text-sm text-blue-800 dark:text-blue-200">
                                                            <span className="text-blue-600 font-bold">{idx + 1}.</span>
                                                            {step}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Activity className="w-5 h-5" />
                                            Technical Assessment
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                                            <p className="text-sm text-blue-900 dark:text-blue-100">
                                                {result.ai_summary.overall_assessment}
                                            </p>
                                        </div>

                                        {result.ai_summary.key_abnormalities.length > 0 && (
                                            <div>
                                                <h4 className="font-semibold mb-2 flex items-center gap-2">
                                                    <AlertCircle className="w-4 h-4 text-red-600" />
                                                    Key Abnormalities
                                                </h4>
                                                <div className="space-y-2">
                                                    {result.ai_summary.key_abnormalities.map((abnormality, idx) => (
                                                        <div key={idx} className="p-3 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
                                                            <p className="text-sm text-red-900 dark:text-red-100">{abnormality}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {result.ai_summary.recommendations.length > 0 && (
                                            <div>
                                                <h4 className="font-semibold mb-2">Recommendations</h4>
                                                <ul className="space-y-2">
                                                    {result.ai_summary.recommendations.map((rec, idx) => (
                                                        <li key={idx} className="flex items-start gap-2 text-sm">
                                                            <span className="text-blue-600 mt-0.5">•</span>
                                                            <span>{rec}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {result.test_results.slice(0, 6).map((test, idx) => (
                                        <Card key={idx} className="overflow-hidden">
                                            <CardContent className="p-6">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex-1">
                                                        <p className="font-semibold text-sm">{test.test_name}</p>
                                                        <p className="text-xs text-gray-500 mt-1">{test.unit}</p>
                                                    </div>
                                                    {getStatusIcon(test.status)}
                                                </div>

                                                <div className="flex items-end gap-2 mb-3">
                                                    <span className="text-3xl font-bold">{test.value}</span>
                                                    <span className="text-sm text-gray-500 pb-1">{test.unit}</span>
                                                </div>

                                                {test.reference_range && (
                                                    <>
                                                        <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-2">
                                                            <div
                                                                className={`absolute h-full rounded-full ${test.status === 'normal' ? 'bg-green-500' :
                                                                        test.status.includes('critical') ? 'bg-red-500' : 'bg-orange-500'
                                                                    }`}
                                                                style={{ width: `${getTestProgress(test)}%` }}
                                                            />
                                                        </div>
                                                        <div className="flex justify-between text-xs text-gray-500">
                                                            <span>{test.reference_range.min}</span>
                                                            <span>Normal Range</span>
                                                            <span>{test.reference_range.max}</span>
                                                        </div>
                                                    </>
                                                )}

                                                <Badge className={`mt-3 ${getStatusColor(test.status)}`}>
                                                    {test.status.replace('_', ' ').toUpperCase()}
                                                </Badge>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </TabsContent>

                            <TabsContent value="detailed" className="space-y-4">
                                {result.test_results.map((test, idx) => (
                                    <Card key={idx}>
                                        <CardContent className="p-6">
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                <div className="md:col-span-2">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        {getStatusIcon(test.status)}
                                                        <h3 className="font-semibold">{test.test_name}</h3>
                                                    </div>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        {test.clinical_significance}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-sm text-gray-500">Your Value</p>
                                                    <p className="text-2xl font-bold">{test.value} <span className="text-sm font-normal">{test.unit}</span></p>
                                                </div>

                                                <div>
                                                    <p className="text-sm text-gray-500">Normal Range</p>
                                                    {test.reference_range ? (
                                                        <p className="text-sm font-semibold">
                                                            {test.reference_range.min} - {test.reference_range.max} {test.reference_range.unit}
                                                        </p>
                                                    ) : (
                                                        <p className="text-sm">N/A</p>
                                                    )}
                                                    {test.deviation_percentage > 0 && (
                                                        <p className="text-xs text-red-600 mt-1">
                                                            {test.status.includes('high') ? '+' : '-'}{test.deviation_percentage.toFixed(1)}% deviation
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {test.reference_range && (
                                                <div className="mt-4">
                                                    <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full">
                                                        <div
                                                            className={`absolute h-full rounded-full ${test.status === 'normal' ? 'bg-green-500' :
                                                                    test.status.includes('critical') ? 'bg-red-500' : 'bg-orange-500'
                                                                }`}
                                                            style={{ width: `${getTestProgress(test)}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </TabsContent>

                            <TabsContent value="insights" className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Clinical Insights (ClinicalDistilBERT)</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                                                <p className="text-sm text-purple-600 dark:text-purple-400">Clinical Relevance</p>
                                                <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                                                    {result.clinical_insights.clinical_relevance_score}/100
                                                </p>
                                            </div>
                                            <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                                                <p className="text-sm text-blue-600 dark:text-blue-400">Embedding Dimension</p>
                                                <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                                                    {result.clinical_insights.embedding_dimension}
                                                </p>
                                            </div>
                                        </div>

                                        {result.clinical_insights.abnormality_patterns.length > 0 && (
                                            <div>
                                                <h4 className="font-semibold mb-3">Abnormality Patterns</h4>
                                                {result.clinical_insights.abnormality_patterns.map((pattern, idx) => (
                                                    <div key={idx} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg mb-2">
                                                        <p className="text-sm">{pattern}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {result.clinical_insights.status_flags.length > 0 && (
                                            <div>
                                                <h4 className="font-semibold mb-3">Status Flags</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {result.clinical_insights.status_flags.map((flag, idx) => (
                                                        <Badge key={idx} variant="outline">
                                                            {flag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Model Information</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-500">Model Version</p>
                                                <p className="font-semibold">{result.metadata.model_version}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Confidence Score</p>
                                                <p className="font-semibold">{(result.metadata.confidence_score * 100).toFixed(1)}%</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 mb-2">NLP Models Used</p>
                                            {Object.entries(result.metadata.nlp_models).map(([key, value]) => (
                                                <div key={key} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-900 rounded mb-1">
                                                    <span className="text-sm font-medium">{key}</span>
                                                    <span className="text-sm text-gray-600 dark:text-gray-400">{value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="panels" className="space-y-4">
                                {result.test_panels.map((panel, idx) => (
                                    <Card key={idx}>
                                        <CardHeader>
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="flex items-center gap-2">
                                                    <Droplets className="w-5 h-5" />
                                                    {panel.panel_name}
                                                </CardTitle>
                                                <Badge className={panel.panel_status === 'normal' ? 'bg-green-500' : 'bg-red-500'}>
                                                    {panel.panel_status}
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-2 gap-4 mb-4">
                                                <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                                    <p className="text-sm text-gray-500">Total Tests</p>
                                                    <p className="text-2xl font-bold">{panel.total_tests}</p>
                                                </div>
                                                <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                                    <p className="text-sm text-gray-500">Abnormal</p>
                                                    <p className="text-2xl font-bold">{panel.abnormal_count}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 mb-2">Tests in Panel</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {panel.tests_included.map((test, testIdx) => (
                                                        <Badge key={testIdx} variant="outline">
                                                            {test}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </TabsContent>
                        </Tabs>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span>Report Details</span>
                                    <Button variant="outline" size="sm">
                                        <Download className="w-4 h-4 mr-2" />
                                        Download PDF
                                    </Button>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Report ID</p>
                                        <p className="font-semibold">{result.report_id}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Category</p>
                                        <p className="font-semibold capitalize">{result.classification.test_category}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Urgency</p>
                                        <Badge className={
                                            result.classification.urgency_level === 'critical' ? 'bg-red-500' :
                                                result.classification.urgency_level === 'abnormal' ? 'bg-orange-500' : 'bg-green-500'
                                        }>
                                            {result.classification.urgency_level}
                                        </Badge>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Processing Date</p>
                                        <p className="font-semibold">
                                            {new Date(result.metadata.processing_date).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </main>
    );
}
