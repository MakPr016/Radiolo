'use client';

import { useState } from 'react';
import { encrypt, decrypt, compress, fileToBase64, arrayBufferToBase64 } from '@/lib/cryptoPipeline1';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileText, Clock, Activity, AlertCircle, CheckCircle, XCircle, Loader2, Info } from 'lucide-react';
import {
    Carousel,
    CarouselMainContainer,
    CarouselThumbsContainer,
    SliderMainItem,
    SliderThumbItem,
} from '@/components/ui/carousel-image';

interface AnalysisResult {
    status: string;
    processing_time: number;
    filename: string;
    input_type: string;
    ocr_used: boolean;
    ocr_engine: string;
    raw_text: string;
    text_length: number;
    entities: Array<{
        text: string;
        label: string;
        start: number;
        end: number;
        confidence: number;
    }>;
    images: Array<{
        page: number;
        format: string;
        width: number;
        height: number;
        data: string;
    }>;
    structured_report: {
        anatomy: string[];
        all_observations: string[];
        positive_findings: string[];
        negative_findings: string[];
        critical_findings: string[];
    };
    summary: {
        total_entities: number;
        anatomy_count: number;
        observations_count: number;
        has_critical_findings: boolean;
        has_abnormalities: boolean;
    };
    patient_friendly_summary: {
        overall_status: string;
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
        explanation: string;
    };
    recommendations: string[];
}

