import connectToDatabase from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText, Clock, Activity, AlertCircle, CheckCircle, XCircle, Info, Download, ArrowLeft, Lightbulb, ShieldAlert } from 'lucide-react'
import {
  Carousel,
  CarouselMainContainer,
  CarouselThumbsContainer,
  SliderMainItem,
  SliderThumbItem,
} from '@/components/ui/carousel-image'
import TestMiniChart from '@/components/TestMiniChart'
import HumanBodyDiagram from '@/components/HumanBodyDiagram'
import HealthScoreCircle from '@/components/HealthScoreCircle'
import Link from 'next/link'

type Props = {
  params: { id: string }
}

interface RadiologyAnalysis {
  status: string
  processing_time: number
  filename: string
  input_type: string
  ocr_used: boolean
  ocr_engine: string
  raw_text: string
  text_length: number
  entities: Array<{
    text: string
    label: string
    start: number
    end: number
    confidence: number
  }>
  images?: Array<{
    page: number
    format: string
    width: number
    height: number
    data: string
  }>
  structured_report: {
    anatomy: string[]
    all_observations: string[]
    positive_findings: string[]
    negative_findings: string[]
    critical_findings: string[]
  }
  summary: {
    total_entities: number
    anatomy_count: number
    observations_count: number
    has_critical_findings: boolean
    has_abnormalities: boolean
  }
  patient_friendly_summary: {
    overall_status: string
    key_findings: Array<{
      finding: string
      explanation: string
    }>
    areas_of_concern: Array<{
      finding: string
      explanation: string
      severity: string
    }>
    next_steps: string[]
    explanation: string
  }
  recommendations: string[]
}

interface ClinicalAnalysis {
  status: string
  processing_time: number
  test_results: Array<{
    test_name: string
    value: number
    unit: string
    reference_range: {
      min: number
      max: number
      unit: string
    } | null
    status: string
  }>
  patient_friendly_summary: {
    explanation: string
    areas_of_concern: Array<{
      finding: string
      explanation: string
      severity: string
    }>
    key_findings: Array<{
      finding: string
      explanation: string
    }>
    next_steps: string[]
  }
  metadata: {
    model_version: string
    processing_date: string
    tests_extracted: number
    confidence_score: number
  }
}

export default async function ReportPage({ params }: Props) {
  const { id } = await params
  try {
    const { db } = await connectToDatabase()
    const reports = db.collection('reports')
    const doc = await reports.findOne({ _id: new ObjectId(id) })

    if (!doc) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 flex items-center justify-center">
          <Card>
            <CardContent className="p-8 text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Report Not Found</h2>
              <p className="text-gray-600 mb-4">The report you are looking for does not exist.</p>
              <Link href="/dashboard">
                <Button>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      )
    }

    const isRadiology = doc.type === 'radiology'
    const analysis = doc.analysis as RadiologyAnalysis | ClinicalAnalysis

    if (isRadiology) {
      const result = analysis as RadiologyAnalysis

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
                    {doc.patient?.name || 'Anonymous Patient'} • {new Date(doc.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Activity className="w-3 h-3" />
                    {doc.type}
                  </Badge>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </div>

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
                          {result.filename} • {new Date(doc.createdAt).toLocaleDateString()}
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
                          <span className="text-red-900 dark:text-red-100">HIGH PRIORITY</span>
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
                          <h4 className="font-semibold mb-2 text-blue-900 dark:text-blue-100 flex items-center gap-2">
                            <Lightbulb className="w-4 h-4" />
                            Key Findings Explained
                          </h4>
                          {result.patient_friendly_summary.key_findings.map((item, idx) => (
                            <div key={idx} className="mb-2 p-2 bg-white dark:bg-gray-800 rounded">
                              <p className="font-medium text-sm">{item.finding}</p>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 flex items-start gap-1">
                                <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                {item.explanation}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {result.patient_friendly_summary.areas_of_concern.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2 text-red-900 dark:text-red-100 flex items-center gap-2">
                            <ShieldAlert className="w-4 h-4" />
                            Areas of Concern
                          </h4>
                          {result.patient_friendly_summary.areas_of_concern.map((item, idx) => (
                            <div key={idx} className="mb-2 p-2 bg-red-100 dark:bg-red-900 rounded border border-red-300">
                              <p className="font-medium text-sm text-red-900 dark:text-red-100">
                                {item.finding}
                              </p>
                              <p className="text-xs text-red-700 dark:text-red-300 mt-1 flex items-start gap-1">
                                <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                {item.explanation}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      <div>
                        <h4 className="font-semibold mb-2 text-blue-900 dark:text-blue-100 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Next Steps
                        </h4>
                        <ul className="space-y-1">
                          {result.patient_friendly_summary.next_steps.map((step, idx) => (
                            <li key={idx} className="text-sm flex items-start gap-2 text-blue-800 dark:text-blue-200">
                              <span className="text-blue-600 mt-1">•</span>
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
          </div>
        </main>
      )
    } else {
      const result = analysis as ClinicalAnalysis
      
      const calculateHealthScore = () => {
        if (!result.test_results.length) return 0
        const normalTests = result.test_results.filter(t => t.status === 'normal').length
        return Math.round((normalTests / result.test_results.length) * 100)
      }

      return (
        <main className="min-h-screen bg-gray-50 p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Health Dashboard</h1>
                  <p className="text-gray-600 mt-1">
                    {doc.patient?.name || 'Anonymous Patient'} • {new Date(doc.createdAt).toLocaleDateString()}
                  </p>
                </div>
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
                    <HealthScoreCircle score={calculateHealthScore()} />
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
                            {result.patient_friendly_summary.areas_of_concern.map((area, idx) => (
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
                                {result.patient_friendly_summary.next_steps?.map((step, idx) => (
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
                            {result.patient_friendly_summary.key_findings.map((finding, idx) => (
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
        </main>
      )
    }
  } catch (err) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Error Loading Report</h2>
            <p className="text-gray-600 mb-4">{(err as Error).message}</p>
            <Link href="/dashboard">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }
}
