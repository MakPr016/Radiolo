"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { X, Upload, FileText, Beaker, FlaskConical, Pill, CheckCircle2, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { encrypt, decrypt, compress, fileToBase64, arrayBufferToBase64 } from '@/lib/cryptoPipeline2'
import { encrypt as encryptRadiology, decrypt as decryptRadiology, compress as compressRadiology, fileToBase64 as fileToBase64Radiology, arrayBufferToBase64 as arrayBufferToBase64Radiology } from '@/lib/cryptoPipeline1'

type Patient = {
  name?: string
  age?: string
  gender?: string
  note?: string
  testDate?: string
}

export default function UploadPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [type, setType] = useState<'radiology' | 'bloodtest' | 'labreport' | 'prescription'>('radiology')
  const [file, setFile] = useState<File | null>(null)
  const [patient, setPatient] = useState<Patient>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [progress, setProgress] = useState(0)
  const [processingSteps, setProcessingSteps] = useState({
    encrypting: false,
    processing: false,
    extracting: false,
    analysing: false
  })

  function next() {
    if (step === 2 && !file) {
      setError('Please upload a file to continue')
      return
    }
    setError(null)
    setStep((s) => Math.min(4, s + 1))
  }

  function prev() {
    setStep((s) => Math.max(1, s - 1))
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (selectedFile: File) => {
    const maxSize = 20 * 1024 * 1024
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png']
    
    if (selectedFile.size > maxSize) {
      setError('File size exceeds 20MB')
      return
    }
    
    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Invalid file format. Please upload PDF, DOCX, JPG, or PNG')
      return
    }
    
    setFile(selectedFile)
    setError(null)
  }

  async function handleSubmit() {
    if (!file) {
      setError('Please select a file')
      return
    }

    setLoading(true)
    setError(null)
    setProgress(0)
    
    setProcessingSteps({ encrypting: true, processing: false, extracting: false, analysing: false })
    await new Promise(resolve => setTimeout(resolve, 500))
    setProgress(25)
    
    try {
      const secretKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || ''
      if (!secretKey) {
        throw new Error('Encryption key not configured')
      }

      const isRadiology = type === 'radiology'
      const analyzeEndpoint = isRadiology ? '/api/analyze-radiology' : '/api/analyze-clinical'
      
      let base64Data: string
      let encrypted: { ciphertext: string; nonce: string }
      
      if (isRadiology) {
        base64Data = await fileToBase64Radiology(file)
        const payload = {
          filename: file.name,
          file_data: base64Data,
          file_type: file.type.includes('pdf') ? 'pdf' : 'image'
        }
        const payloadString = JSON.stringify(payload)
        const compressed = compressRadiology(new TextEncoder().encode(payloadString))
        const compressedB64 = arrayBufferToBase64Radiology(compressed)
        encrypted = encryptRadiology(compressedB64, secretKey)
      } else {
        base64Data = await fileToBase64(file)
        const payload = {
          filename: file.name,
          file_data: base64Data,
          file_type: file.name.toLowerCase().endsWith('.pdf') ? 'pdf' : 'image',
          patient_id: patient.name || 'WEB_001'
        }
        const payloadString = JSON.stringify(payload)
        const compressed = compress(new TextEncoder().encode(payloadString))
        const compressedB64 = arrayBufferToBase64(compressed)
        encrypted = encrypt(compressedB64, secretKey)
      }

      setProcessingSteps({ encrypting: true, processing: true, extracting: false, analysing: false })
      await new Promise(resolve => setTimeout(resolve, 500))
      setProgress(50)

      const analysisRes = await fetch(analyzeEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(encrypted)
      })

      if (!analysisRes.ok) {
        const errorData = await analysisRes.json()
        throw new Error(errorData?.error || 'Analysis failed')
      }

      setProcessingSteps({ encrypting: true, processing: true, extracting: true, analysing: false })
      await new Promise(resolve => setTimeout(resolve, 500))
      setProgress(75)

      const encryptedResponse = await analysisRes.json()
      const decrypted = isRadiology 
        ? decryptRadiology(encryptedResponse.ciphertext, encryptedResponse.nonce, secretKey)
        : decrypt(encryptedResponse.ciphertext, encryptedResponse.nonce, secretKey)
      
      const analysisJson = JSON.parse(decrypted)

      setProcessingSteps({ encrypting: true, processing: true, extracting: true, analysing: true })
      setProgress(90)

      const saveRes = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          title: file.name,
          patient,
          fileName: file.name,
          size: file.size,
          analysis: analysisJson,
        }),
      })

      const saveJson = await saveRes.json()
      if (!saveRes.ok || !saveJson?.id) {
        throw new Error(saveJson?.error || 'Saving report failed')
      }

      setProgress(100)
      await new Promise(resolve => setTimeout(resolve, 300))
      router.push(`/report/${saveJson.id}`)
    } catch (err) {
      console.error('Upload error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
      setLoading(false)
      setProgress(0)
      setProcessingSteps({ encrypting: false, processing: false, extracting: false, analysing: false })
    }
  }

  const documentTypes = [
    { id: 'radiology', label: 'Radiology', description: 'X-Rays Reports', icon: FileText },
    { id: 'bloodtest', label: 'Blood Tests', description: 'Blood tests and Analysis Reports', icon: Beaker },
    { id: 'labreport', label: 'Lab Reports', description: 'Lab tests results', icon: FlaskConical },
    { id: 'prescription', label: 'Prescriptions', description: 'Medication Prescriptions', icon: Pill },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-5xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Upload Report</h1>
          </div>
          <Button variant="destructive" size="sm" onClick={() => router.back()}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </div>

        <div className="mb-12">
          <div className="flex items-center justify-center gap-4">
            {[
              { num: 1, label: 'Select Type' },
              { num: 2, label: 'Upload Report' },
              { num: 3, label: 'Add Details' },
              { num: 4, label: 'Process' }
            ].map((s, idx) => (
              <div key={s.num} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center font-semibold text-lg transition-all",
                    step >= s.num 
                      ? "bg-black dark:bg-white text-white dark:text-black" 
                      : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                  )}>
                    {s.num}
                  </div>
                  <span className="text-sm mt-2 font-medium text-gray-700 dark:text-gray-300">{s.label}</span>
                </div>
                {idx < 3 && (
                  <div className={cn(
                    "w-24 h-1 mx-2 mb-6 transition-all",
                    step > s.num ? "bg-black dark:bg-white" : "bg-gray-300 dark:bg-gray-600"
                  )} />
                )}
              </div>
            ))}
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-center mb-8">Select Document Type</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {documentTypes.map((docType) => {
                const Icon = docType.icon
                return (
                  <Card
                    key={docType.id}
                    className={cn(
                      "cursor-pointer transition-all hover:shadow-lg hover:scale-105",
                      type === docType.id && "ring-2 ring-black dark:ring-white"
                    )}
                    onClick={() => setType(docType.id as any)}
                  >
                    <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                      <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                        <Icon className="w-8 h-8 text-gray-700 dark:text-gray-300" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{docType.label}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{docType.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
            <div className="flex justify-center mt-8">
              <Button onClick={next} size="lg" className="px-8">
                Next
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-center mb-8">Upload Report</h2>
            <Card className="max-w-3xl mx-auto">
              <CardContent className="p-12">
                <div
                  className={cn(
                    "border-2 border-dashed rounded-lg p-16 text-center transition-all",
                    dragActive ? "border-black dark:border-white bg-gray-50 dark:bg-gray-800" : "border-gray-300 dark:border-gray-600",
                    file && "border-green-500 bg-green-50 dark:bg-green-900/20"
                  )}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-medium mb-2">
                    {file ? file.name : 'Drag and Drop report here or Click to Browse'}
                  </p>
                  <input
                    type="file"
                    accept=".pdf,.docx,.jpg,.jpeg,.png"
                    onChange={(e) => e.target.files && handleFileChange(e.target.files[0])}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload">
                    <Button variant="outline" className="mt-4" asChild>
                      <span>Browse Files</span>
                    </Button>
                  </label>
                </div>
                <p className="text-center text-sm text-gray-500 mt-4">
                  Supported formats: PDF, DOCX, JPG, PNG<br />
                  Maximum file size: 20MB
                </p>
                {error && <p className="text-red-600 text-center mt-4">{error}</p>}
              </CardContent>
            </Card>
            <div className="flex justify-center gap-4 mt-8">
              <Button variant="outline" onClick={prev} size="lg">
                Previous
              </Button>
              <Button onClick={next} size="lg" className="px-8 bg-green-600 hover:bg-green-700">
                Next
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-center mb-8">Add Patient Details</h2>
            <Card className="max-w-2xl mx-auto">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="name" className="text-base">Name</Label>
                    <Input
                      id="name"
                      placeholder="Name of your project"
                      value={patient.name ?? ''}
                      onChange={(e) => setPatient({ ...patient, name: e.target.value })}
                      className="mt-2"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="age" className="text-base">Age</Label>
                      <Input
                        id="age"
                        placeholder="Age"
                        value={patient.age ?? ''}
                        onChange={(e) => setPatient({ ...patient, age: e.target.value })}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="testDate" className="text-base">Test Date</Label>
                      <Input
                        id="testDate"
                        type="date"
                        value={patient.testDate ?? ''}
                        onChange={(e) => setPatient({ ...patient, testDate: e.target.value })}
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="gender" className="text-base">Gender</Label>
                    <Select value={patient.gender ?? ''} onValueChange={(value) => setPatient({ ...patient, gender: value })}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="note" className="text-base">Note</Label>
                    <Textarea
                      id="note"
                      placeholder="Type your note here"
                      value={patient.note ?? ''}
                      onChange={(e) => setPatient({ ...patient, note: e.target.value })}
                      className="mt-2 min-h-[100px]"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="flex justify-center gap-4 mt-8">
              <Button variant="outline" onClick={prev} size="lg">
                Previous
              </Button>
              <Button onClick={next} size="lg" className="px-8 bg-green-600 hover:bg-green-700">
                Next
              </Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            {!loading ? (
              <>
                <h2 className="text-2xl font-semibold text-center mb-8">Review & Submit</h2>
                <Card className="max-w-2xl mx-auto">
                  <CardContent className="p-8">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500">File</p>
                        <p className="font-medium">{file ? `${file.name} (${Math.round(file.size / 1024)} KB)` : 'No file selected'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Type</p>
                        <p className="font-medium capitalize">{type}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Patient</p>
                        <p className="font-medium">{patient.name ?? 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Age</p>
                        <p className="font-medium">{patient.age ?? 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Gender</p>
                        <p className="font-medium capitalize">{patient.gender ?? 'N/A'}</p>
                      </div>
                    </div>
                    {error && <p className="text-red-600 mt-4">{error}</p>}
                  </CardContent>
                </Card>
                <div className="flex justify-center gap-4 mt-8">
                  <Button variant="outline" onClick={prev} size="lg">
                    Previous
                  </Button>
                  <Button onClick={handleSubmit} size="lg" className="px-8 bg-blue-600 hover:bg-blue-700">
                    Submit
                  </Button>
                </div>
              </>
            ) : (
              <div className="max-w-2xl mx-auto text-center">
                <div className="relative w-48 h-48 mx-auto mb-8">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-gray-200 dark:text-gray-700"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 88}`}
                      strokeDashoffset={`${2 * Math.PI * 88 * (1 - progress / 100)}`}
                      className="text-green-500 transition-all duration-500"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-5xl font-bold">{progress}%</span>
                  </div>
                </div>

                <Card className="max-w-md mx-auto">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {[
                        { label: 'Encrypting files', key: 'encrypting' },
                        { label: 'Processing documents', key: 'processing' },
                        { label: 'Extracting data', key: 'extracting' },
                        { label: 'Analysing results', key: 'analysing' }
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between">
                          <span className="text-base">{item.label}</span>
                          {processingSteps[item.key as keyof typeof processingSteps] ? (
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                          ) : (
                            <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Button variant="outline" onClick={() => {
                  setLoading(false)
                  setProgress(0)
                  setProcessingSteps({ encrypting: false, processing: false, extracting: false, analysing: false })
                }} className="mt-8">
                  Cancel
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