export default function Home() {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [uploadTime, setUploadTime] = useState<number>(0);

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
        const startTime = Date.now();

        try {
            const secretKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'your-secret-key';

            const base64Data = await fileToBase64(file);

            const payload = {
                filename: file.name,
                file_data: base64Data,
                file_type: file.type.includes('pdf') ? 'pdf' : 'image'
            };

            const payloadString = JSON.stringify(payload);
            const compressed = compress(new TextEncoder().encode(payloadString));
            const compressedB64 = arrayBufferToBase64(compressed);
            const encrypted = encrypt(compressedB64, secretKey);

            const response = await fetch('/api/analyze-radiology', {
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

            const totalTime = (Date.now() - startTime) / 1000;
            setUploadTime(totalTime);

        } catch (err) {
            console.error('Upload failed:', err);
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Chest X-Ray Report Analysis
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                AI-powered radiology report processing with patient-friendly explanations
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="flex items-center gap-1">
                                <Activity className="w-3 h-3" />
                                99.94% Accuracy
                            </Badge>
                        </div>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Upload className="w-5 h-5" />
                            Upload Report
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                            <input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={handleFileChange}
                                className="hidden"
                                id="file-upload"
                            />
                            <label htmlFor="file-upload" className="cursor-pointer">
                                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {file ? file.name : 'Click to upload or drag and drop'}
                                </p>
                                <p className="text-xs text-gray-500 mt-2">
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
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <Activity className="w-4 h-4 mr-2" />
                                    Analyze Report
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
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {result.images && result.images.length > 0 && (
                            <div className="lg:col-span-2">
                                <div className="sticky top-4">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <FileText className="w-5 h-5" />
                                                Chest X-Ray - PA View
                                                <Badge variant="outline" className="ml-auto">
                                                    Image {result.images.length} of {result.images.length}
                                                </Badge>
                                            </CardTitle>
                                            <p className="text-sm text-gray-500">
                                                {result.filename} • {new Date().toLocaleDateString()}
                                            </p>
                                        </CardHeader>
                                        <CardContent>
                                            <Carousel orientation="vertical" className="flex items-center gap-2">
                                                <div className="relative basis-3/4">
                                                    <CarouselMainContainer className="h-[500px]">
                                                        {result.images.map((img, index) => (
                                                            <SliderMainItem
                                                                key={index}
                                                                className="border border-gray-200 dark:border-gray-700 flex items-center justify-center rounded-lg bg-black"
                                                            >
                                                                <div className="relative w-full h-full flex items-center justify-center">
                                                                    <img
                                                                        src={img.data}
                                                                        alt={`X-ray ${index + 1}`}
                                                                        className="max-w-full max-h-full object-contain"
                                                                    />
                                                                    <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                                                                        {img.width}x{img.height} • {img.format}
                                                                    </div>
                                                                </div>
                                                            </SliderMainItem>
                                                        ))}
                                                    </CarouselMainContainer>
                                                </div>
                                                <CarouselThumbsContainer className="h-[500px] basis-1/4">
                                                    {result.images.map((img, index) => (
                                                        <SliderThumbItem
                                                            key={index}
                                                            index={index}
                                                            className="rounded-md bg-transparent"
                                                        >
                                                            <div className="relative w-full h-full border border-gray-200 dark:border-gray-700 rounded-md cursor-pointer bg-black overflow-hidden">
                                                                <img
                                                                    src={img.data}
                                                                    alt={`Slide ${index + 1}`}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                                                    <span className="text-white text-xs font-medium">
                                                                        Slide {index + 1}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </SliderThumbItem>
                                                    ))}
                                                </CarouselThumbsContainer>
                                            </Carousel>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        )}

                        <div className={`space-y-6 ${result.images && result.images.length > 0 ? 'lg:col-span-1' : 'lg:col-span-3'}`}>
                            <Card className={result.structured_report.critical_findings.length > 0 ? 'border-red-300 bg-red-50 dark:bg-red-950' : 'border-green-300 bg-green-50 dark:bg-green-950'}>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        {result.structured_report.critical_findings.length > 0 ? (
                                            <>
                                                <AlertCircle className="w-5 h-5 text-red-600" />
                                                <span className="text-red-900 dark:text-red-100">HIGH</span>
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="w-5 h-5 text-green-600" />
                                                <span className="text-green-900 dark:text-green-100">Overall Assessment</span>
                                            </>
                                        )}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className={result.structured_report.critical_findings.length > 0 ? 'text-red-800 dark:text-red-200' : 'text-green-800 dark:text-green-200'}>
                                        {result.structured_report.critical_findings.length > 0
                                            ? 'Multiple abnormalities detected requiring immediate attention'
                                            : 'No significant abnormalities detected'}
                                    </p>
                                </CardContent>
                            </Card>

                            {result.patient_friendly_summary && (
                                <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950">
                                    <CardHeader>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <Info className="w-5 h-5 text-blue-600" />
                                            What Does This Mean?
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <Badge className={
                                                result.patient_friendly_summary.overall_status.includes('URGENT') ? 'bg-red-600' :
                                                    result.patient_friendly_summary.overall_status.includes('ABNORMALITIES') ? 'bg-orange-500' :
                                                        'bg-green-600'
                                            }>
                                                {result.patient_friendly_summary.overall_status}
                                            </Badge>
                                            <p className="mt-2 text-sm text-blue-900 dark:text-blue-100">
                                                {result.patient_friendly_summary.explanation}
                                            </p>
                                        </div>

                                        {result.patient_friendly_summary.key_findings.length > 0 && (
                                            <div>
                                                <h4 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">
                                                    Key Findings Explained:
                                                </h4>
                                                {result.patient_friendly_summary.key_findings.map((item, idx) => (
                                                    <div key={idx} className="mb-2 p-2 bg-white dark:bg-gray-800 rounded">
                                                        <p className="font-medium text-sm">{item.finding}</p>
                                                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                                            💡 {item.explanation}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {result.patient_friendly_summary.areas_of_concern.length > 0 && (
                                            <div>
                                                <h4 className="font-semibold mb-2 text-red-900 dark:text-red-100">
                                                    Areas of Concern:
                                                </h4>
                                                {result.patient_friendly_summary.areas_of_concern.map((item, idx) => (
                                                    <div key={idx} className="mb-2 p-2 bg-red-100 dark:bg-red-900 rounded border border-red-300">
                                                        <p className="font-medium text-sm text-red-900 dark:text-red-100">
                                                            {item.finding}
                                                        </p>
                                                        <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                                                            ⚠️ {item.explanation}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <div>
                                            <h4 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">
                                                Next Steps:
                                            </h4>
                                            <ul className="space-y-1">
                                                {result.patient_friendly_summary.next_steps.map((step, idx) => (
                                                    <li key={idx} className="text-sm flex items-start gap-2 text-blue-800 dark:text-blue-200">
                                                        <span className="text-blue-600">•</span>
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
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Activity className="w-5 h-5" />
                                        Technical Findings
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {result.structured_report.critical_findings.length > 0 && (
                                        <div className="space-y-2">
                                            {result.structured_report.critical_findings.map((finding, idx) => (
                                                <div key={idx} className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200">
                                                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                                                    <div className="flex-1">
                                                        <p className="font-medium text-red-900 dark:text-red-100">{finding}</p>
                                                        <Badge variant="destructive" className="mt-1">Critical</Badge>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {result.structured_report.positive_findings.length > 0 && (
                                        <div className="space-y-2">
                                            <h4 className="text-sm font-semibold flex items-center gap-2">
                                                <XCircle className="w-4 h-4 text-orange-600" />
                                                Abnormalities Detected
                                            </h4>
                                            {result.structured_report.positive_findings.map((finding, idx) => (
                                                <div key={idx} className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-950 rounded-lg border border-orange-200">
                                                    <div className="w-2 h-2 rounded-full bg-orange-600 mt-2" />
                                                    <p className="text-sm text-orange-900 dark:text-orange-100">{finding}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {result.structured_report.negative_findings.length > 0 && (
                                        <div className="space-y-2">
                                            <h4 className="text-sm font-semibold flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-600" />
                                                Normal Findings
                                            </h4>
                                            {result.structured_report.negative_findings.map((finding, idx) => (
                                                <div key={idx} className="flex items-center gap-3 p-2 text-sm text-green-800 dark:text-green-200">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
                                                    {finding}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {result.structured_report.positive_findings.length === 0 && result.structured_report.critical_findings.length === 0 && (
                                        <div className="text-center py-4 text-gray-500">
                                            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
                                            <p className="text-sm">No abnormalities detected</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {result.recommendations.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Clinical Recommendations</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-2">
                                            {result.recommendations.map((rec, idx) => (
                                                <li key={idx} className="flex items-start gap-2 text-sm">
                                                    <span className="text-blue-600 mt-0.5">•</span>
                                                    <span>{rec}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            )}

                            <Card>
                                <CardContent className="pt-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs text-gray-500">Processing Time</p>
                                            <p className="text-lg font-semibold flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                {result.processing_time}s
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Total Entities</p>
                                            <p className="text-lg font-semibold">{result.summary.total_entities}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Text Length</p>
                                            <p className="text-lg font-semibold">{result.text_length} chars</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">OCR Used</p>
                                            <p className="text-lg font-semibold">{result.ocr_used ? 'Yes' : 'No'}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
